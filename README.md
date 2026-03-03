<p align="center">
  <img src="android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png" alt="TaskFlow App Icon" width="120" height="120" style="border-radius: 24px;"/>
</p>

<h1 align="center">TaskFlow</h1>

<p align="center">
  <img src="featuredbanner.png" alt="TaskFlow Featured Banner" width="100%" style="border-radius: 24px;" />
</p>

<p align="center">
  <strong>The Ultimate Privacy-First Productivity Suite</strong><br/>
  On-device AES-256 Encryption · Offline-first Architecture · Deep Work Focus Timer · Daily Streak Engine
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Security-AES--256-blueviolet?style=flat-square" alt="AES-256"/>
  <img src="https://img.shields.io/badge/React%20Native-0.84-61DAFB?logo=react&logoColor=white&style=flat-square" alt="React Native"/>
  <img src="https://img.shields.io/badge/Privacy-Local%20Only-success?style=flat-square" alt="Privacy"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

<br/>

## � What is TaskFlow?

**TaskFlow** is a premium, high-performance task management application built for users who refuse to compromise on **privacy** or **aesthetics**. Unlike traditional productivity apps that sync your data to the cloud, TaskFlow keeps everything on your device, protected by industrial-grade **AES-256 encryption**.

It combines a minimalist design system with powerful features like a Pomodoro focus timer, interactive completion heatmaps, and a streak engine designed to build lasting habits.

---

## 🛡️ Security & Privacy (The Core)

TaskFlow is built on a "Privacy-First" philosophy:

- **On-Device AES Encryption**: Every task, note, and steak log is encrypted using **AES-256** before being written to storage. Your data is unreadable to any other app or entity on the device.
- **Zero Cloud Sync**: Your data never leaves your phone. No accounts, no backends, no tracking.
- **Secure Entropy**: Uses `react-native-get-random-values` to provide native-level secure random number generation for encryption keys.
- **Privacy-First Positioning**: Any location or contextual data used for "positioning" checks is handled strictly locally and remains private.

---

## ✨ Features

### 🗒️ Encrypted Task Management

- **Full CRUD**: Create, edit, and delete tasks with rich metadata (Tags, Priority, Due Dates).
- **Intelligent Auto-Cleanup**: The app automatically identifies and purges completed tasks from previous days, keeping your storage lean and your mind clear.
- **Priority Hierarchy**: Dynamic color-coding and sorting based on task urgency (High, Medium, Low).

### 🍅 Focused Productivity (Pomodoro)

- **Task-Linked Timer**: Start deep-work sessions tied directly to specific tasks.
- **Background Persistence**: If the app is closed, the timer continues. Upon return, the `GlobalCelebration` system handles completions that occurred while you were away.
- **Immersive Mode**: A dedicated screen with minimalist animations to minimize distractions.

### � Habits & Analytics

- **Streak Engine**: A strict streak counter that rewards total daily completion. Rest days (no tasks) bridge the streak, but a single incomplete task resets it.
- **Completion Heatmap**: A GitHub-style activity grid to visualize your productivity over months.
- **Dynamic Stats**: Real-time tracking of "Perfect Days" and "Total Tasks Completed."

---

## � The "Status Cycle" Logic

TaskFlow uses a fluid state-machine for tasks:

```
  ┌────────┐      Swipe Right     ┌─────────────┐      Swipe Right     ┌───────────┐
  │ To Do  │ ───────────────────▶ │ In Progress │ ───────────────────▶ │ Completed │
  └────────┘                      └─────────────┘                      └───────────┘
                                                                             │
                                              Auto-cycles to Tomorrow        │
                                          ◀──────────────────────────────────┘
```

- **Rescheduling**: Marking a task "Completed" and then cycling it back will automatically reschedule it for **9:00 AM Tomorrow**.
- **Gestures**: Powered by `Reanimated` and `PanResponder` for a premium, tactile feel.

---

## 🗂️ Project Structure

```
src/
├── utils/
│   └── security.ts               # AES encryption/decryption logic (Crypto-JS)
├── context/
│   └── TimerContext.tsx           # Encrypted timer state & background persistence
├── components/
│   ├── PrivacyStatus.tsx         # Dashboard security indicator
│   ├── GlobalCelebration.tsx     # Background completion handler
│   └── AddTaskBottomSheet.tsx    # New task entry form
├── hooks/
│   ├── useTaskManager.ts         # Encrypted CRUD & Auto-Cleanup hygiene
│   └── useStreak.ts              # habit logging & streak computation
└── data/
    └── color-theme.tsx           # Design tokens (Google Sans Flex, Palette)
```

---

## 🛠️ Tech Stack

| Category        | Technology                                   |
| --------------- | -------------------------------------------- |
| **Frontend**    | React Native 0.84+                           |
| **Navigation**  | React Navigation v7                          |
| **Security**    | Crypto-JS (AES-256) + Native GetRandomValues |
| **Persistence** | AsyncStorage (Encrypted Layer)               |
| **Icons**       | Lucide React Native                          |
| **Animation**   | React Native Animated API + PanResponder     |

---

## 🚀 Installation

### 1 · Clone & Install

```bash
git clone https://github.com/SM8UTI/TaskFlow.git
npm install
```

### 2 · Android Rebuild (Required for Native Security)

Because TaskFlow uses native modules for secure entropy, a fresh build is required after installation:

```bash
npx react-native run-android
```

### 3 · Desktop & Web

TaskFlow is optimized for mobile, but the core logic is cross-compatible. Use `npx react-native start` to link your dev environment.

---

## 📝 License

MIT License — © 2026 **Smruti Ranjan Nayak**

<p align="center">
  Built with ❤️ for Privacy. <a href="https://sm8uti.com">sm8uti.com</a>
</p>
