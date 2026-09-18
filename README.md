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
administrators.
