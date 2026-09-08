# Cote : Communicate. Collaborate.

> A full-stack real-time collaboration platform built around workspaces, channels, and persistent conversations.

**Cote** is a Slack-inspired communication platform built from the ground up to explore the engineering challenges behind a real collaborative messaging system.

The application combines authenticated workspaces, role-based membership, channel discovery, persistent messages, unread tracking, cursor-based pagination, typing indicators, and real-time presence and messaging.

**Live Demo:** [cote.chitua.site](https://cote.chitua.site)

<p align="center"> <img src="./client/public/og-image.png" alt="Cote - Communicate. Collaborate" width="100%" /> </p>

---

## Overview

A messaging application looks simple from the outside.

A user writes a message, presses send, and another user sees it.

Underneath that interaction are several independent concerns:

* Authentication and sessions
* Workspace membership and authorization
* Channel membership
* Persistent message history
* Message mutations
* Real-time event delivery
* Presence tracking
* Typing indicators
* Unread state
* Client-side server-state synchronization

Cote separates these concerns while keeping the backend architecture intentionally small.

The core application flow looks like this:

```text
                         ┌────────────────────────┐
                         │       React Client     │
                         │   TypeScript + Vite    │
                         └───────────┬────────────┘
                                     │
                          HTTP / REST│
                                     ▼
                         ┌────────────────────────┐
                         │     Express API        │
                         │      Router → Service  │
                         └───────────┬────────────┘
                                     │
                                     ▼
                           ┌──────────────────┐
                           │    PostgreSQL    │
                           │   via Prisma ORM │
                           └──────────────────┘

                                     ▲
                                     │
                              Real-time events
                                     │
                         ┌───────────┴────────────┐
                         │       Socket.IO        │
                         │ Presence / Messaging   │
                         │ Typing / Channel Rooms │
                         └────────────────────────┘
```

The architectural principle is straightforward:

> **HTTP is responsible for application state and mutations. Socket.IO is responsible for synchronizing connected clients in real time.**

---

## Key Features

### 🔐 Google Authentication

Cote uses Google OAuth for authentication.

The OAuth flow retrieves the user's Google identity and either creates or retrieves the corresponding application user.

A server-side session is then created and stored using a hashed session token.

```text
Google OAuth
     │
     ▼
Authorization Code
     │
     ▼
Google ID Token
     │
     ▼
Find / Create User
     │
     ▼
Create Session
     │
     ▼
HTTP-only Session Cookie
```

Sessions are configured with an expiry and the raw session token is not stored directly in the database.

---

### 🏢 Workspaces

Users can belong to multiple workspaces.

A workspace represents the top-level collaboration boundary for the application.

Workspace functionality includes:

* Create workspace
* Fetch user's workspaces
* Fetch a workspace
* Rename workspace
* View workspace members
* Add members
* Remove members
* Update member roles
* Track unread channel counts
* Manage workspace invitations

When a workspace is created, the creator becomes the **owner** and a `general` channel is created automatically. The creator is also added to that channel.

---

### 👥 Workspace Roles

Workspace membership includes roles.

The current permission model distinguishes between:

```text
owner
admin
member
```

Owner and admin members can perform elevated workspace operations such as adding members, updating member roles, and managing invitations. Channel deletion is restricted to the workspace owner.

The authorization model is enforced in the backend service layer rather than relying only on UI visibility.

---

### ✉️ Workspace Invitations

Workspace members with sufficient permissions can invite users through email.

Invitations have explicit states and can be:

```text
invited
accepted
declined
```

The invitation flow validates that the invitation belongs to the currently authenticated user's email before allowing it to be accepted or declined.

The flow is:

```text
Workspace Admin / Owner
          │
          ▼
     Create Invitation
          │
          ▼
       invited
          │
      ┌───┴────┐
      ▼        ▼
  accepted   declined
      │
      ▼
Workspace Membership
```

---

### #️⃣ Channels

Channels are communication spaces inside a workspace.

Users can:

* Create channels
* Fetch channels
* Search channels
* Join channels
* Leave channels
* Rename channels
* Delete channels
* View channel membership status
* View unread counts

A user must be a workspace member before interacting with workspace channels.

Creating a channel automatically adds the creator as a channel member.

---

### 🔎 Channel Search

Channels can be searched within a workspace.

Search results also indicate whether the current user has already joined each channel.

Conceptually:

```text
Search Query
     │
     ▼
Workspace Channels
     │
     ▼
Name Matching
     │
     ▼
Joined Status
     │
     ▼
Search Results
```

This allows users to discover channels without losing the membership context.

---

### 💬 Persistent Messaging

Messages are persisted in the database and are associated with a channel and author.

Sending a message requires the authenticated user to belong to the workspace containing the channel.

The message flow is:

```text
User
 │
 ▼
Message Composer
 │
 ▼
POST /messages
 │
 ▼
Message Service
 │
 ▼
Database
 │
 ▼
Socket.IO Broadcast
 │
 ├──────────────► Sender
 └──────────────► Other Clients
```

The REST request persists the message first, after which the backend emits a `message:new` event to the channel room.

---

### ✏️ Message Editing

Users can edit their own messages.

The service verifies message ownership before updating the message:

```text
Message
   │
   ▼
Check Author
   │
   ├── not owner → reject
   │
   └── owner
        │
        ▼
     Update
        │
        ▼
  message:update
```

The updated message is then broadcast to clients connected to the relevant channel.

---

### 🗑️ Message Deletion

Message deletion is implemented as a soft delete.

Instead of removing the message record entirely, the service writes a `deletedAt` timestamp.

The returned message is then represented with `content: null`.

```text
Original Message
      │
      ▼
   Delete
      │
      ▼
 deletedAt = now
      │
      ▼
MESSAGE_DELETE
```

This preserves the underlying message entity while removing its visible content from the conversation.

---

### 📜 Cursor-Based Message Pagination

Message history is not fetched as one unbounded collection.

The backend supports cursor-based pagination with:

* Cursor
* Limit
* `hasMore`
* `nextCursor`

The default page size is 20 messages.

The frontend consumes this through TanStack Query's `useInfiniteQuery`.

```text
Initial Request
      │
      ▼
  First Page
      │
      ▼
   nextCursor
      │
      ▼
  Next Request
      │
      ▼
  More Messages
```

This gives the chat history a scalable loading model instead of requiring the entire conversation to be loaded at once.

---

### 🔴 Unread Channel Tracking

Cote tracks unread messages at the channel level.

Each channel membership stores a `lastReadAt` timestamp.

When a user joins a channel through the socket layer, the channel is marked as read.

Unread messages are calculated relative to that timestamp:

```text
lastReadAt
     │
     ▼
Messages after lastReadAt
     │
     ▼
Unread Count
```

The application can also retrieve aggregated unread counts across a workspace.

---

### ⌨️ Typing Indicators

Typing state is handled through Socket.IO events rather than HTTP requests.

The server exposes:

```text
typing:start
typing:stop
```

Before broadcasting a typing event, the server verifies that the user is actually a member of the channel.

Typing events are then emitted only to other clients in that channel room.

```text
Client
   │
   │ typing:start
   ▼
Socket.IO
   │
   ▼
Verify Channel Membership
   │
   ▼
Channel Room
   │
   ├────────► Client B
   └────────► Client C
```

---

### 🟢 User Presence

Cote tracks online users through active Socket.IO connections.

The server maintains:

```text
userId → Set<socketId>
```

This is important because one user can have multiple active sockets, such as:

* Multiple browser tabs
* Multiple devices

The user is only considered offline when their **last active socket disconnects**.

Presence events include:

```text
user:online
user:offline
user:presence:snapshot
```

When a user connects, they receive a snapshot of currently online users.

---

## Real-Time Architecture

Cote's real-time architecture is built around **channel rooms**.

When a client enters a channel, the socket joins the corresponding channel room.

```text
Socket
   │
   ▼
channel:join
   │
   ▼
socket.join(channelId)
   │
   ▼
Channel Room
```

Messages and typing events can then be broadcast directly to that room.

The backend defines a central event vocabulary:

```text
Message
├── message:new
├── message:update
└── message:delete

Typing
├── typing:start
└── typing:stop

Channel
├── channel:join
└── channel:leave

Presence
├── user:online
├── user:offline
└── user:presence:snapshot
```

Both the server and client maintain the same event names.

---

## Real-Time Message Flow

A message mutation follows a simple but important ordering:

```text
                  Client
                     │
                     │ HTTP mutation
                     ▼
              ┌──────────────┐
              │ Express API  │
              └──────┬───────┘
                     │
                     ▼
                Message Service
                     │
                     ▼
                  Database
                     │
                     │ persisted
                     ▼
                Socket.IO
                     │
                     ▼
                Channel Room
                 /       \
                /         \
               ▼           ▼
           Client A      Client B
```

The persistence operation happens before the broadcast.

This keeps the database as the durable source of truth while Socket.IO acts as the real-time synchronization mechanism.

---

## Authentication Architecture

HTTP requests and Socket.IO connections both use the same server-side session model.

### HTTP Authentication

```text
Request
  │
  ▼
Session Cookie
  │
  ▼
SHA-256 Hash
  │
  ▼
Session Lookup
  │
  ▼
Expiry Check
  │
  ▼
User Lookup
  │
  ▼
req.user
```

The `requireAuth` middleware validates the session cookie, hashes the supplied token, checks the session record and expiry, and loads the associated user.

### Socket Authentication

The Socket.IO middleware extracts the session cookie from the handshake request and performs the same session validation before attaching the authenticated user to the socket.

This means unauthenticated socket connections do not gain access to the real-time layer.

---

## API Architecture

The backend intentionally uses a simple:

```text
Router → Service
```

architecture.

```text
HTTP Request
     │
     ▼
Express Router
     │
     ▼
Validation
     │
     ▼
Service
     │
     ├────────────► Database
     │
     └────────────► Socket.IO
     │
     ▼
JSON Response
```

The goal is to keep HTTP concerns in routes and application behavior in services without introducing abstraction layers that do not provide value.

---

## Validation

Request validation is performed at the route boundary.

Workspace operations, for example, use dedicated validation middleware backed by Zod schemas. Invalid data is rejected before the service layer executes.

This keeps validation concerns close to the API boundary:

```text
Request
   │
   ▼
Schema Validation
   │
   ├── invalid → 400
   │
   └── valid
         │
         ▼
       Service
```

---

## Frontend Architecture

The frontend uses React with a page/layout based routing structure.

The current routing hierarchy includes:

```text
/login
   │
   └── Public Route

/
   │
   └── Workspace Selection

/:workspaceId
   │
   └── Workspace Page

/:workspaceId/:channelId
   │
   └── Channel Page
```

Protected routes are separated from the public login route.

The client also uses `QueryClientProvider` to provide TanStack Query throughout the application.

---

## Client State Management

Cote separates API-backed state from local UI concerns.

TanStack Query is used for server state such as messages.

For example, message history is represented as an infinite query:

```text
useInfiniteQuery
      │
      ├── Page 1
      ├── Page 2
      ├── Page 3
      └── ...
```

Mutations are provided separately for:

```text
sendMessage
updateMessage
deleteMessage
```

This keeps the communication UI decoupled from the underlying API service functions.

---

## Tech Stack

### Frontend

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| React 19         | UI                            |
| TypeScript       | Type safety                   |
| Vite             | Development and build tooling |
| React Router 7   | Client-side routing           |
| TanStack Query 5 | Server-state management       |
| Axios            | HTTP communication            |
| Socket.IO Client | Real-time communication       |
| Tailwind CSS 4   | Styling                       |
| shadcn           | UI components                 |
| Lucide React     | Icons                         |

The current client dependencies reflect this stack.

---

### Backend

| Technology                    | Purpose                 |
| ----------------------------- | ----------------------- |
| Node.js                       | Runtime                 |
| Express 5                     | REST API                |
| Socket.IO                     | Real-time events        |
| Zod                           | Request validation      |
| Cookie / Cookie Parser        | Session cookie handling |
| Google APIs                   | Google OAuth            |
| Prisma ORM / Postgres adapter | Database access         |

The backend package currently includes Express, Socket.IO, Zod, Google APIs, cookie tooling, and the Prisma PostgreSQL stack.

---

## Data Model

The application is built around several core entities:

```text
User
 │
 ├──────────────► Session
 │
 ├──────────────► WorkspaceMember
 │                       │
 │                       ▼
 │                   Workspace
 │                       │
 │                       ▼
 │                    Channel
 │                       │
 │                       ├──────► ChannelMember
 │                       │
 │                       └──────► Message
 │
 └──────────────► WorkspaceInvitation
```

The major relationships are:

### User

Represents an authenticated application user.

### Session

Represents an active server-side login session.

### Workspace

Represents a collaborative workspace.

### WorkspaceMember

Associates users with workspaces and stores their role.

### WorkspaceInvitation

Represents an invitation to join a workspace.

### Channel

Represents a communication space inside a workspace.

### ChannelMember

Represents a user's membership in a channel and stores read-state information.

### Message

Represents a persisted message authored by a user inside a channel.

---

## Message Lifecycle

A message moves through a clear lifecycle:

```text
                ┌──────────┐
                │ Created  │
                └────┬─────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
      Updated               Deleted
          │                     │
          ▼                     ▼
   message:update        deletedAt set
                                │
                                ▼
                         message:delete
```

Editing and deletion both require the message author to be the requesting user.

---

## Engineering Decisions

### Why Socket.IO + REST?

REST and real-time sockets solve different problems.

REST is used for explicit application operations:

```text
Create
Read
Update
Delete
```

Socket.IO is used for events that benefit from immediate propagation:

```text
New message
Updated message
Deleted message
Typing state
Presence changes
```

This keeps transport responsibilities clear.

---

### Why Server-Side Sessions?

The application uses a session-backed authentication model rather than putting the authenticated user entirely inside a client-managed token.

A random session token is generated, its SHA-256 hash is persisted, and the raw token is returned to the browser in an HTTP-only cookie.

This gives the backend explicit control over:

* Session lookup
* Session expiry
* Session invalidation
* Authentication for both HTTP and sockets

---

### Why Channel Rooms?

Socket.IO rooms provide a natural boundary for communication.

A channel maps directly to a socket room:

```text
Channel
   │
   ▼
Socket.IO Room
   │
   ├──────► Member A
   ├──────► Member B
   └──────► Member C
```

This prevents channel-specific events from being broadcast indiscriminately to every connected user.

---

### Why Soft Delete Messages?

Deleting the database row completely would remove the message identity and historical record.

Instead, Cote stores a deletion timestamp and exposes the deleted message without its content.

This gives the UI enough information to preserve the conversation structure while hiding deleted content.

---

### Why Cursor Pagination?

Chat histories can grow indefinitely.

Fetching every message for a channel would become increasingly expensive.

Cursor pagination allows the client to progressively retrieve older messages:

```text
Newest
  │
  ▼
Page 1
  │
  ▼
Cursor
  │
  ▼
Page 2
  │
  ▼
Cursor
  │
  ▼
Page 3
```

The current API returns both `nextCursor` and `hasMore`, making the pagination state explicit.

---

### Why Track User Socket Sets?

A single browser tab does not necessarily equal a single user connection.

Users can have:

```text
Browser Tab 1 ──► Socket A
Browser Tab 2 ──► Socket B
Laptop         ──► Socket C
```

Cote therefore tracks a set of sockets per user and only broadcasts `user:offline` after the final socket disconnects.

This prevents incorrect offline indicators when a user simply switches tabs or devices.

---

## Security Considerations

The backend currently incorporates several important controls:

* Google OAuth authentication
* HTTP-only session cookies
* Hashed session tokens
* Session expiry
* Authenticated Socket.IO connections
* Workspace membership checks
* Channel membership checks for channel-level socket actions
* Role-based authorization for workspace operations
* Message ownership checks
* Zod request validation
* CORS configuration

Authentication is applied to workspace, channel, message, and `/me` API routes through the `requireAuth` middleware.

---

## Project Structure

```text
cote-v2/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── services/
│   │   └── ...
│   ├── components.json
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── channel/
│   │   │   ├── message/
│   │   │   └── workspace/
│   │   ├── prisma/
│   │   ├── socket/
│   │   └── ...
│   ├── migrations/
│   └── package.json
│
└── ...
```

The backend is organized by domain modules rather than by large global controller/repository abstractions.

---

## API Surface

The backend is currently organized around these top-level API groups:

```text
/api/v1/auth
/api/v1/me
/api/v1/workspaces
/api/v1/channels
/api/v1/messages
```

Authentication is public where required for OAuth entry points, while workspace, channel, message, and `/me` endpoints require authentication.

### Authentication

```text
GET  /api/v1/auth/google
GET  /api/v1/auth/google/callback
POST /api/v1/auth/logout
```

### Workspace

Includes operations for:

```text
Create workspace
List workspaces
Get workspace
Update workspace
Manage members
Manage roles
Get unread counts
Create invitations
List invitations
Accept invitations
Decline invitations
```

### Channels

Includes:

```text
Create channel
List channels
Search channels
Get channel
Join channel
Leave channel
Update channel
Get unread count
Delete channel
```

### Messages

Includes:

```text
Send message
Get messages
Update message
Delete message
```

The implemented route modules expose these operations directly.

---

## Getting Started

### Prerequisites

Install:

* Node.js
* npm
* PostgreSQL
* A Google OAuth application

You will also need the environment variables required by the client and server configuration.

---

### 1. Clone the repository

```bash
git clone https://github.com/SourabhRavi/cote-v2.git
cd cote-v2
```

---

### 2. Install frontend dependencies

```bash
cd client
npm install
```

---

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

---

### 4. Configure environment variables

Create the required environment files.

For the client:

```text
client/.env
```

For the server:

```text
server/.env
```

The repository includes a client `.env.example`.

Do not commit credentials, OAuth secrets, or session configuration to source control.

---

### 5. Start the backend

```bash
cd server
npm run dev
```

The current development command starts:

```text
node src/server.js
```

The server creates both the Express application and the Socket.IO server from the same HTTP server.

---

### 6. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will provide the local development URL.

---

## Development Commands

### Frontend

Start development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

These commands are defined in the current client package configuration.

---

### Backend

Start development server:

```bash
npm run dev
```

Emit the Prisma contract when needed:

```bash
npm run contract:emit
```

These commands are defined in the current server package configuration.

---

## Deployment

The frontend is configured for deployment on Vercel.

**Live application:** [cote-v2-beta.vercel.app](https://cote-v2-beta.vercel.app)

The production environment requires:

* Frontend environment configuration
* Backend deployment
* PostgreSQL configuration
* Google OAuth configuration
* Client/server origin configuration
* Secure session cookie configuration

The Express server configures CORS and Socket.IO with the configured client URL and credentials enabled.

---

## What This Project Demonstrates

Cote was built to explore the engineering challenges behind a collaborative communication product rather than only reproducing a chat interface.

The project demonstrates experience with:

* React 19
* TypeScript
* Full-stack application architecture
* Express 5
* REST API design
* Google OAuth
* Server-side session authentication
* PostgreSQL
* Prisma ORM
* Socket.IO
* Real-time messaging
* Socket rooms
* User presence
* Typing indicators
* Workspace modeling
* Role-based authorization
* Workspace invitations
* Channel membership
* Channel discovery and search
* Unread message tracking
* Cursor-based pagination
* Message editing
* Soft deletion
* TanStack Query
* Responsive frontend architecture
* Domain-oriented backend modules
* Request validation with Zod

More importantly, the project demonstrates the separation between:

```text
Durable application state
             +
Real-time client synchronization
```

That boundary is one of the fundamental design problems in collaborative applications.

---

## Author

**Sourabh Ravi**

Full-stack developer focused on building modern web applications, scalable backend systems, and AI-powered products.

[GitHub](https://github.com/SourabhRavi)

---

<p align="center">
  <strong>Cote</strong><br>
  Real-time collaboration, built from the ground up.
</p>
