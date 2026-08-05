# Hands-On 1 - Set Up Your Own Protected Repo from the Template

Goal: create your own copy of `demo-repo` from the template, add a `CODEOWNERS` file, and lock down `main` with a ruleset that requires PRs, reviews and passing status checks - then enable auto-merge and automatic branch deletion.

## Prerequisites

- Access to the `demo-repo` template repository (link shared by the trainer)
- Admin rights on your own copy

## Steps

### 1. Create your own copy of the template

1. Open the `demo-repo` template repository.
2. Click **Use this template** &rarr; **Create a new repository**.
3. Choose your own account/namespace, give it any name (e.g. `my-demo-repo`), and create it.
   - CLI alternative: `gh repo create my-demo-repo --template spindev/demo-repo --private --clone`
4. Clone it locally (or open a Codespace) so you have a working copy.

### 2. Add a CODEOWNERS file

1. Create `.github/CODEOWNERS`:
   ```
   # default owner for everything
   *                       @your-username

   # service-specific owners
   /backend/               @your-username
   /frontend/              @spindev-copilot

   # CI/CD and repo configuration
   /.github/               @spindev
   ```
2. Replace `@your-username` with your own GitHub handle (or a team you belong to) so review requests reach someone in this exercise.
3. Commit the file directly to `main` (no ruleset exists yet, so this is the last change you can push straight to `main` without a PR).

### 3. Create a ruleset on `main`

1. Go to **Settings &rarr; Rules &rarr; Rulesets &rarr; New ruleset &rarr; New branch ruleset**.
2. Target the `main` branch.
3. Enable:
   - **Require a pull request before merging** &ndash; required approvals `1`, and **Require review from Code Owners**
   - **Require status checks to pass** &ndash; add the `backend`, `frontend` jobs from `ci.yml`, plus `Analyze (javascript-typescript)` (CodeQL)
   - **Require branches to be up to date before merging**
4. Set enforcement status to **Active** and save.

### 4. Enable auto-merge and auto-delete branches

1. **Settings &rarr; General**: enable **Allow auto-merge** and **Automatically delete head branches**.
2. Optional/stretch: back in the ruleset, enable **Require merge queue**.

### 5. Test end to end

1. Open a small PR (e.g. a README tweak).
2. Confirm the PR requests review from the code owner and shows the required checks as pending.
3. Approve the PR as the code owner (or have a partner do it).
4. Optional: request a review from **Copilot** on the same PR and read through its feedback.
5. Click **Enable auto-merge**. Watch the PR wait for checks, then merge and delete its branch automatically once everything is green.

### 6. Break it on purpose

1. Open a second PR that intentionally fails a check (e.g. break a test or add a step that runs `exit 1`).
2. Confirm the merge button is disabled while the check is red or pending.
3. Fix the failure, push again, and confirm the check turns green and merging becomes possible.

## Checkpoint

- [ ] Own copy of `demo-repo` created from the template
- [ ] `CODEOWNERS` added and matches at least one path you changed
- [ ] Ruleset on `main` requires a PR, an approval, code owner review and passing status checks
- [ ] Auto-merge and automatic branch deletion are both enabled
- [ ] A PR merged itself automatically once review and checks passed
- [ ] A failing check was observed blocking the merge button
