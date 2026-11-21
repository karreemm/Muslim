<!--
  Keep pull requests focused. One problem per PR.
  Security fixes: do not describe the exploit publicly; note "security" and
  contact the maintainer.
-->

## Summary

<!-- What changes, and why? Link the issue if there is one. -->

Closes #

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Performance
- [ ] Refactor (no behavior change)
- [ ] Documentation
- [ ] Dependency update
- [ ] Security hardening

## Screenshots

<!-- Required for UI changes. English + Arabic, and light + dark when color is affected. -->

| Before | After |
| --- | --- |
|  |  |

## How to test

<!-- Exact steps a reviewer can follow. -->

1.
2.

## Checklist

### Code

- [ ] No new raw colors; semantic tokens only.
- [ ] No new user-facing strings outside `locales/` — both `en` and `ar` updated.
- [ ] No direct `localStorage`; storage helper used.
- [ ] Shared `components/ui/` primitives reused where applicable.
- [ ] Loading, empty, error, and success states handled for new data views.
- [ ] No secrets, real user data, or personal information added.

### Quality

- [ ] `npm run check` passes.
- [ ] `npm run test:e2e` passes when a route or flow changed.
- [ ] New behavior has tests.
- [ ] Prettier applied (`npm run format`).
- [ ] Accessibility checked: labels, focus, contrast, keyboard.

### Documentation

- [ ] Living docs updated if architecture, UI rules, tests, or operations changed.
- [ ] Change record added under `docs/changes/` for behavior, structure,
      dependency, data, or UI changes.
