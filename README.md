
# The Chat Room

A Real-Time Chat Application made to recreate the chat room experience using Firebase instead of Web Sockets.

With this project, users can create public and private chat rooms, both. 

I urge each and every one of you to read the entire README carefully (especially the "Word of Caution" Section), before you proceed with exploring the code.


## Tech Stack

ReactJS, Firebase (Auth and Firestore), Particles.js, Nanoid, Tailwind CSS 
## Dependencies

The project relies on the following npm packages:

- **autoprefixer** (`^10.4.19`): A PostCSS plugin to parse CSS and add vendor prefixes to CSS rules.
- **axios** (`^1.7.2`): A promise-based HTTP client for making requests to APIs.
- **firebase** (`^10.12.2`): Firebase SDK for integrating Firebase services like authentication, Firestore, and more.
- **nanoid** (`^5.0.7`): A small, secure, URL-friendly, unique string ID generator.
- **postcss-cli** (`^11.0.0`): A command-line interface for PostCSS to transform styles with JavaScript plugins.
- **react** (`^18.2.0`): A JavaScript library for building user interfaces.
- **react-dom** (`^18.2.0`): React package for working with the DOM.
- **react-firebase-hooks** (`^5.1.1`): React hooks for Firebase, making it easier to integrate Firebase services.
- **react-loader-spinner** (`^6.1.6`): A collection of loaders/spinners for displaying loading states in your React application.
- **react-particles** (`^2.12.2`): A React component for creating particle animations.
- **react-router-dom** (`^6.23.1`): A collection of navigational components for routing in React applications.
- **tailwindcss** (`^3.4.4`): A utility-first CSS framework for rapid UI development.
- **tsparticles-slim** (`^2.12.0`): A lightweight version of tsparticles for creating particle animations.
- **tw-elements** (`^2.0.0`): A plugin for Tailwind CSS that provides pre-designed UI components.

To install all dependencies, run the following command in the `client` directory:

```bash
npm install
```
## Setup

Follow these steps to set up the project:

### 1) Clone the Repository

First, clone the repository to your local machine. Fork the repository if you can.

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2) Install Dependencies

Open the project in your code editor, navigate to the client directory, and install the required npm packages.

```bash
cd client
npm install
```

### 3) Set Up Firebase Project

Set up a Firebase project for authentication and Firestore as per your convenience. 

#### Instructions:
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Click on "Add Project" and follow the prompts to create a new project.
- Once the project is created, go to the "Authentication" section and enable the sign-in methods you want to use.
- Go to the "Firestore Database" section and create a database.
- While creating the database, ensure that you allow CRUD Operations' access to the database. Refer to the link in the references to get more clarity about this.

### 4) Configure Firebase

In the `src` folder in the `client` directory, create a file called `firebase.js`. Paste your Firebase web app configuration in this file.

```javascript
// src/firebase.js

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };
```

### 5) Create Collections

Create the collections as per the "Database" section of the README and initialize them with a few dummy documents.

**Note:** You will have to create indexing for the Messages Collection when prompted to by Firestore.

#### Collections:

1. **Rooms Collection**
    ```json
    {
      "admin": "admin@example.com",
      "description": "General chat room",
      "members": ["user1@example.com", "user2@example.com"],
      "pub_or_pri": "public",
      "room_id": "room1",
      "room_name": "General"
    }
    ```

2. **Users Collection**
    ```json
    {
      "email": "user1@example.com",
      "private_rooms": ["room1", "room2"]
    }
    ```

3. **Messages Collection**
    ```json
    {
      "avatar": "https://example.com/avatar.png",
      "createdAt": firebase.firestore.FieldValue.serverTimestamp(),
      "name": "User One",
      "room_id": "room1",
      "text": "Hello, world!",
      "uid": "user1"
    }
    ```

### 6) Run the Project

Once all the steps are completed, run the development server to check everything is set up correctly.

```bash
npm run dev
```

You should now be able to see the project running in your browser.

## Database

This project involves managing three main collections:

### 1) Rooms

This collection handles the information related to chat rooms.

**Schema:**
- `admin` (type: String): The administrator of the chat room.
- `description` (type: String): A brief description of the chat room.
- `members` (type: Array of String): List of members in the chat room.
- `pub_or_pri` (type: String): Indicates if the room is public or private.
- `room_id` (type: String): Unique identifier for the chat room.
- `room_name` (type: String): Name of the chat room.

### 2) Users

This collection stores information about users.

**Schema:**
- `email` (type: String): The email address of the user.
- `private_rooms` (type: Array of String): List of private rooms the user is a member of.

### 3) Messages

This collection stores messages for each chat room.

**Schema:**
- `avatar` (type: String): URL to the avatar of the message sender.
- `createdAt` (type: TimeStamp): Timestamp indicating when the message was created.
- `name` (type: String): Name of the message sender.
- `room_id` (type: String): Unique identifier of the chat room where the message was sent.
- `text` (type: String): The content of the message.
- `uid` (type: String): Unique identifier of the message sender.

This schema design helps manage chat rooms, user information, and messages efficiently.
## Images

Check the Word Document in the Repo to see the screenshots of the Project
## Word of Caution

This project was created as a means to experiment with Firebase and to check it's feasibility as an alternative to Web Socket based RealTime Communication.

**The fact that this is a Chat Application**, means that **we will frequently query the database for updates**, **as a result** of which, **one may eventually end up exhausting their Daily Read Limits of Firestore** (Happened to me while testing, so I know what I am talking about). 

**However, chances of this happening under normal circumstances is not high**.

All I will say is that given these factors alone, I have not deployed the application. 

So, I urge all those who explore this project to be careful. 
## References Used

 - [How to Build a Real-time Chat App with ReactJS and Firebase](https://www.freecodecamp.org/news/building-a-real-time-chat-app-with-reactjs-and-firebase/)

