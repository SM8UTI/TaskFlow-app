<p align="center">
  <img src="android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png" alt="TaskFlow App Icon" width="120" height="120" style="border-radius: 24px;"/>
</p>

<h1 align="center">TaskFlow</h1>

<p align="center">
  <img src="featuredbanner.png" alt="TaskFlow Featured Banner" width="100%" style="border-radius: 24px;" />
</p>

<p align="center">
  <strong>The Ultimate Privacy-First Productivity Suite</strong><br/>
  On-device AES-256 Encryption · Offline-first Architecture · Deep Work Focus Timer · Daily Streak Engine · Local Notifications
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Security-AES--256-blueviolet?style=flat-square" alt="AES-256"/>
  <img src="https://img.shields.io/badge/React%20Native-0.84-61DAFB?logo=react&logoColor=white&style=flat-square" alt="React Native"/>
  <img src="https://img.shields.io/badge/Notifications-Notifee-orange?style=flat-square" alt="Notifee"/>
  <img src="https://img.shields.io/badge/Privacy-Local%20Only-success?style=flat-square" alt="Privacy"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

<br/>

## 🧭 What is TaskFlow?

**TaskFlow** is a premium, high-performance task management application built for users who refuse to compromise on **privacy** or **aesthetics**. Unlike traditional productivity apps that sync data to the cloud, TaskFlow keeps everything on your device, protected by industrial-grade **AES-256 encryption**.

It combines a minimalist design system with powerful features — a Pomodoro focus timer, interactive completion heatmaps, a streak engine, a Brain Dump capture board, Android Share Intent support, and a fully **offline notification system** that delivers reminders and session alerts even when the app is killed.

---

## 🛡️ Security & Privacy (The Core)

TaskFlow is built on a "Privacy-First" philosophy:

- **On-Device AES Encryption** — Every task, note, and streak log is encrypted with **AES-256** before being written to storage. Data is unreadable to any other app or entity on the device.
- **Zero Cloud Sync** — Your data never leaves your phone. No accounts, no backends, no tracking.
- **Secure Entropy** — Uses `react-native-get-random-values` to provide native-level secure random number generation for encryption keys.
- **Encrypted Timer State** — Even the focus timer's state (taskId, remaining seconds, endTime) is stored encrypted via `crypto-js` through AsyncStorage.

---

## ✨ Features

### 🗒️ Encrypted Task Management

- **Full CRUD** — Create, edit, and delete tasks with rich metadata: tags, priority, due dates.
- **Swipe Gestures** — Swipe right to advance status, swipe left to delete. Powered by `PanResponder` with spring-physics snap-back.
- **Long-press Status Menu** — Long-press any in-progress or completed task card to cycle statuses in either direction without swiping.
- **Priority Hierarchy** — Dynamic colour-coding (High / Medium / Low) with dot indicators.
- **Intelligent Auto-Cleanup** — Completed tasks from previous days are automatically purged on load to keep storage lean.
- **YouTube Link Preview** — Paste a YouTube URL into a task description and a rich thumbnail + video title + channel name preview renders automatically, both on the task card and in the detail sheet.

### 🍅 Focus Timer (Pomodoro)

- **Task-Linked Sessions** — Start deep-work sessions tied directly to a specific task. The timer survives app closes and restores exact remaining time on re-open.
- **Background Persistence** — `TimerContext` uses `AppState` + `AsyncStorage` to track `endTime` as a Unix timestamp. If the session completes while the app is backgrounded, `completedWhileAway` is set and the `GlobalCelebration` system fires on next foreground.
- **Live Focus Notification** — An ongoing Android notification badge (`🎯 Focus Session Active`) pins to the notification tray while a session runs. Flips to `⏸ Focus Session Paused` when paused.
- **Background Completion Alarm** — A Notifee `TimestampTrigger` (AlarmManager exact alarm) is scheduled at the session's `endTime`. This fires `Focus Session Complete 🎉` even if the app is completely killed — no internet required.

### 🔔 Offline Notification System (Notifee)

All notifications work 100% offline via **@notifee/react-native**:

| Notification              | Trigger                    | Body                        |
| ------------------------- | -------------------------- | --------------------------- |
| Task Reminder ⏰          | Scheduled at task due date | Task title                  |
| Focus Session Active 🎯   | Session start              | `Stay focused on '…'`       |
| Focus Session Paused ⏸    | Timer paused               | `Paused — '…'`              |
| Focus Session Complete 🎉 | Timer ends / AlarmManager  | `Great work on '…'!`        |
| Daily Streak Reminder 🔥  | Every day at 8 PM          | `Complete your tasks today` |

- **Android 13+ permission** is requested automatically on first launch via `notifee.requestPermission()`.
- **Channel creation** is idempotent and guarded by an `ensureChannel()` helper to prevent race conditions.
- **AlarmManager** (`allowWhileIdle: true`) ensures delivery in Doze mode.

### 🧠 Brain Dump

- A dedicated **quick-capture board** for unstructured thoughts, links, and ideas.
- All entries are encrypted on-device.
- Supports YouTube link pasting — auto-generates a thumbnail preview card.
- Swipe-to-delete gesture with animated reveal, matching the task card pattern.

### 📲 Android Share Intent

- Share any content (e.g. a YouTube video from the YouTube app) directly **into TaskFlow**.
- Automatically creates a new task pre-filled with the shared URL/text.
- Handles cold-start (app not running) and warm-start (app already open) scenarios.
- Duplicate-prevention guard so the same share doesn't create multiple tasks.

### 📊 Habits & Analytics

