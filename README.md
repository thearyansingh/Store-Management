# Store Rating & Management Platform 📊

A full-stack web application for managing stores, users, and ratings. The system allows admins to manage users and stores, normal users to explore and rate stores, and store owners to track their store ratings.

## Features 🔗

### System Administrator 🛠️

* Add new stores, normal users, and admin users.
* Dashboard displays:

  * Total number of users
  * Total number of stores
  * Total number of submitted ratings
* Add new users with details: Name, Email, Password, Address.
* View list of stores: Name, Email, Address, Rating.
* View list of users (normal/admin): Name, Email, Address, Role.
* Apply filters on listings based on Name, Email, Address, Role.
* View user details, including ratings for store owners.
* Logout functionality.

### Normal User 👤

* Sign up and log in.
* Signup form includes: Name, Email, Address, Password.
* Update password after logging in.
* View a list of all registered stores.
* Search for stores by Name and Address.
* Store listing shows:

  * Store Name
  * Address
  * Overall Rating
  * User's Submitted Rating
  * Submit or modify rating (1 to 5)
* Logout functionality.

### Store Owner 👨‍💼

* Log in to the platform.
* Update password after logging in.
* Dashboard functionalities:

  * View users who submitted ratings for their store.
  * See average store rating.
* Logout functionality.

  # Store Ratings and Management System

## Installation & Setup 🛠️

### Prerequisites:

* Node.js & npm
* PostgreSQL or MySQL database

### Steps:

1. **Clone the repository**:

   ```bash
   git clone <repo_url>
   cd project-directory
   ```
2. **Install backend dependencies**:

   ```bash
   cd backend
   npm install
   ```
3. **Setup environment variables** (create `.env`):

   ```env
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_secret_key
   ```
4. **Run database migrations**:

   ```bash
   npx sequelize-cli db:migrate
   ```
5. **Start the backend server**:

   ```bash
   npm run dev
   ```
6. **Install frontend dependencies**:

   ```bash
   cd ../frontend
   npm install
   ```
7. **Run the frontend**:

   ```bash
   npm start
   ```

Your application will be running locally! 🌟

---

**Enjoy using the Store Rating & Management Platform!** 🎉
