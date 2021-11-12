const core = require("@actions/core");
const sjson = require("secure-json-parse");
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

const [owner, repo] = core.getInput("repository").split("/");

console.log(`owner: ${owner}`);
console.log(`repository: ${repo}`);
const artifacts_string = core.getInput("artifacts");
console.log(`artifact string: ${artifacts_string}`);

async function run() {
  try {
    const artifacts = sjson.parse(core.getInput("artifacts"), {
      protoAction: "remove",
      constructorAction: "remove",
    });
    console.log(`artifacts: ${JSON.stringify(artifacts)}`);
    if (!Array.isArray(artifacts)) {
      core.setFailed(`artifact contains empty or invalid value: ${artifacts} `);
      return;
    }

    if (artifacts.length == 0) {
      console.log("There are no artifacts to delete!");
    }

    for (const artifact of artifacts) {
      try {
        console.log(`current artifact: ${JSON.stringify(artifact)}`);

        // See https://docs.github.com/en/rest/reference/actions#delete-an-artifact
        await octokit.request(
          "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}",
          {
            owner: owner,
            repo: repo,
            artifact_id: artifact.id,
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
