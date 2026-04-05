# Appify — Assessment Submission Video Script

**Suggested total length:** 8–12 minutes
**Format:** Screen recording with voiceover
**Sections:** Intro → Project overview → Live demo → Architecture decisions → Closing

> **How to read this script**
> Lines in `[brackets]` are screen / action directions — what to show or click.
> Everything else is spoken narration.

---

## SECTION 1 — Introduction (0:00 – 0:45)

`[Show the running app in the browser — the feed page, logged in]`

Hi. In this video I'm walking through Appify, a full-stack social media application I built for this assessment. The starting point was a finished static HTML and CSS template. Everything you see working behind the scenes — the backend, the database, the authentication, the media uploads, and all the real-time UI interactions — was built from scratch on top of that template, without changing a single class name or any part of the design.

I'll cover what was built, show it working live, and then explain the key architecture decisions I made along the way.

---

## SECTION 2 — Project Overview (0:45 – 1:45)

`[Switch to VS Code — show the top-level folder structure: server/ and frontend/]`

The project is a MERN stack application — MongoDB, Express, React, and Node.js.

`[Expand server/ — briefly show config/, controllers/, services/, models/, routes/]`

The backend is a REST API built with Express. I followed a layered architecture: routes pass requests to thin controllers, controllers delegate all business logic to services, and the models define the data shape in Mongoose. This separation means I can test or replace any layer independently.

`[Expand frontend/src/ — briefly show api/, components/, hooks/, context/]`

The React frontend uses Vite as the build tool. API calls are organized one file per domain — posts, comments, stories, notifications. Shared stateful logic lives in custom hooks, and global state is in two contexts: Auth and Theme.

---

## SECTION 3 — Live Demo (1:45 – 7:30)

### 3.1 Registration and Login (1:45 – 2:15)

`[Navigate to the Register page]`

Starting with authentication. I can register with a first name, last name, email, and password.

`[Fill in the form and submit — show it redirecting to the feed]`

On success the server returns two tokens — a short-lived access token valid for ten hours, and a refresh token stored in MongoDB. The access token goes in memory; when it expires, an Axios interceptor silently fetches a new one using the refresh token. There's no manual re-login.

---

### 3.2 Creating a Post (2:15 – 3:00)

`[Click the create post area]`

I can create a post with text, an image, or both.

`[Select an image — point to the instant preview]`

The image is uploaded to Cloudinary before the post is submitted. You can see the preview appear immediately from a local blob URL — the upload happens in the background. When I click Post, the API creates the document with the Cloudinary URL already attached.

`[Point to the visibility toggle — click "Only me"]`

I can also set the visibility before posting. "Only me" creates a private post — it will appear in my own feed but not in anyone else's. "Public" is visible to everyone.

`[Click Post and watch the new card appear at the top of the feed]`

The new post appears at the top of the feed instantly, prepended into the list without a page reload.

---

### 3.3 Feed and Pagination (3:00 – 3:30)

`[Scroll down to the bottom of the feed]`

The feed is paginated using cursor-based pagination. When I reach the end of the current page, a Load More button fetches the next batch. I'll explain why I chose cursors over offset pagination in the architecture section.

---

### 3.4 Likes (3:30 – 4:00)

`[Click the like button on a post]`

Liking a post sends a toggle request to the server. If I already liked it, it unlikes. Notice the heart is already in the correct state when the page loads — I did not initialize it as false and fix it later. The server computes which posts the current viewer has liked and attaches that flag to every item in the feed response.

`[Click the reaction images area above the like count]`

Clicking the reaction area opens a modal showing every user who liked this post, with load-more pagination. The same works on comments.

---

### 3.5 Comments and Replies (4:00 – 4:45)

`[Click the comment input on a post and type a comment — press Enter]`

Comments are submitted with the Enter key. The new comment is prepended to the list immediately.

`[Point to the comment count — it increments live]`

The comment count updates right away without a page reload.

`[Click Reply on a comment — type a reply and submit]`

Replies are one level deep. Replying to a reply is intentionally prevented — it keeps the data model simple and the UI clean.

`[Click the like on a comment, then click the reaction area on the comment]`

I can like comments too, and clicking the reaction area shows the likes modal for that specific comment, the same way it works on posts.

---

### 3.6 Deleting a Post (4:45 – 5:10)

`[Click the three-dot dropdown on your own post]`

The three-dot menu opens on click and closes when I click anywhere outside it.

`[Click Delete]`

A confirmation dialog appears. If I confirm, the post is deleted on the server and removed from the feed immediately — no reload, no empty gap.

---

### 3.7 Stories (5:10 – 5:40)

`[Point to the story row at the top of the feed]`

Stories are shown at the top of the feed. My own story always appears first.

`[Click the add story button and pick an image]`

