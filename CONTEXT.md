# Q-Tube Project Context

## Overview

Q-Tube is a decentralized video platform built on the Qortal blockchain. It allows users to upload, share, and view videos in a censorship-resistant environment.

## Key Concepts

### Qortal Integration
- Built on Qortal blockchain with qapp-core integration
- Uses QDN (Qortal Data Network) for content storage and retrieval
- Leverages Qortal's decentralized infrastructure for video hosting

### Resource Identifiers
- Video resources: `qtube_vid_` (or `MYTEST_vid_` in test mode)
- Playlist resources: `qtube_playlist_` (or `MYTEST_playlist_` in test mode)
- Super likes: `qtube_superlike_` (or `MYTEST_superlike_` in test mode)

### Architecture
- Frontend: React with TypeScript
- State Management: Jotai with IndexedDB persistence
- UI Framework: Material-UI (MUI) with custom theming
- Build Tool: Vite

### User Experience
- Video upload and transcoding
- Playlist creation and management
- Social features (likes, super likes, comments, subscriptions)
- Multi-language support (ar, de, en, es, fr, it, ja, ru, zh)

## Development Environment

- Development server runs on port 5174 with host 0.0.0.0
- Uses ESLint with TypeScript support
- No test framework currently configured

## Project Structure

- Components organized by feature in `src/components/`
- Common reusable components in `src/components/common/`
- Page components in `src/pages/`
- Each major component has its own styles file (e.g., `Component-styles.tsx`)
- State files co-located with components (e.g., `VideoContent-State.ts`)
- qapp-core has type data for qortalRequests and other Qortal features as described in the QORTAL.md file