# Issue tracker: GitHub

Issues and specs for this repository live as GitHub issues in `ayush-that/codejeet`. Use the `gh` CLI for operations.

## Conventions

- Create issues with `gh issue create`.
- Read complete issue bodies, comments, and labels before acting on them.
- Apply and remove labels with `gh issue edit`.
- Close issues with `gh issue close`.
- Infer the repository from its Git remote when running inside this checkout.
- Pull requests are not a triage request surface.

## Skill behavior

When a skill says to publish to the issue tracker, create a GitHub issue.

When a skill says to fetch a ticket, read the complete GitHub issue and its comments.

Use native GitHub sub-issue and blocking relationships where available. Otherwise, record blocking issue references in the issue body.
