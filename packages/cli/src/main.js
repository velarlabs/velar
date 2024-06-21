import { isCancel, note, outro, spinner, text } from "@clack/prompts";
import fs from "fs";
import { exec } from "node:child_process";
import path from "node:path";
import color from "picocolors";

export async function askProjectConfig() {
	const name = await text({
		message: "What would you like to name the new project?",
		placeholder: "my-project",
		defaultValue: "my-project",
	});

	if (isCancel(name)) {
		cancel("Operation cancelled");
		return process.exit(0);
	}

	return { name, installDependencies: true };
}

export async function setupRepo({ name }) {
	const s = spinner();
	s.start("Initializing project");

	const currentPath = process.cwd();
	const projectPath = path.join(currentPath, name);
	const gitRepo = "https://github.com/velarjs/starter.git";

	try {
		fs.mkdirSync(projectPath);
	} catch (err) {
		if (err.code === "EEXIST") {
			console.log(
				`The file ${name} already exist in the current directory, please give it another name.`
			);
			process.exit(1);
		} else {
			console.log(err);
			process.exit(1);
		}
	}

	try {
		const devNull = process.platform === "win32" ? "NUL" : "/dev/null";

		await new Promise((resolve, reject) => {
			exec(
				`git clone --depth 1 ${gitRepo} ${projectPath} > ${devNull} 2>&1`,
				(error) => {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				}
			);
		});
	} catch (error) {
		console.error("Failed to clone repository:", error.message);
		process.exit(1);
	}

	s.stop("Project initialized");
}

export const installDependencies = async ({ name }) => {
	const currentPath = process.cwd();
	const projectPath = path.join(currentPath, name);
	process.chdir(projectPath);

	const s = spinner();
	s.start("Installing dependencies");

	await new Promise((resolve, reject) => {
		const child = exec("npm install", (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	})
		.then(() => {
			s.stop("Dependencies installed");
		})
		.catch((error) => {
			s.stop("Failed to install dependencies:", error);
			process.exit(1);
		});
};

export const showOutro = ({ name, installDependencies }) => {
	let nextSteps = `cd ${name}        \n${
		installDependencies ? "" : "npm install\n"
	}npm run dev`;

	note(nextSteps, "You're all set! Next steps.");

	outro(
		`Problems? ${color.underline(
			color.cyan("https://github.com/velarjs/velar/issues")
		)}`
	);
};
