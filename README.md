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
