const core = require("@actions/core");
const sjson = require("secure-json-parse");
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

const [owner, repo] = core.getInput("repository").split("/");

console.log(`owner: ${owner}`);
console.log(`repository: ${repo}`);
const artifacts_string = core.getInput("artifacts");
console.log(`artifact string: ${artifacts_string}`);

// most @actions toolkit packages have async methods
async function run() {
  try {
    const artifacts = sjson.parse(core.getInput("artifacts"), {
      protoAction: "remove",
      constructorAction: "remove",
    });
    console.log(`artifacts: ${JSON.stringify(artifacts)}`);
    if (!Array.isArray(artifacts) || artifacts.length == 0) {
      core.setFailed(`artifact contains empty or invalid value: ${artifacts} `);
      return;
    }

    for (const artifact in artifacts) {
      try {
        await octokit.request(
          `DELETE /repos/{owner}/{repo}/actions/artifacts/${artifact.id}`,
          {
            owner,
            repo,
          }
        );
        console.log(`succesfuly deleted artifact id: ${artifact.id}`);
      } catch (e) {
        console.log(e);
      }
    }
  } catch (error) {
    core.setFailed(error);
  }
}

run();
