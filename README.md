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
administrators. The public preset permits security-alert automerge after its explicit three-day
cooldown when CI passes; the manual preset overrides that setting and always requires a human
merge. The manual preset groups security fixes under a stable group name. Renovate security-alert
PRs are a documented platform exception: Renovate gives them priority over its ordinary
concurrency limit, so the manual preset's one-PR cap applies to normal dependency updates while
security fixes remain grouped and manual. Replacement updates remain manual but separate because
Renovate does not group replacement updates.