Uploading a story follows the same Cloudinary upload flow as posts. Stories auto-expire after 24 hours — that's handled by a MongoDB TTL index on the `createdAt` field, with no cron job needed.

---

### 3.8 Notifications (5:40 – 6:30)

`[Open a second browser tab / account — like a post from the first account]`

When another user likes your post, a notification is created on the server. I'll switch to the first account to show it.

`[Switch to first account — point to the notification badge on the navbar icon]`

The badge count updates automatically. It's polled every 30 seconds so it stays in sync without needing a WebSocket.

`[Click the notification bell — show the dropdown]`

The dropdown shows all notifications with the actor's name, what they did, and how long ago. I can filter between All and Unread.

`[Click one notification]`

Clicking a notification marks it as read. The badge count decrements immediately — no refresh needed. I can also mark everything read at once.

---

### 3.9 Theme Toggle (6:30 – 6:45)

`[Click the dark mode toggle]`

Light and dark mode are toggled from the header. The preference is saved in localStorage so it persists across sessions.

---

## SECTION 4 — Architecture Decisions (6:45 – 9:30)

`[Switch to VS Code or keep the app on screen — just voiceover is fine here]`

Let me cover the five decisions I think matter most.

---

### 4.1 Cursor Pagination

`[Show server/services/post.service.js — the getFeed query line]`

All list endpoints — the feed, comments, likes, and notifications — use cursor-based pagination. Instead of `skip(page * limit)`, I use `{ _id: { $lt: cursor } }`. MongoDB's ObjectId encodes a timestamp and is indexed by default, so this is an O(1) seek regardless of how large the collection gets. Offset pagination gets slower as the collection grows and can return duplicate or skipped items if documents are inserted during navigation.

---

### 4.2 Denormalized Author Snapshots

`[Show server/models/Post.js — the author embedded object]`

Each Post and Comment stores a snapshot of the author at write time: their ID, first name, last name, and avatar URL. Rendering a feed page requires zero joins — one query returns everything needed to display every card. The trade-off is that if a user later changes their name, old posts won't reflect it. For this use case that's acceptable, and it's the same approach most major social platforms use.

---

### 4.3 JWT Access + MongoDB Refresh Tokens

`[Show server/models/RefreshToken.js briefly]`

Access tokens are verified without any database lookup — that's what makes JWTs fast and stateless. But purely stateless tokens can't be revoked before they expire. To solve that, refresh tokens are stored in MongoDB with their own TTL index. Revoking a session means deleting the record. The Axios interceptor on the frontend handles the refresh transparently — the user never sees an expired token error.

---

### 4.4 isLikedByViewer Post-Cache

`[Show server/services/post.service.js — the isLikedByViewer block after the cache write]`

This was one of the more interesting problems. The feed's first page is cached in Redis, shared across all users. I can't store per-viewer data in that cache, or User A would see User B's liked state.

The solution: after the cache is written, I run one extra query — find all posts on this page where the viewer's ID is in the likes array — and map that result onto the feed before returning it. Viewer-specific data never touches the cache. The extra query uses an existing index and is fast.

---

### 4.5 Fire-and-Forget Notifications

`[Show server/services/like.service.js — the createNotification call]`

Notification creation is never awaited. A like or comment must not fail because a notification write failed. Each call ends with `.catch(() => {})`. The notification is best-effort infrastructure — if it works, great. If it doesn't, the core action the user just took still succeeds.

---

## SECTION 5 — Closing (9:30 – 10:00)

`[Switch back to the running app]`

That covers everything I built for this assessment. The full source code is in the repository, the README documents the setup steps and environment variables, and all the API endpoints are listed there too.

Thanks for watching.

---

## Quick Reference — Timestamps

| Time | Section |
|---|---|
| 0:00 | Introduction |
| 0:45 | Project structure overview |
| 1:45 | Registration and login |
| 2:15 | Creating a post |
| 3:00 | Feed and pagination |
| 3:30 | Likes |
| 4:00 | Comments and replies |
| 4:45 | Deleting a post |
| 5:10 | Stories |
| 5:40 | Notifications |
| 6:30 | Theme toggle |
| 6:45 | Architecture — cursor pagination |
| 7:15 | Architecture — denormalized authors |
| 7:45 | Architecture — JWT + refresh tokens |
| 8:15 | Architecture — isLikedByViewer |
| 8:50 | Architecture — fire-and-forget notifications |
| 9:30 | Closing |

---

## Recording Tips

- Run both the server and the Vite dev server before you start recording.
- Have two browser sessions open in separate windows (or use a private window for a second account) so you can demonstrate notifications live without switching tabs awkwardly.
- If Cloudinary upload is slow on your connection, record that section in one take so the timing is natural.
- Keep your browser zoom at 100% so text is legible in the recording.
- Record at 1920×1080 if possible — code in VS Code is hard to read at lower resolutions.
