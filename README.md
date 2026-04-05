# Appify — Social Media Application

A full-stack social media web application built with the MERN stack (MongoDB, Express, React, Node.js). The project converts a static HTML/CSS template into a fully functional, production-ready application with a real backend API, authentication, and cloud media storage.

## 🚀 Live Deployment

- **Frontend:** [https://starlit-sopapillas-bd4994.netlify.app](https://starlit-sopapillas-bd4994.netlify.app)
- **Backend API:** [https://social-media-app-buddy.onrender.com](https://social-media-app-buddy.onrender.com)

---

## Table of Contents

- [What Was Built](#what-was-built)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Architecture Decisions](#architecture-decisions)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)

---

## What Was Built

Starting from a completed static HTML/CSS frontend template, the following was implemented from scratch:

1. **Node.js + Express backend** — production-ready REST API with security middleware, input validation, rate limiting, and structured error handling
2. **MongoDB data layer** — Mongoose models for Users, Posts, Comments, Stories, Notifications, and Refresh Tokens
3. **JWT authentication** — short-lived access tokens (stateless) paired with long-lived refresh tokens stored in MongoDB for revocation support
4. **Cloudinary image upload** — posts and stories use streamed multipart uploads with no disk writes on the server
5. **Redis feed caching** — optional cache layer for the public feed (30-second TTL, invalidated on post create/delete)
6. **React frontend integration** — all UI components connected to real API data; no design or class names were changed
7. **Notification system** — database-backed notifications triggered by likes and comments, with a live unread badge polled every 30 seconds
8. **Stories** — 24-hour TTL via MongoDB index, own story always pinned first
9. **Post and comment likes modals** — click the reaction area on any post or comment to see who liked it, with cursor-based pagination
10. **Post dropdown** — open/close toggle, outside-click dismissal, closes automatically on delete
11. **Post visibility** — choose Public or Only me when creating a post; the backend filters private posts from other users' feeds
12. **`isLikedByViewer` on page load** — liked state is computed per-viewer on the server after every feed fetch, so hearts/thumbs are in the correct state immediately

---

## Tech Stack

### Backend
| Concern | Library |
|---|---|
| Framework | Express 4 |
| Database | MongoDB (via Mongoose 8) |
| Authentication | jsonwebtoken + bcryptjs |
| Validation | Joi |
| Image upload | Multer (memory storage) + Cloudinary v2 |
| Caching | Redis (optional, via redis v4) |
| Security | helmet, cors, express-mongo-sanitize, hpp, express-rate-limit |
| Logging | Winston + Morgan |

### Frontend
| Concern | Library |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| HTTP client | Axios |
| Styling | Bootstrap 5 + custom CSS (original template) |
| Fonts | Poppins (Google Fonts), Font Awesome 5, Flaticon |

---

## Project Structure

```
Social-Media-App-Buddy/
├── server/                        # Node.js + Express backend
│   ├── config/                    # DB, Redis, Cloudinary setup
│   ├── controllers/               # Thin HTTP handlers
│   ├── middlewares/               # Auth, error, validation, upload, rate limit
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Story.js
│   │   ├── Notification.js
│   │   └── RefreshToken.js
│   ├── routes/                    # Express routers
│   ├── services/                  # Business logic layer
│   ├── utils/                     # JWT helpers, logger, API response helpers
│   ├── validations/               # Joi schemas
│   ├── app.js                     # Express app + middleware chain
│   ├── server.js                  # Entry point with graceful shutdown
│   └── .env.example
│
└── frontend/            # React frontend
    └── src/
        ├── api/                   # Axios API calls (one file per domain)
        ├── assets/                # Images, fonts, CSS
        ├── components/
        │   ├── feed/              # Posts, comments, stories, create post
        │   ├── layout/            # NavBar, mobile nav, search, theme switcher
        │   ├── notification/      # Notification dropdown + items
        │   ├── profile/           # Profile dropdown
        │   ├── sidebarLeft/       # Explore, Suggested People, Events
        │   └── sidebarRight/      # You Might Like, Your Friends
        ├── context/               # AuthContext, ThemeContext
        ├── hooks/                 # usePaginatedList, useStoryUpload
        ├── pages/                 # Login, RegisterForm, HomePage
        ├── routes/                # ProtectedRoute, PublicRoute
        └── utils/                 # timeAgo, avatar fallback
```

---

## Features

### Authentication
- Register with first name, last name, email, and password
- Login returns a short-lived access token (10h) and a long-lived refresh token (7d)
- Refresh tokens are stored in MongoDB — they can be revoked individually (`/logout`) or all at once (`/logout-all`)
- Axios interceptors automatically attach the Bearer token and transparently refresh on 401

### Posts
- Create a post with text, an image, or both
- Choose visibility — **Public** (visible to everyone in the feed) or **Only me** (private) — before posting
- Image is uploaded to Cloudinary before the post is created; a local blob URL shows an instant preview
- Cursor-based feed pagination (newest first) — no expensive `skip` offsets
- Delete your own post from the three-dot dropdown; the card is immediately removed from the feed without a page reload

### Comments & Replies
- Add comments to any post (Enter key to submit)
- Reply to a comment (one level deep — reply-to-reply is intentionally prevented)
- Like or delete any comment you own
- Comment and reply counts are updated atomically on the server

### Likes
- Toggle like on posts and comments
- Click the reaction image area on any post or comment to open a modal listing every user who liked it, with load-more pagination
- Liked state (`isLikedByViewer`) is computed server-side per viewer and reflected immediately on page load — the like button is already in the correct filled/unfilled state without any client-side round-trip

### Stories
- Upload a photo story from the feed (desktop and mobile layouts)
- Stories auto-expire after 24 hours via a MongoDB TTL index
- Your own story is always shown first; others are collapsed to one card per author

### Notifications
- Automatic notifications for: someone liked your post, liked your comment, commented on your post, or replied to your comment
- Self-notifications are always suppressed
- Unread count badge in the navbar, polled every 30 seconds
- Click a notification to mark it read; "Mark as all read" clears the badge instantly
- Filter between All / Unread in the dropdown

### Theme
- Light / dark mode toggle persisted in `localStorage`; applies `_dark_wrapper` class to `<body>`

---

## Architecture Decisions

### Cursor pagination over offset pagination
All list endpoints (feed, comments, likes, notifications) use `_id`-based cursor pagination. MongoDB's ObjectId encodes a timestamp and is monotonically increasing, so `{ _id: { $lt: cursor } }` is an O(1) index seek regardless of collection size, unlike `skip()` which scans and discards rows.

### Denormalized author snapshots on Post and Comment
Each document stores a snapshot of `{ _id, firstName, lastName, avatar }` from the author at write time. Feed rendering requires zero joins — one query returns everything needed to display a post or comment. The trade-off is that if a user updates their name/avatar, existing posts will not reflect the change, which is acceptable for this use case.

### Stateless access tokens + database refresh tokens
Access tokens are verified without a database lookup (fast, scalable). Refresh tokens are stored in MongoDB with a TTL index so they automatically expire, and individual tokens can be revoked by deleting the record — solving the main limitation of purely stateless JWT.

### Redis as an optional cache layer
The first page of the public feed is cached under the key `feed:public` for 30 seconds. Redis is entirely optional — the server falls back to uncached MongoDB queries if `REDIS_ENABLED=false` or the connection fails. This avoids making Redis a hard dependency for local development.

### Notifications as fire-and-forget
Notification creation is never awaited in the critical path. A failed notification must not break the like or comment operation that triggered it. Each call uses `.catch(() => {})` to ensure errors are swallowed silently.

### `isLikedByViewer` computed post-cache
After each feed page is fetched (and optionally written to Redis), the service runs a single extra query — `Post.find({ _id: { $in: pageIds }, likes: viewerOid }).select('_id')` — builds an in-memory Set, and maps `isLikedByViewer` onto every post. Viewer-specific data is therefore never written to the shared Redis cache, keeping the cache clean for all users while still delivering the correct liked state per request. The same pattern is applied to comments and replies.

### Custom hooks for shared logic
Two hooks eliminate code duplication:
- `usePaginatedList` — a single implementation of cursor pagination state used by the feed, comments, and the likes modal
- `useStoryUpload` — the file-picker + Cloudinary upload flow shared by desktop and mobile story components

### Image upload via memory storage
Multer is configured with `memoryStorage()`. The file buffer is piped directly to Cloudinary's `upload_stream` with no intermediate disk write. This keeps the server stateless and avoids cleanup concerns.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- A MongoDB connection (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A [Cloudinary](https://cloudinary.com) account (free tier is sufficient)
- Redis (optional — set `REDIS_ENABLED=false` to skip)

### 1. Clone the repository

```bash
git clone https://github.com/MdAsrafAli/Social-Media-App-Buddy.git
cd Appify
```

### 2. Set up the backend

```bash
cd server
cp .env.example .env
# Edit .env — fill in MONGO_URI, JWT secrets, Cloudinary credentials
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
# App starts on http://localhost:5173
```

The Vite dev server proxies all `/api` requests to `http://localhost:5000`, so no CORS configuration is needed during development.

---

## Environment Variables

All backend configuration lives in `server/.env`. Copy `server/.env.example` and fill in the values.

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens — use a long random string |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens — must differ from access secret |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime e.g. `10h` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime e.g. `7d` |
| `REDIS_URL` | Redis connection URL e.g. `redis://:password@host:port` |
| `REDIS_ENABLED` | `true` to enable caching, `false` to skip |
| `CLIENT_ORIGIN` | Frontend origin for CORS e.g. `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |

Generate strong JWT secrets:
```bash
node -e "require('crypto').randomBytes(64).toString('hex')"
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create account |
| POST | `/login` | Login, returns access + refresh tokens |
| POST | `/refresh` | Get a new access token using a refresh token |
| POST | `/logout` | Revoke current refresh token |
| POST | `/logout-all` | Revoke all refresh tokens for the user |

### Posts — `/api/posts` (protected)
| Method | Path | Description |
|---|---|---|
| GET | `/` | Paginated public feed (`?cursor=&limit=`) |
| POST | `/` | Create a post |
| GET | `/:id` | Get a single post |
| DELETE | `/:id` | Delete your post |
| POST | `/:id/likes` | Toggle like on a post |
| GET | `/:id/likes` | List users who liked a post |
| GET | `/:id/comments` | List comments on a post |
| POST | `/:id/comments` | Add a comment or reply |

### Comments — `/api/comments` (protected)
| Method | Path | Description |
|---|---|---|
| GET | `/:id/replies` | List replies to a comment |
| DELETE | `/:id` | Delete your comment |
| POST | `/:id/likes` | Toggle like on a comment |
| GET | `/:id/likes` | List users who liked a comment |

### Stories — `/api/stories` (protected)
| Method | Path | Description |
|---|---|---|
| GET | `/` | All active stories (collapsed per author, own first) |
| POST | `/` | Create a story |
| DELETE | `/:storyId` | Delete your story |

### Notifications — `/api/notifications` (protected)
| Method | Path | Description |
|---|---|---|
| GET | `/` | Paginated notifications (`?filter=all\|unread&cursor=&limit=`) |
| GET | `/unread-count` | Number of unread notifications |
| PATCH | `/read-all` | Mark all notifications as read |
| PATCH | `/:id/read` | Mark one notification as read |

### Upload — `/api/upload` (protected)
| Method | Path | Description |
|---|---|---|
| POST | `/` | Upload an image to Cloudinary, returns `{ url, publicId }` |
