# Hands-On 2 - Build Container Images in Parallel

Goal: use a build matrix on the `docker` job so the backend and frontend images build as separate, parallel jobs instead of two sequential steps in one job.

## Steps

### 1. Look at the current `docker` job

Open `.github/workflows/ci.yml`. The `docker` job currently builds the backend image, then the frontend image, as two steps in a row - the second build only starts once the first finishes, even though the two images don't depend on each other.

### 2. Add a `service` matrix

Replace the two sequential steps with a single parametrized step, driven by a matrix over `service: [backend, frontend]`. Use `matrix.service` for the job `name`, the build `context` (`./${{ matrix.service }}`) and the image `tags`.

<details>
  <summary>Solution</summary>

```yaml
docker:
  name: Build container image (${{ matrix.service }})
  needs: [backend, frontend]
  runs-on: ubuntu-latest
  strategy:
    fail-fast: false
    matrix:
      service: [backend, frontend]
  steps:
    - uses: actions/checkout@v4
    - uses: docker/setup-buildx-action@v3
    - name: Build ${{ matrix.service }} image
      uses: docker/build-push-action@v6
      with:
        context: ./${{ matrix.service }}
        push: false
        tags: demo-repo/${{ matrix.service }}:ci
```

</details>

### 3. Push and observe

1. Commit and push, then open the **Actions** tab.
2. Confirm `docker` now fans out into two independent, parallel job runs - `Build container image (backend)` and `Build container image (frontend)` - instead of one job that builds both images one after another.
3. Since lab 01 removed `docker` from the ruleset's required status checks, this change doesn't affect what's required to merge - but note that the check names have changed again, in case you decide to require them later.

### 4. Add a job summary

Add a step after each build that writes the image tag to the run's job summary, so it's visible without digging through logs.

<details>
  <summary>Solution</summary>

```yaml
    - name: Write summary
      run: |
        echo "### Built \`demo-repo/${{ matrix.service }}:ci\`" >> "$GITHUB_STEP_SUMMARY"
        echo "Context: \`./${{ matrix.service }}\`" >> "$GITHUB_STEP_SUMMARY"
```

</details>

Push again and confirm each of the two parallel job runs shows its own summary on the run's **Summary** page.

## Checkpoint

- [ ] `docker` job uses a `service` matrix (`backend`, `frontend`)
- [ ] Backend and frontend images now build as two parallel job runs instead of sequential steps
- [ ] Confirmed the change doesn't affect required status checks (already removed in lab 01)
- [ ] Each job run writes its image tag to the job summary

