# BZaudio shared contracts

This package is the home for versioned data contracts used by SystemOS, System Builder, Compatibility Center and Show Workspace.

## Contract rules

- Every persisted format has an explicit format identifier and schema version.
- Changes that alter meaning require a migration path.
- Vendor-specific fields stay namespaced and are preserved where possible.
- Unknown fields must not be silently discarded during import/export.
- Compatibility claims must include evidence and a verification state.
- A schema passing validation does not prove that a physical device supports a feature.

The first shared contract is the neutral show package implemented in the existing root `systemos-core.js`. Its JSON Schema will be formalized alongside migration and compatibility tests before external integrations depend on it.
