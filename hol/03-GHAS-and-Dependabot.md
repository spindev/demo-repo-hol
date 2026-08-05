# Hands-On 3 (Optional) - Enable GHAS and Group Dependabot Updates

Goal: enable Dependabot alerts, secret scanning (with push protection), add a `dependabot.yml` that groups updates per ecosystem, then verify push protection blocks a leaked secret.

## Steps

### 1. Enable the GHAS features

1. Go to **Settings &rarr; Advanced security**.
2. Enable:
   - **Dependency graph**
   - **Dependabot alerts** and **Dependabot security updates**
   - **Grouped security updates** - bundles multiple Dependabot security-update PRs into one, separate from the version-update groups you'll configure in `dependabot.yml` next
   - **Secret scanning**, then also enable **Push protection**

### 2. Configure grouped Dependabot version updates

Rather than one PR per outdated dependency, group updates per ecosystem into a single PR. This repo's dependencies currently only have major version bumps available, so grouping by `update-types: [minor, patch]` wouldn't group anything in practice - group everything for each ecosystem instead, regardless of version bump type.

1. Create `.github/dependabot.yml`:
   ```yaml
   version: 2
   updates:
     - package-ecosystem: npm
       directory: /backend
       schedule:
         interval: weekly
       groups:
         backend-all:
           patterns:
             - "*"

     - package-ecosystem: npm
       directory: /frontend
       schedule:
         interval: weekly
       groups:
         frontend-all:
           patterns:
             - "*"

     - package-ecosystem: github-actions
       directory: /
       schedule:
         interval: weekly
       groups:
         github-actions-all:
           patterns:
             - "*"
   ```
2. Commit and push, then check **Insights &rarr; Dependency graph &rarr; Dependabot** to confirm the three update configs are picked up.
3. Discuss: grouping everything (including majors) trades granularity for fewer PRs to review - worth it here since the alternative is nearly one PR per dependency; call out that a mixed group can still break the build if a major bump lands alongside safe ones.

### 3. Test push protection

A hand-written fake token (random characters after `ghp_`) usually won't trigger push protection - GitHub's token formats include an embedded checksum that the scanner validates, so made-up values are silently ignored. Use a real, disposable token instead:

1. Generate a **classic** PAT you don't need: **Settings &rarr; Developer settings &rarr; Personal access tokens &rarr; Tokens (classic) &rarr; Generate new token**. No scopes required, shortest expiration available (e.g. 7 days).
2. On a separate branch, commit that token value into a file (e.g. `.env`):
   ```
   GH_TOKEN=<paste the token you just generated>
   ```
3. Attempt to push and confirm push protection blocks it before it reaches the repo.
4. Whether or not the push was blocked, immediately **revoke the token** from the same Personal access tokens page - don't leave a real token lying around, even a disposable one.
5. Remove the secret from your branch and push again successfully.

## Checkpoint

- [ ] Dependency graph, Dependabot alerts + security updates, and grouped security updates are enabled
- [ ] Secret scanning + push protection are enabled
- [ ] `dependabot.yml` groups all updates per ecosystem (backend, frontend, github-actions)
- [ ] A push containing a real (disposable) token was blocked by push protection, and the token was revoked afterward
