import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'
import * as exec from '@actions/exec'

declare const githubToken: string;
declare const githubClient: GitHub;

async function run(): Promise<void> {
  try {    
    // Config
    const gitUserEmail = "github-actions[bot]@users.noreply.github.com";
    const gitUserName = "github-actions[bot]";
    const prBranchName = "comment-run/npm-update";

    const baseBranchName: string = (context.payload as any).repository.default_branch;
    await exec.exec(`git config --global user.email "${gitUserEmail}"`);
    await exec.exec(`git config --global user.name "${gitUserName}"`);
    await exec.exec(`git fetch --all`);
    await exec.exec(`git checkout ${baseBranchName}`);
    await exec.exec(`git checkout -b ${prBranchName}`);
    
    const packageJson = JSON.parse(require('fs').readFileSync('package.json'));
    const depStr = Object.keys(packageJson.dependencies || {}).join(' ');
    const devDepStr = Object.keys(packageJson.devDependencies || {}).join(' ');
    await exec.exec(`npm i ${depStr} ${devDepStr}`);
    
    await exec.exec("git status");
    await exec.exec("git add package*json");
    await exec.exec(`git commit -m 'chore(deps): update npm dependencies'`);
    await exec.exec(`git push -fu origin ${prBranchName}`);
    
    (async () => {
      await githubClient.pulls.create({
        base: baseBranchName,
        head: prBranchName,
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: "chore(deps): update npm dependencies",
        body: "update npm dependencies",
      });
    })();
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
