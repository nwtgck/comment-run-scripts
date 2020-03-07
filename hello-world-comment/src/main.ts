import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'

declare const githubToken: string;

async function run(): Promise<void> {
  try {
    // Create GitHub client
    const githubClient = new GitHub(githubToken);
    // Comment "hello, world"
    await githubClient.issues.createComment({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: 'hello, world'
    });
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
