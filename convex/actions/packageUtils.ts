// These functions will:
// 1. De-bloat packages by
//   a. decoding the base64 encoded files to binary.
//   b. unzip the package.
//   c. automate the removal of unnecessary files (arbitrarily decided).
//   d. minify files without compilation.
//   e. analyze dependencies via dependency graph.
//   f. recompress via imported algorithm.
//   g. re-encode back to binary64.

"use node";

import { Buffer } from "buffer";
import AdmZip, { IZipEntry } from "adm-zip"; // https://www.npmjs.com/package/adm-zip
import { createHash } from "crypto"; 

// a. begin by decoding the base64 content.
function decodeBase64(base64String: string): Buffer {
	return Buffer.from(base64String, "base64");
}

// b. unzip the package.
function unzipFile(buffer: Buffer): AdmZip {
	const zip = new AdmZip(buffer);
	return zip;
}

// c. automated removal of unnecessary files.
function debloatWithRules(zip: AdmZip): AdmZip {
	const patternsToLookFor = [".md", ".txt", "__MACOSX", ".DS_Store", ".git", ".npmignore", "docs", "tests", "examples"]; // These files are not necessary for package to run.

	zip.getEntries().forEach((entry: IZipEntry) => {
		if (patternsToLookFor.some((pattern) => entry.entryName.includes(pattern))) {
			zip.deleteFile(entry.entryName);
		}
	});

	return zip;
}

// d. minify files without compilation.
// d1. strip comments
function stripComments(content: string): string {
	// Remove both single-line and multi-line comments.
	return content.replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '').trim();
}

function minifyFiles(zip: AdmZip): AdmZip {
	zip.getEntries().forEach((entry: IZipEntry) => {
		if (!entry.isDirectory && (entry.entryName.endsWith(".ts") || entry.entryName.endsWith(".json") || entry.entryName.endsWith(".html"))) {
			const originalContent = entry.getData().toString("utf-8");
			const minifiedContent = stripComments(originalContent);
			
			zip.updateFile(entry.entryName, Buffer.from(minifiedContent, "utf-8"));
		}
	});

	return zip;
}

// e. generate a mock dependency graph and remove unused files.
function generateDependencyGraph(zip: AdmZip): Set<string> {
	const dependencies = new Set<string>();

	zip.getEntries().forEach((entry: IZipEntry) => {
		if (!entry.isDirectory && entry.entryName.endsWith(".ts")) {
			const content = entry.getData().toString("utf-8");
			const matches = content.match(/import .* from '(.*)';/g);

			if (matches) {
				matches.forEach((match) => {
					const importedModule = match.split("from '")[1].replace("';", "");
					dependencies.add(importedModule);
				});
			}
		}
	});

	return dependencies;
}

function removeUnusedFiles(zip: AdmZip, dependencyGraph: Set<string>): AdmZip {
	zip.getEntries().forEach((entry: IZipEntry) => {
		if (!dependencyGraph.has(entry.entryName) && entry.entryName.endsWith(".ts")) {
			zip.deleteFile(entry.entryName);
		}
	});

	return zip;
}

function calculateHash(buffer: Buffer): string {
	return createHash("sha256").update(buffer).digest("hex");
}

function deduplicateFiles(zip: AdmZip): AdmZip {
	const hashes: { [key: string]: string } = {};

	zip.getEntries().forEach((entry: IZipEntry) => {
		if (!entry.isDirectory) {
			const hashValue = calculateHash(entry.getData());

			if (hashes[hashValue]) {
				zip.deleteFile(entry.entryName);
			} else {
				hashes[hashValue] = entry.entryName;
			}
		}
	});

	return zip;
}

// g. recompress.
function recompressZip(zip: AdmZip): Buffer {
	return zip.toBuffer();
}

// h. re-encode to base64.
function encodeToBase64(buffer: Buffer): string {
	return buffer.toString("base64");
}

// Finally, put it all together.
export function debloatBase64Package(base64String: string): string {
	const decodedBuffer = decodeBase64(base64String); // Step 1: Decode base64 to binary.

	let zip = unzipFile(decodedBuffer); // Step 2: Unzip the file.

	zip = debloatWithRules(zip); // Step 3: Remove unnecessary files.

	zip = minifyFiles(zip); // Step 4: Minify files.

	const dependencyGraph = generateDependencyGraph(zip); // Step 5: Generate dependency graph and remove unused files.
	zip = removeUnusedFiles(zip, dependencyGraph);

	zip = deduplicateFiles(zip); // Step 6: deduplicate files by comparing hashes.

	const recompressedBuffer = recompressZip(zip);

	return encodeToBase64(recompressedBuffer);
}
