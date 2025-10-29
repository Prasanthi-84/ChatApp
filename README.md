# 💬 Modern Real-Time Chat App

A sleek and modern **real-time chat application** built using **Node.js**, **Express**, **Socket.io**, and **WebSockets**.  
Users can join specific chat rooms, send instant messages, and see who’s online — all in real-time ⚡

---

## 🚀 Features

✅ Real-time bidirectional communication  
✅ Room-based chat system  
✅ Dynamic user join/leave notifications  
✅ Modern glassmorphism UI design  
✅ Built with Node.js, Express, and Socket.io  
✅ Deployed easily on **Render**

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Real-Time Engine | Socket.io (built on top of WebSockets) |
| Deployment | Render |

---

## 🛠️ Installation and Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/socket-chat-app.git

# 2️⃣ Navigate to the server directory
cd socket-chat-app/server

# 3️⃣ Install dependencies
npm install

# 4️⃣ Run the server
npm start

| Feature                   | **WebSockets**             | **Socket.io**                   |
| ------------------------- | -------------------------- | -----------------------------   |
| **Protocol**              | Native browser API (ws://) | Built on top of WebSockets      |
| **Fallbacks**             |  None                      | ✅ HTTP long polling supported  |
| **Reconnection**          | ❌ Manual                  | ✅ Automatic reconnection       |
| **Custom Events**         | ❌ Only “message”          | ✅ Supports custom event names  |
| **Ease of Use**           | Low-level                  | High-level, beginner-friendly    |
| **Cross-Browser Support** | Partial                    | Excellent                        |

