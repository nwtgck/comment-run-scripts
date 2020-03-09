import * as core from '@actions/core'
import {context} from '@actions/github'
import * as exec from '@actions/exec'

declare const githubToken: string;
declare function postComment(comment: string): Promise<void>;

async function run(): Promise<void> {
  try {
    // Get pull-req URL like "https://api.github.com/repos/nwtgck/actions-merge-preview/pulls/4"
    const pullReqUrl = (context.payload as any).issue.pull_request.url;
    const githubUser = (context.payload as any).repository.owner.login;
    console.log({ githubUser });
    const res = await fetch(pullReqUrl, {
      headers: [
        ['Authorization', `Basic ${Buffer.from(`${githubUser}:${githubToken}`).toString('base64')}`]
      ]
    });
    const resJson = await res.json();
    const prUserName = resJson.head.user.login;
    const baseBranchName = resJson.base.ref;
    const branchName = resJson.head.ref;
    const fullRepoName = resJson.head.repo.full_name;
    const previewBranchName = `actions-merge-preview/${prUserName}-${branchName}`;
    await exec.exec(`git config --global user.email "bee-bot-bot@protonmail.com"`);
    await exec.exec(`git config --global user.name "Bee Bot"`);
    // (from: https://stackoverflow.com/a/23987039/2885946)
    await exec.exec(`git fetch --all`);
    await exec.exec(`git checkout ${baseBranchName}`);
    await exec.exec(`git checkout -b ${previewBranchName} ${baseBranchName}`).toString();
    await exec.exec(`git pull https://github.com/${fullRepoName}.git ${branchName}`);
    // Push preview branch
    // NOTE: Force push (should be safe because preview branch always start with "actions-merge-preview/")
    await exec.exec(`git push -fu origin ${previewBranchName}`);
    const baseRepoFullName = (context.payload as any).repository.full_name;
    // Comment body
    const commentBody = `🚀 Preview branch:  \n<https://github.com/${baseRepoFullName}/tree/${previewBranchName}>`;
    // Comment the deploy URL
    await postComment(commentBody);
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
