Task Management App - Client (React with Firebase)
This is the client-side application for a Task Management system, built using React and Firebase. It provides user authentication and comprehensive task management functionalities, including creating, reading, updating, and deleting tasks, along with filtering and sorting options.

Features
User Authentication:

User registration with email and password.

User login and logout.

Handles anonymous sign-in for initial setup in the Canvas environment.

Task Management (CRUD):

Create: Add new tasks with a title.

Read: View all tasks, filtered by status (all, active, completed).

Update: Mark tasks as complete/incomplete and edit task titles.

Delete: Remove tasks permanently.

Filtering & Sorting:

Filter tasks by "All", "Active", or "Completed" status.

Sort tasks by "Newest", "Oldest", or "Alphabetical" order.

Responsive Design: Styled with Tailwind CSS for optimal viewing on various devices (mobile, tablet, desktop).

Real-time Updates: Utilizes Firebase Firestore's real-time listeners for instant updates to task lists.

User-Specific Data: Tasks are associated with the logged-in user, ensuring data privacy and separation.

Informative Modals: Custom modal components for user feedback (success messages, error alerts).

Technologies Used
Frontend: React.js

Styling: Tailwind CSS

Authentication & Database: Google Firebase (Authentication, Firestore)

Project Structure (Client-Side)
client/
├── public/
│   └── index.html              # Main HTML file for React app
├── src/
│   ├── components/
│   │   └── Modal.js            # Reusable modal component for alerts
│   ├── context/
│   │   ├── AuthContext.js      # React Context for Firebase Authentication logic
│   │   └── FirestoreContext.js # React Context for Firebase Firestore (Task CRUD) logic
│   ├── App.js                  # Main application component, orchestrates AuthScreen and TaskManager
│   └── index.js                # React entry point, wraps App with Context Providers
├── package.json                # Project dependencies and scripts
└── README.md                   # This file

Setup and Installation
To run this client-side application, you'll need a Firebase project set up.

Firebase Project:

Go to the Firebase Console.

Create a new Firebase project.

Add a web app to your project and copy your Firebase configuration object.

Enable Firebase Authentication: In your Firebase project, go to "Authentication" -> "Sign-in method" and enable "Email/Password".

Enable Cloud Firestore: In your Firebase project, go to "Firestore Database" and start a new database (choose "Start in production mode" for security, and set up rules as described below).

Firestore Security Rules:
Ensure your Firestore security rules allow authenticated users to read and write to their own data. Navigate to "Firestore Database" -> "Rules" in your Firebase console and update them as follows:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users to their specific task data
    match /artifacts/{appId}/users/{userId}/{documents=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

Local Setup (if not running in Canvas):
If you are running this outside of a Canvas environment, you would typically:

Create a React project (e.g., npx create-react-app task-manager-client).

Navigate into the task-manager-client directory.

Install Firebase and Tailwind CSS:

npm install firebase tailwindcss postcss autoprefixer
npx tailwindcss init -p

Configure tailwind.config.js and index.css (or equivalent) for Tailwind.

Create a .env file in the root of your client project and add your Firebase config variables (e.g., REACT_APP_FIREBASE_API_KEY=your_key).

Replace the firebaseConfig and __app_id variables in AuthContext.js and FirestoreContext.js with your actual Firebase config and a suitable app ID.

Code Placement:

Place Modal.js in src/components/.

Place AuthContext.js and FirestoreContext.js in src/context/.

Place the content of App.js into your main src/App.js file.

Place the content of index.js into your main src/index.js file.

Run the Application:
In your client project directory, run:

npm start

This will typically open the application in your browser at http://localhost:3000.

Usage
Register/Login: Upon opening the application, you'll be presented with a login/registration screen. Create a new account or log in with existing credentials.

Add Tasks: Use the input field and "Add Task" button to add new tasks.

Manage Tasks:

Click "Complete" to mark a task as done (it will be struck through).

Click "Undo" to revert a completed task to active.

Click "Edit" to modify a task's title. Click "Save" to confirm or "Cancel" to discard changes.

Click "Delete" to remove a task.

Filter Tasks: Use the "All", "Active", and "Completed" buttons to filter the displayed tasks.

Sort Tasks: Use the dropdown to sort tasks by "Newest", "Oldest", or "Alphabetical" order.

Logout: Click the "Logout" button to sign out of your account.

Note: This client-side application is designed to work with Firebase. If you plan to use a separate Node.js/Express/MongoDB backend, you would need to modify the AuthContext.js and FirestoreContext.js files to make HTTP requests to your backend API endpoints instead of directly using Firebase SDKs for authentication and database operations.
