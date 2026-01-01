# System UML Diagrams

This document complements `ARCHITECTURE.md` by providing detailed UML sequence and activity diagrams to visualize the specific processes within the Shaomeme Fighter system, particularly the initialization flow and the Victory Slideshow data flow.

## 1. Game Initialization Sequence

This sequence diagrams how the single-container server delivers the game to the client (iPad) and how the game bootstraps itself.

```mermaid
sequenceDiagram
    participant User as iPad (Browser)
    participant Node as Node.js Container
    participant FS as File System (Dist)

    Note over User, Node: 1. Initial Load (Static Serving)
    User->>Node: GET / (Request Game)
    Node->>FS: Read /dist/index.html
    FS-->>Node: Return HTML Content
    Node-->>User: 200 OK (index.html)

    User->>Node: GET /assets/index.js (Game Bundle)
    Node->>FS: Read /dist/assets/index.js
    FS-->>Node: Return JS Content
    Node-->>User: 200 OK (JS Bundle)

    Note over User: Browser Executes JS<br/>(Phaser Engine Starts)

    User->>User: Check Device (iPad?)

    alt is Supported Device
        User->>User: Boot Phaser Game
        User->>User: Load PreloadScene
    else is Unsupported
        User->>User: Show Block Screen
    end
```

## 2. Victory Slideshow Data Flow (Optimized)

This diagram illustrates the interaction between the client and server during the Victory Slideshow, highlighting the current optimized processing flow designed for high performance and low memory footprint.

```mermaid
sequenceDiagram
    participant Game as Client (Game Logic)
    participant API as Server API (/api/photos)
    participant Sharp as Image Processor
    participant Disk as HDD (Photos/Cache)

    Note over Game: Player Wins Match
    Game->>API: GET /api/photos?city=dublin

    activate API
    API->>Disk: List files in /photos/dublin
    Disk-->>API: [img1.jpg, img2.heic, ...]

    loop For Each Image (Sequential)
        API->>Disk: Check if /cache/dublin/img1.webp exists?

        alt Cache Miss
            API->>Sharp: Process(path/to/img1.jpg)
            Note right of Sharp: Stream from Disk (Low RAM)
            Sharp->>Disk: Read Source Stream
            Sharp->>Disk: Write Optimized WebP
        else Cache Hit
            Note right of API: Skip Processing
        end

        API->>Sharp: Get Metadata (Date)
    end

    API-->>Game: Return JSON [ {url: "/cache/...", date: "..."} ]
    deactivate API

    Note over Game: Slideshow Starts<br/>(Client Downloads WebP)
```

## 3. Server Activity Diagram (Request Handling)

This activity diagram shows how the Node.js server decides whether to act as an API or a File Server for any given request.

```mermaid
stateDiagram-v2
    [*] --> RequestReceived
    RequestReceived --> CheckRoute: Analyze URL Path

    state CheckRoute <<choice>>

    CheckRoute --> API_Logic: Starts with /api/*
    CheckRoute --> Static_Asset: Starts with /assets/* OR /photos/*
    CheckRoute --> SPA_Fallback: Everything else (e.g., /)

    state API_Logic {
        [*] --> Router
        Router --> PhotosEndpoint: /photos
        Router --> CitiesEndpoint: /cities
        Router --> SoundtracksEndpoint: /soundtracks
        PhotosEndpoint --> [*]
    }

    state Static_Asset {
        [*] --> CheckDisk
        CheckDisk --> StreamFile: File Exists
        CheckDisk --> 404: File Missing
        StreamFile --> [*]
    }

    state SPA_Fallback {
        [*] --> ServeIndex
        ServeIndex --> [*]: Send /dist/index.html
    }
```
