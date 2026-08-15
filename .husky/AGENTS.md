# Git Hook Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The repository maintainers own the Git hook configuration here. `.husky/commit-msg` invokes the
commit-message policy configured by `commitlint.config.js`; root `package.json` installs Husky
through its `prepare` script.

Relevant documentation: [`../docs/README.md`](../docs/README.md). Verify hook changes with the
actual hook command and a representative accepted and rejected message.
