import { Octokit } from "@octokit/core";
import fs from "node:fs/promises";
import path from "node:path";

const octokit = new Octokit({
  auth: `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`,
});

const ABI_DIR = "src/lib/ABIs";

var abiFiles = [];

async function updateABIs() {
  // Delete old ABIs
  for (const file of await fs.readdir(ABI_DIR)) {
    await fs.unlink(path.join(ABI_DIR, file));
  }

  await recurseDirectories("abi/contracts");

  console.log(abiFiles);

  for (let file of abiFiles) {
    let res = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: "Calica-xyz",
      repo: "revenue-share",
      path: file,
    });

    let fileName = res.data.name;
    let buffer = Buffer.from(res.data.content, "base64");
    let abi = JSON.parse(buffer.toString());

    await fs.writeFile(path.join(ABI_DIR, fileName), JSON.stringify(abi));
  }
}

async function recurseDirectories(path) {
  let res = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "Calica-xyz",
    repo: "revenue-share",
    path,
  });

  for (let obj of res.data) {
    if (obj.type == "dir") {
      await recurseDirectories(obj.path);
    } else {
      abiFiles.push(obj.path);
    }
  }
}

updateABIs();
