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
- Many qortal functions in qapp-core are globally available in src/global.d.ts

## Project Prompt Terminology

### Watch History
A chronological list of videos that a user has initiated download for. Stored in IndexedDB with the key `watched-v1` and limited to the most recent 200 entries. Each entry contains the video's identifier, creator name, service type, creation timestamp, and the timestamp when the download was initiated.

### Video Download
The process of fetching video data from the Qortal Data Network (QDN). Downloads are triggered in two scenarios:
1. When a user clicks on a video thumbnail to view it (automatic download for playback)
2. When a user explicitly clicks a download button to save the video file to their device

### Video Playback
The act of playing a video in the video player component. Previously, videos were added to watch history when playback began, but this has been changed to add videos when download begins instead.

### Video Reference
The metadata object that identifies a video resource on QDN, containing:
- `identifier`: The unique resource identifier
- `name`: The creator's Qortal name
- `service`: The QDN service type (typically 'DOCUMENT')
- `created`: The timestamp when the video was published

### Resource Status
The state of a QDN resource as tracked by qapp-core's `useResourceStatus` hook, including:
- `status`: Current state (e.g., 'READY', 'DOWNLOADING')
- `percentLoaded`: Download progress percentage
- `isReady`: Boolean indicating if the resource is fully downloaded and ready for use