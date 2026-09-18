# Open Lobotomy Renovate policy

This repository publishes the organization’s shared Renovate presets. Public repositories use the
guarded automerge policy:

```json
{
  "extends": ["github>open-lobotomy/renovate-config"]
}
```

Private repositories use the single rolling, manually merged policy:

```json
{
  "extends": ["github>open-lobotomy/renovate-config:manual"]
}
```

Every preset is validated strictly in CI. Policy changes are maintained by the repository
administrators. The manual preset groups ordinary dependency work and security fixes under one
stable group name and always requires a human merge. Renovate security-alert PRs are a documented
platform exception: Renovate gives them priority over its ordinary concurrency limit, so the
one-PR cap applies to normal dependency updates while security fixes remain grouped and manual.
