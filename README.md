# 🗣️ Forum App

A full-stack forum web application where users can create threads, post replies, like posts, and interact in shared discussions. Built with Node.js, Express, MongoDB, and EJS.

## ✨ Features

- ✅ User authentication (login/register/logout)
- ✅ Create and delete threads
- ✅ Post replies to threads
- ✅ Like/unlike posts
- ✅ Simple user profile pages
- ✅ Thread and post editing/deletion
- ✅ Clean, responsive UI using CSS

## 🛠️ Tech Stack

- **Frontend**: EJS, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Express-session & bcrypt
- **Templating**: EJS

## 🏗️ Structure

```
forum-app/
├── models/        # Mongoose models (User, Thread, Post)
├── routes/        # Express routes (auth, threads, posts)
├── views/         # EJS templates (home, login, thread, post, etc.)
├── public/        # Static files (CSS, images)
├── middleware/    # Authentication checks
├── server.js      # Main Express server
├── package.json
└── .env
```

