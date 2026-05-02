# 🚀 Slack Bot Setup (Local Development)

This guide explains how to:

1. Create / activate the Slack bot
2. Connect it to your local Node.js backend using ngrok

---

## 🧩 1. Create / Access Slack App

1. Go to: https://api.slack.com/apps
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Enter:

   * App Name: `project-bot`
   * Select your workspace

---

## 🤖 2. Enable Bot User

1. Go to **App Home**
2. Enable:

   * "Allow users to send messages"
3. Add a bot user

---

## 🔑 3. Set Permissions

Go to **OAuth & Permissions**

### Add Bot Token Scopes:

* `app_mentions:read`
* `channels:history`
* `channels:read`
* `chat:write`
* `im:history`
* `im:read`
* `im:write`
* `groups:history`
* `groups:read`

### Install App

* Click **"Install to Workspace"**
* Copy:

  * `Bot Token (xoxb-...)`
  * `Signing Secret`

---

## ⚙️ 4. Start Local Backend

```bash
npm install
npm run dev
```

Make sure server runs on:

```
http://localhost:3000
```

---

## 🌐 5. Start ngrok

In a new terminal, run:

```bash
ngrok http 3000
```

If you get an authentication error:

1. Go to: [ngrok Signup/Login](https://dashboard.ngrok.com/signup) and create/login to your account.
2. Copy your authtoken from: [ngrok Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).
3. Run the following command in your terminal:

```bash
ngrok config add-authtoken <your_token>
```

Then run again:

```bash
ngrok http 3000
```

You will get a URL like:

```
https://<random-id>.ngrok-free.app
```

---

## 🔗 6. Connect Slack to Backend

1. Go to **Event Subscriptions**
2. Enable Events
3. Set Request URL:

```
https://<ngrok-url>/slack/events
```

⚠️ Replace `<ngrok-url>` with your actual ngrok URL

---

## 🔄 7. Add Events

Under **Subscribe to Bot Events**, add:

* `app_mention`
* `message.channels`
* `message.im`

---

## 💬 8. Invite Bot to Channel

In Slack:

```
/invite @project-bot
```

---

## 🧪 9. Test Bot

In a channel:

```
@project-bot hello
```

---

## ⚠️ Important Notes

* ngrok URL changes every time you restart it
* You must update the Slack Request URL each time
* Bot must be added to channel to receive messages

---

## 🧯 Common Issues

* ❌ No response → Bot not invited to channel
* ❌ Slack URL verification failed → backend not handling challenge
* ❌ Events not received → wrong ngrok URL or endpoint

---

## ✅ Minimal Working Flow

```
Slack → ngrok → Node.js backend → Response → Slack
```

---
