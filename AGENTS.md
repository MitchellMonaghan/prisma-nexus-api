# DOX Framework

DOX is the binding `AGENTS.md` instruction hierarchy for this repository. Read the complete
applicable hierarchy before editing and update it after meaningful structural or contractual
changes.

## Contents

- [Core contract](#core-contract)
- [Read before editing](#read-before-editing)
- [Update after editing](#update-after-editing)
- [Instruction navigation contract](#instruction-navigation-contract)
- [Engineering delivery and scope](#engineering-delivery-and-scope)
- [Task completion contract](#task-completion-contract)
- [Engineering quality contract](#engineering-quality-contract)
- [Documentation quality contract](#documentation-quality-contract)
- [Verification contract](#verification-contract)

## Core Contract

- Parent instructions apply to every child subtree; the nearest child adds local detail and cannot
  weaken this contract.
- Keep durable structure, ownership, workflows, constraints, and verification understandable from
  the applicable instruction chain.
- Record stable contracts, not task progress or history.

## Read Before Editing

1. Read this root file.
2. Identify every path the task may touch.
3. Walk from the root to each path and read every `AGENTS.md` on that route.
4. Follow the nearest local contract together with all parent contracts.

## Update After Editing

- Update the closest owning `AGENTS.md` when purpose, ownership, structure, workflow, inputs,
  outputs, constraints, side effects, artifacts, or verification changes.
- Update parent and child indexes when boundaries change.
- Delete stale or contradictory guidance.

## Instruction Navigation Contract

- Every maintained project-owned folder contains an `AGENTS.md`. Generated, vendored, dependency,
  cache, build-output, virtual-environment, artifact, and Git-internal folders are excluded and
  remain governed by the nearest maintained ancestor.
- Each `AGENTS.md` states the folder's purpose and owner, summarizes the responsibilities of its
  direct files and child folders, links to its parent instructions, and links to relevant canonical
  product or architecture documentation.
- Child instructions add only local detail. Link to parent and canonical documentation instead of
  copying their contracts, and keep the child index current when files, folders, or ownership
  boundaries change.
- A structural change is incomplete until the applicable instruction hierarchy makes the new
  location, responsibility, and documentation path discoverable to an agent entering at that
  folder.

## Engineering Delivery and Scope

- Deliver the smallest complete, safe, maintainable solution to the actual task. Optimize for
  working core behavior and material risk reduction, not theoretical completeness or speculative
  robustness.
- Implement in this order: prove the smallest end-to-end path for the core behavior; fix defects
  that block that path; add the security, safety, correctness, and recovery required for delivery;
  then improve maintainability where the implementation needs it.
- For nontrivial or discovery-prone work, keep a lightweight scope ledger: task requirement, newly
  discovered blocker, deferred observation, or out of scope. A discovered defect enters the
  current change only when it blocks a task criterion, creates material risk, or is explicitly
  added to scope.
- Evaluate findings using credible likelihood, user and business impact, security and privacy
  impact, data-loss or corruption risk, privilege or trust-boundary impact, reversibility,
  detectability, affected supported workflows, and remedy cost. Theoretical impact without a
  credible trigger is not by itself a blocker.
- Classify every review finding:
  - **Blocker** — task-contract failure; credible security, privacy, data-loss, privilege-boundary,
    irreversible-external-effect risk; or material failure of an ordinary supported workflow. Fix
    and verify before delivery.
  - **Important** — a reasonably likely defect with meaningful impact in a supported workflow.
    Normally fix it unless the task owner explicitly accepts deferral.
  - **Deferred** — real but low-likelihood, low-impact, readily recoverable, or disproportionately
    expensive relative to its risk. Document its trigger, impact, and workaround.
  - **Speculative/Nit** — hypothetical robustness or polish without evidence of material risk.
    Record only when useful and do not implement unless requested.
- Continue adversarial review after material rework because fixes can reveal or introduce defects.
  Stop rework when the task contract is proven, required verification passes, and no Blocker or
  unresolved Important finding remains.
- Improve nearby code only when necessary for safe implementation or when the improvement is small,
  obvious, behavior-preserving, and does not obscure the task. Keep broad cleanup and redesign in
  separate changes.
- Before building a material custom component, abstraction, algorithm, or testing facility, check
  the language standard library, chosen framework, installed dependencies, and mature maintained
  packages. Compare functional fit, integration complexity, security and supply-chain risk,
  licensing, maintenance, and exit cost.

## Task Completion Contract

- This contract binds every repository-editing agent. An agent cannot redirect responsibility for
  its implementation or verification omissions to a future worker or reviewer.
- The exact current task source is authoritative. Before implementation, identify every
  requirement, acceptance criterion, constraint, non-goal, required artifact, and process or
  verification obligation. Surface ambiguous, contradictory, obsolete, or presently unverifiable
  items instead of silently dropping them.
- Before declaring a task complete, approving it, merging it, or reporting its criteria satisfied,
  re-read the exact task and audit every identified item against concrete implementation and
  verification evidence.
- Record the final audit as a criterion-to-evidence matrix. Each requirement, acceptance criterion,
  artifact, dependency, and verification obligation maps to exact implementation and independently
  observed evidence.
- A clean merge, passing tests, successful build, prior agent statement, issue status, or partial
  evidence never substitutes for requirement-by-requirement proof.
- Do not rewrite, weaken, reinterpret, or mark task criteria complete merely to match the
  implementation. Scope changes require explicit authority from the task owner.
- A parent task with required children or dependencies remains incomplete until each dependency and
  the parent's assembled acceptance criteria pass.
- Worker self-report never establishes completion. Independent review verifies the complete task
  contract against the exact candidate; missing task context fails closed instead of becoming
  implicit approval.
- Closeout fails closed when any matrix entry is unmet, ambiguous, or unverified. State the missing
  proof and leave the task nonterminal until the matrix passes.

## Engineering Quality Contract

- Prefer the simplest design that fully satisfies the current contract. Add indirection,
  configuration, generalization, or abstraction only when a current requirement or repeated stable
  pattern justifies it.
- Keep each module, class, and function cohesive. One unit has one explainable responsibility, one
  primary reason to change, and dependencies that point toward its owning boundary.
- Treat duplication as an ownership warning. Put repeated domain rules, validation, state
  transitions, and nontrivial algorithms behind one named owner. Do not merge code that is only
  superficially similar or generalize before the stable contract is understood.
- Keep solutions simple (KISS) and avoid repeated policy and algorithms (DRY).
- For handwritten logic, 500 lines is a decomposition-review signal and 800 lines should prompt
  extraction when a cohesive seam exists. A manually maintained source file reaching 1,000 lines
  requires an explicit cohesion review. A manually maintained source file at or above 1,200 lines
  blocks handoff and must be split before more functionality is delivered.
- Generated code, vendored code, lockfiles, migrations, snapshots, templates, schemas, fixtures,
  declarative data, and other low-logic content are excluded from line thresholds when extraction
  would make behavior harder to understand.
- Line count is a warning, not a target. Do not game thresholds with mechanical fragments,
  one-line compression, or thin forwarding files. Split by responsibility, lifecycle, state
  ownership, dependency direction, or independently testable behavior.
- Refactor before extension when the touched design makes requested behavior unsafe, duplicative,
  or difficult to test. Keep behavior-preserving restructuring separate from intentional behavior
  changes where practical and prove preserved behavior at the highest-risk affected boundary.
- Improve the touched area when a small, evidence-backed cleanup materially reduces complexity.
  Do not turn a focused task into an unrelated rewrite, but do not defer cleanup required for the
  current change to remain maintainable.
- Remove dead branches, obsolete compatibility paths, commented-out implementations, temporary
  scaffolding, and unused abstractions when removal is proven safe. Compatibility layers must name
  a real consumer or migration contract.
- During pre-handoff adversarial review, challenge maintainability as well as correctness: look for
  avoidable state, hidden coupling, leaky boundaries, repeated policy, excessive nesting,
  misleading names, and mixed responsibilities.
- Split tests by behavior and boundary and templates by reusable responsibility, not arbitrary
  line or test counts. Keep decisive setup and assertions visible.

## Documentation Quality Contract

- Documentation is part of the product contract. A change to behavior, ownership, architecture,
  configuration, operator workflow, inputs, outputs, constraints, side effects, or recovery
  behavior updates the closest owning documentation in the same candidate.
- Keep the root README short and high-level: identify the project, problem, intended outcome, and
  minimum useful starting context, then link to the primary documentation index. Detailed
  architecture, feature, setup, and operating guidance belongs under `docs/`.
- Give every durable fact one canonical owner and link to it elsewhere. Summarize only context the
  reader needs; do not maintain parallel copies of contracts that can drift.
- Write for readers with no repository history. Lead with purpose and observable behavior, use
  direct plain language, define unavoidable technical terms, and make ownership, prerequisites,
  decisions, failures, and next actions explicit.
- Explain the system rather than reproducing code. Describe responsibilities, boundaries, data and
  control flow, important invariants, and why constraints exist.
- Organize system documentation into focused component documents and end-to-end feature or workflow
  documents that show how components collaborate.
- Every documentation file links to its parent index near the top, and each parent index links to
  every direct child. A document with more than one substantive section includes a linked table of
  contents that exposes its conceptual structure.
- Use focused Mermaid diagrams when they materially clarify multi-component relationships, state,
  data flow, trust boundaries, or recovery. Accompany diagrams with prose and never substitute a
  diagram for the contract.
- Separate current implemented behavior from proposals, pending decisions, and future plans. Never
  describe planned behavior as present behavior.
- Review documentation against the exact final implementation and governing task. Catch stale
  names, broken navigation, contradictory ownership, missing workflow effects, and unproven claims.

## Verification Contract

- Tests prove behavior only when they directly exercise and assert the behavior or risk claimed.
  Test counts, mocks, builds, type checks, and isolated happy paths are supporting evidence, not
  proof that the assembled application works.
- Coverage is a diagnostic and ratchet, not a substitute for behavioral evidence. Projects should
  target at least 90% statement and 90% branch coverage, with new or materially changed logic
  normally at least 95% statement and 90% branch coverage when meaningful. A target becomes a gate
  only when the owning subtree defines a repeatable command and baseline.
- Before handoff, run the affected subtree's declared native impacted-test selection and required
  static and build gates. Use the framework's maintained related or changed-test capability when
  available rather than inventing a dependency algorithm. A selector is a floor; add composed or
  adversarial cases for acceptance boundaries it cannot represent.
- Documentation-only changes do not require application tests unless the documentation is
  executable runtime input. Verify ordinary documentation through links, anchors, traceability,
  formatting, and its local documentation contract.
- Before a behavioral change, build a proportionate impact inventory: the changed contract,
  relevant callers and consumers, persistence or external-side-effect boundaries, recovery paths,
  and tests that exercise them. Shared contracts, security, concurrency, persistence, and external
  effects require the complete inventory.
- For a bug, first add or identify a regression that fails for the reported reason. The fix is not
  complete until that regression passes. When a real provider, process, race, or restart cannot be
  reproduced deterministically, preserve the closest deterministic regression and also run the
  real composed reproduction before claiming readiness.
- After the intended path passes, perform a proportionate adversarial review of credible failure,
  retry, stale-input, idempotency, concurrency, cancellation, restart, and limit boundaries.
  Classify every finding under the delivery and scope contract and preserve each fixed Blocker or
  Important counterexample as a regression.
- Focused verification follows each changed behavior through its highest-risk credible boundary. A
  happy path or full suite cannot substitute for the relevant composed, race, restart, external
  contract, or acceptance scenario.
- Changes to shared orchestration, external writes and readbacks, claims, snapshots, lifecycle
  state, recovery, or delivery require composed tests plus fault-oriented coverage for partial
  writes, stale observations, cancellation, and restart where applicable.
- Before reporting success, re-read the impact inventory, perform the adversarial review, search
  again for callers and tests of each changed contract, and report exact commands, outcomes,
  unexercised relevant paths, and unresolved finding dispositions.
- Production-readiness claims require repeatable acceptance through every real boundary claimed.
  Fakes prove only their controlled contract; do not claim readiness from a weaker substitute.

## Repository-Specific Contents

- [Repository purpose and ownership](#repository-purpose-and-ownership)
- [Workspace commands](#workspace-commands)
- [Repository constraints](#repository-constraints)
- [Canonical documentation](#canonical-documentation)

## Repository Purpose and Ownership

This pnpm workspace contains the published `prisma-nexus-api` generator/runtime package and a
private Apollo, Nexus, Prisma, and PostgreSQL usage application. The root owns workspace-wide
package management, commit hooks, CI configuration, and documentation navigation. Package-specific
instructions begin at [packages/AGENTS.md](packages/AGENTS.md).

Repository tooling under `.github/`, `.husky/`, and `.vscode/` remains owned here. Generated build
output, dependencies, caches, and migration-history directories inherit the nearest maintained
ancestor's instructions and do not receive local instruction files.

## Workspace Commands

Run commands from the repository root unless a command changes directory explicitly.

```sh
pnpm install
cd packages/generator
pnpm build
pnpm lint
pnpm test
```

The root `prepare` lifecycle installs Husky hooks. The generator package owns the repository's
build, lint, and Jest commands. The usage package has separate stateful workflows documented in
[Development and operations](docs/development.md).

## Repository Constraints

- Preserve the pnpm workspace relationship between `packages/generator` and `packages/usage`.
- Treat the generator's exported types, generated GraphQL schema behavior, operation names,
  override hooks, scalar handling, and notification events as compatibility-sensitive contracts.
- Do not hand-edit dependency directories, build output, caches, or Prisma migration history.
- Database generation and migration commands can write generated files or database state; review
  their effects before running them.
- Update the focused architecture or development guide when package boundaries, generated outputs,
  stateful workflows, or verification commands change.

## Canonical Documentation

- [Project README](README.md) — consumer-facing package configuration and examples.
- [Documentation index](docs/README.md) — maintainer documentation navigation.
- [Architecture](docs/architecture.md) — package boundaries, generation, runtime flow, and public
  compatibility contracts.
- [Development and operations](docs/development.md) — setup, commands, side effects, recovery, and
  verification.
