# bunderlog

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/615576bc2e9a4c3693f167397d427763)](https://app.codacy.com/gh/bunderlog/bunderlog/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/615576bc2e9a4c3693f167397d427763)](https://app.codacy.com/gh/bunderlog/bunderlog/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

## Devcontainer

We are using JetBrains Mono font - https://www.jetbrains.com/lp/mono/. Download and install it on the host computer.

You have to create .zsh_history in your home folder if you don't use zsh on the host computer.

## GitHub

The main branch is protected with following rules:

- Restrict deletions
- Require linear history
- Require signed commits
- Allowed rebase merge method only
- Require a pull request before merging
- Require branches to be up to date before merging
- Require status checks to pass Codacy Static Code Analysis, Codacy Coverage Variation and Codacy Diff Coverage
- Require code scanning results by CodeQL
- Block force pushes
