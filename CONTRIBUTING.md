# Contributing

Thank you for your interest in contributing to the venom-scaffolding generator!

# Issues

## Create a new issue

If you spot a problem with generator, [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments). If a related issue doesn't exist, you can open a new issue using a relevant [issue form](https://github.com/venom-blockchain/generator-venom-scaffold/issues/new/choose).

## Solve an issue

Scan through our [existing issues](https://github.com/venom-blockchain/generator-venom-scaffold/issues) to find one that interests you. If you find an issue to work on, you are welcome to open a PR with a fix.

# Development

Before running anything, you'll need to install the dependencies:

```bash
# project dependencies
npm install

# and yo scaffolding tool
npm install --global yo
```

## Running the venom-scaffold locally

```bash
# build the project
npm run build

# create symlink to project binary
npm link
```

The venom-scaffold now is ready to be ran locally. To do so, run the cmd bellow in any directory.

```bash
yo venom-scaffold <new-project-path>
```

## Create branch for your feature and checkout to this branch

```bash
git checkout -b feature/my-amazing-subgenerator
```

## Add new sub generator

To create new sub generator, you should add it to the ./generators directory. Generator consist of `index.ts`, where you specify questions, how to process templates, etc and `templates` directory, where you store project's template.
For templating, use [esj](https://ejs.co/). Be sure, that you added `README.md` file with description about project details and information about project run and test. The last step is to update `generators/app/index.ts` and `generators/app/USAGE` with new sub-generator

## Pull Request

After you finished sub generator developing, create pull request.

- Describe the purpose of your changes
- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
  Once you submit your PR, a Docs team member will review your proposal. We may ask questions or request additional information.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

## Your pull request is merged!

Congratulations, and thank you on behalf of the venom team!
