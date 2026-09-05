# Domain Docs

This repository uses a single domain context.

## Before exploring

- Read `CONTEXT.md` at the repository root.
- Read relevant decisions under `docs/adr/`.
- If either location does not exist, proceed without treating its absence as an error.

## Vocabulary

Use the domain terms defined in `CONTEXT.md`. Avoid synonyms that its glossary explicitly rejects.

If a required concept is missing, reconsider whether new terminology is necessary or update the glossary through the domain-modeling workflow.

For production rollout and evidence, follow [`docs/deployment.md`](../deployment.md). It covers additive D1 migrations, authentication prerequisites, the compatibility rollback window, asset safeguards, and the verification matrix.

## Architecture decisions

Surface conflicts with existing ADRs explicitly. Do not silently override them.
