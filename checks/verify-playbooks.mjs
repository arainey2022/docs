import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname;

const playbookRoutes = [
	"start-here/playbooks",
	"start-here/playbooks/test-before-going-live",
	"start-here/playbooks/gradually-roll-out-ai-support",
	"start-here/playbooks/prevent-ai-replies-to-certain-topics",
	"start-here/playbooks/prevent-ai-replies-to-certain-customers-or-brands",
	"start-here/playbooks/improve-a-specific-ai-response",
	"start-here/playbooks/see-what-the-ai-agent-did-to-a-ticket",
	"start-here/playbooks/change-ticket-status-or-assignment-after-an-ai-action",
	"start-here/playbooks/auto-close-or-archive-ai-handled-tickets",
	"start-here/playbooks/set-up-ai-agents-for-multiple-brands",
];

function fail(message) {
	throw new Error(message);
}

function assert(condition, message) {
	if (!condition) fail(message);
}

function read(relativePath) {
	return readFileSync(join(root, relativePath), "utf8");
}

function listMdx(directory) {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		return entry.isDirectory() ? listMdx(path) : entry.name.endsWith(".mdx") ? [path] : [];
	});
}

function findGroup(groups, name) {
	return groups.find((item) => typeof item === "object" && item.group === name);
}

const config = JSON.parse(read("docs.json"));
const navigationTrees = [config.navigation.pages, config.navigation.groups];

for (const [index, navigation] of navigationTrees.entries()) {
	assert(Array.isArray(navigation), `Navigation tree ${index + 1} is missing`);

	const startHere = findGroup(navigation, "Start here");
	const features = findGroup(navigation, "Features");
	assert(startHere, `Start here is missing from navigation tree ${index + 1}`);
	assert(features, `Features is missing from navigation tree ${index + 1}`);

	const playbooks = findGroup(startHere.pages, "Playbooks");
	assert(playbooks, `Playbooks is missing from navigation tree ${index + 1}`);
	assert(
		JSON.stringify(playbooks.pages) === JSON.stringify(playbookRoutes),
		`Playbooks routes are incomplete or out of order in navigation tree ${index + 1}`,
	);
	assert(!startHere.pages.includes("start-here/testing"), `Old Testing route remains in Start here tree ${index + 1}`);
	assert(features.pages.includes("features/testing"), `Testing is missing from Features tree ${index + 1}`);
}

for (const route of playbookRoutes) {
	assert(existsSync(join(root, `${route}.mdx`)), `Missing ${route}.mdx`);
}

assert(existsSync(join(root, "features/testing.mdx")), "Missing features/testing.mdx");
assert(!existsSync(join(root, "start-here/testing.mdx")), "start-here/testing.mdx still exists");

const testingRedirect = config.redirects.find((redirect) => redirect.source === "/start-here/testing");
assert(testingRedirect, "Missing /start-here/testing redirect");
assert(testingRedirect.destination === "/features/testing", "Testing redirect has the wrong destination");
assert(testingRedirect.permanent === true, "Testing redirect is not permanent");

const allMdx = listMdx(root);
for (const path of allMdx) {
	const content = readFileSync(path, "utf8");
	assert(!content.includes("](/start-here/testing)"), `Old Testing link remains in ${path}`);
}

const landing = read("start-here/playbooks.mdx");
const landingLinks = [...landing.matchAll(/href="(\/start-here\/playbooks\/[^\"]+)"/g)].map((match) => match[1]);
assert(landingLinks.length === 9, `Landing page has ${landingLinks.length} playbook links instead of 9`);
assert(new Set(landingLinks).size === 9, "Landing page contains a duplicate playbook link");

const requiredSignals = [
	"AI human handover",
	"AI topic blocked",
	"ai-agent-replied",
	"ai-agent-replied-note",
	"human-handover-requested",
	"ai-agent-tag-blocked",
	"ai_chat_status",
];
const signalPage = read("start-here/playbooks/see-what-the-ai-agent-did-to-a-ticket.mdx");
for (const signal of requiredSignals) {
	assert(signalPage.includes(signal), `Signal page is missing ${signal}`);
}

const autoClosePage = read("start-here/playbooks/auto-close-or-archive-ai-handled-tickets.mdx");
for (const value of ["myaskai-auto-close-pending", "Message From Agent", "Message Public", "Ticket Snooze Delay Ends"]) {
	assert(autoClosePage.includes(value), `Auto-close page is missing ${value}`);
}

for (const route of playbookRoutes.slice(1)) {
	const content = read(`${route}.mdx`);
	assert(/^---\ntitle: "[^"]+"\ndescription: "[^"]+"\n---/u.test(content), `${route}.mdx has invalid frontmatter`);
	assert(content.includes("## Related playbooks"), `${route}.mdx has no Related playbooks section`);
	assert(!/[—–“”‘’]/u.test(content), `${route}.mdx contains a disallowed punctuation character`);
	assert(!content.includes("and/or"), `${route}.mdx contains and/or`);

	for (const line of content.split("\n")) {
		if (!line.startsWith("|")) continue;
		const columns = line.split("|").length - 2;
		assert(columns <= 4, `${route}.mdx has a table with ${columns} columns`);
	}
}

console.log("Verified 1 landing page, 9 playbooks, 2 navigation trees, the Testing move, and the permanent redirect.");
