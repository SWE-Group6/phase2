// These functions will:
// 1. De-bloat packages by
//   a. decoding the base64 encoded files to binary.
//   b. unzip the package.
//   c. automate the removal of unnecessary files (arbitrarily decided).
//   d. minify files without compilation.
//   e. analyze dependencies.
//   f. recompress via imported algorithm.
//   g. re-encode back to binary64.

import { Buffer } from "buffer";
import AdmZip from "adm-zip"; // https://www.npmjs.com/package/adm-zip

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

	zip.getEntries().forEach((entry) => {
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
	zip.getEntries().forEach((entry) => {
		if (!entry.isDirectory && (entry.entryName.endsWith(".ts") || entry.entryName.endsWith(".json") || entry.entryName.endsWith(".html"))) {
			const originalContent = entry.getData().toString("utf-8");
			const minifiedContent = stripComments(originalContent);
			
			zip.updateFile(entry.entryName, Buffer.from(minifiedContent, "utf-8"));
		}
	});

	return zip;
}
