# Product Tech Stack

## Frontend
- **Framework**: Phaser 3 (Game Engine)
- **Language**: JavaScript (ES Modules)
- **Styling**: Vanilla CSS (for game container/UI overlays)
- **Bundler**: Vite (inferred from existing files)

## Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Responsibilities**: 
  - Serving game static files
  - Serving Photo API (`/api/photos`)
  - Serving photo assets from file system

## Data & Storage
- **Primary Data Source**: Local File System (synced via external Nextcloud client)
- **Data Structure**: Directory-based (Folders = Cities/Arenas)
- **Configuration**: Simple JSON files for Fighter stats/mappings if needed.

## Infrastructure & Deployment
- **Target OS**: Ubuntu Linux (Home Lab)
- **Process Management**: Docker or PM2
- **Hardware**: Laptop Server
- **Client Device**: iPad / iPhone (Safari) - Requires Touch Events support
