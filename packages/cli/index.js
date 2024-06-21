#!/usr/bin/env node

import { intro } from "@clack/prompts";
import { setTimeout as sleep } from "node:timers/promises";
import color from "picocolors";
import {
	askProjectConfig,
	installDependencies,
	setupRepo,
	showOutro,
} from "./src/main.js";

async function main() {
	console.log();
	intro(color.inverse(" velar-cli "));

	const config = await askProjectConfig();
	await setupRepo(config);

	if (config.installDependencies) {
		await installDependencies(config);
	}

	showOutro(config);

	await sleep(1000);
}

main().catch(console.error);