- **Streak Engine** — Rewards consecutive days of full task completion. Rest days bridge the streak, but any incomplete task resets it.
- **Completion Heatmap** — GitHub-style activity grid to visualise productivity over weeks.
- **Dynamic Stats** — Real-time counts for Perfect Days, Tasks Completed, and Focus Sessions.
- **Calendar Screen** — Day-by-day view with a stat chip row, bar chart, and day-detail panel.

---

## 🔄 The "Status Cycle" Logic

TaskFlow uses a fluid state-machine for task lifecycle:

```
  ┌────────┐     Swipe Right      ┌─────────────┐     Swipe Right      ┌───────────┐
  │ To Do  │ ──────────────────▶  │ In Progress │ ──────────────────▶  │ Completed │
  └────────┘                      └─────────────┘                      └───────────┘
                                                                             │
                                          Auto-reschedules to 9 AM Tomorrow  │
                                      ◀──────────────────────────────────────┘
```

- **Rescheduling** — Cycling a completed task back resets its due date to **9:00 AM tomorrow**.
- **Long-press** — Quick prev/next status picker without needing to swipe.

---

## 🗂️ Project Structure

```
TaskFlow/
├── App.tsx                          # Root — bootstraps notifications on mount
├── src/
│   ├── screens/
│   │   ├── TaskScreen.tsx           # Main task list with search, tabs, gestures
│   │   ├── FocusScreen.tsx          # Pomodoro timer + live notification driver
│   │   ├── FocusSetupScreen.tsx     # Session configuration
│   │   ├── BrainDumpScreen.tsx      # Quick-capture board
│   │   ├── AnalyticsScreen.tsx      # Streak, heatmap, stats
│   │   ├── CalendarScreen.tsx       # Day-by-day productivity calendar
│   │   ├── SettingScreen.tsx        # App settings & preferences
│   │   └── HelpSupportScreen.tsx    # Help & FAQ
│   ├── services/
│   │   ├── NotificationService.ts   # Full offline notification layer (Notifee)
│   │   └── ShareIntentService.ts    # Android Share Intent handling
│   ├── components/
│   │   ├── TaskCard.tsx             # Swipeable task card with YouTube preview
│   │   ├── TaskDetailsInfo.tsx      # Detail sheet with YouTube info block
│   │   ├── YouTubePreview.tsx       # Thumbnail + title + channel component
│   │   ├── AddTaskBottomSheet.tsx   # Task creation form
│   │   ├── GlobalCelebration.tsx    # Background-completion celebration handler
│   │   └── AnimatedIconButton.tsx   # Reusable press-animated button
│   ├── context/
│   │   └── TimerContext.tsx         # Encrypted timer state & AppState sync
│   ├── hooks/
│   │   ├── useTaskManager.ts        # Encrypted CRUD, auto-cleanup, notif scheduling
│   │   ├── useStreak.ts             # Habit logging & streak computation
│   │   └── useTaskSheet.ts          # Bottom-sheet animation logic
│   ├── layouts/
│   │   └── TasksScreen/             # Composable header, list, detail-sheet layouts
│   ├── navigation/
│   │   └── TabNavigator.tsx         # Bottom tab navigator
│   ├── presentation/
│   │   └── ShareIntentHandler.tsx   # Share intent lifecycle component
│   ├── utils/
│   │   ├── security.ts              # AES-256 encrypt/decrypt helpers (CryptoJS)
│   │   └── youtube.ts               # YouTube ID extraction & URL masking
│   └── data/
│       └── color-theme.tsx          # Design tokens (palette, fonts, radii)
```

---

## 🛠️ Tech Stack

| Category            | Technology                                          |
| ------------------- | --------------------------------------------------- |
| **Framework**       | React Native 0.84 (bare workflow)                   |
| **Navigation**      | React Navigation v7 (stack + bottom tabs)           |
| **Notifications**   | @notifee/react-native 9.x (AlarmManager triggers)   |
| **Security**        | CryptoJS AES-256 + `react-native-get-random-values` |
| **Persistence**     | AsyncStorage with encrypted layer                   |
| **Animations**      | React Native Animated API + PanResponder            |
| **Icons**           | Lucide React Native                                 |
| **Share Intent**    | react-native-share-menu                             |
| **Vector Graphics** | react-native-svg                                    |

---

## 🚀 Installation

### 1 · Clone & Install

```bash
git clone https://github.com/SM8UTI/TaskFlow.git
cd TaskFlow
npm install
```

### 2 · Android Build (Required — uses native modules)

TaskFlow uses native modules for secure entropy, Notifee AlarmManager, and Share Intent. A full native build is required:

```bash
npx react-native run-android
```

### 3 · Start Metro

```bash
npx react-native start
```

> **Note:** Notifee requires `minSdkVersion 21` or higher and `compileSdkVersion 33+` for Android 13 notification permissions. These are already configured in `android/build.gradle`.

---

## 🔔 Notification Setup Notes

TaskFlow's notification system is fully automatic — no manual setup needed. On first launch:

1. **Permission dialog** appears (Android 13+ / API 33+) automatically.
2. **Notification channel** `taskflow_main` is created with `HIGH` importance.
3. **Evening streak reminder** is scheduled for 8:00 PM.

To test the background completion trigger: start a focus session, force-close the app, wait for the session to end — the `Focus Session Complete 🎉` notification will fire via AlarmManager.

---

## 📝 License

MIT License — © 2026 **Smruti Ranjan Nayak**

<p align="center">
  Built with ❤️ for Privacy. <a href="https://sm8uti.com">sm8uti.com</a>
</p>
