## Architecture Overview

**qapp-core** is a React component library for building Qortal decentralized applications (q-apps). It provides hooks, components, and utilities for interacting with the Qortal Data Network (QDN).

### Global State Pattern

The library uses Zustand stores in `src/state/` for internal state management:
- `publishes.ts` - Resource download status tracking, peer info, caching
- `cache.ts` - Search results and resource data caching with TTL expiry
- `lists.ts` - List pagination state
- `auth.ts` - Authentication state

The `GlobalProvider` in `src/context/GlobalProvider.tsx` is the main entry point. Apps wrap their root with it, passing `appName` and `publicSalt` config. It wires up:
- Authentication (`useAuth`)
- Resource management (`useResources`)  
- Persistent storage (`usePersistentStore`)
- Index management (`useIndexes`)

### QDN Resource Flow

Resources on QDN are identified by `{service, name, identifier}`. The typical flow:
1. `useResources` or `ResourceListDisplay` components search/list metadata
2. `useResourceStatus` tracks download progress from peers
3. Resources are fetched via `qortalRequest()` - a global injected by the Qortal browser

### Global Type Augmentation

`src/global.ts` declares the global `qortalRequest()` function and `QortalRequestOptions` union type. This provides TypeScript support for the ~100+ Qortal API actions. The types are in `src/types/qortalRequests/interfaces.ts`.

### Build Output

tsup bundles to ESM/CJS with externalized React/MUI peer deps. Type declarations are generated separately via `tsc`. The `global.d.ts` export provides ambient types for consumers.

### i18n

Locale JSON files in `src/i18n/locales/{lang}/` are compiled into a single `compiled-i18n.json` at build time. Add translations there, then run `npm run generate-i18n`.

## Key Exports

- `GlobalProvider`, `useGlobal` - Context setup and access
- `usePublish`, `useResources`, `useResourceStatus` - QDN resource operations  
- `ResourceListDisplay`, `ResourceListPreloadedDisplay` - List rendering components
- `VideoPlayer`, `AudioPlayerControls` - Media components with QDN integration
- `addAndEncryptSymmetricKeys`, `decryptWithSymmetricKeys` - Encryption utilities
- `EnumCollisionStrength`, `hashWordWithoutPublicSalt` - Identifier hashing for privacy
