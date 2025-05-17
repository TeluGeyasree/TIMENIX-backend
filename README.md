# TIMENIX-backend
# SMART AGE-BASED PHONE USAGE RESTRICTION(Node.js+SQLite)

A backend system for controlling screen time usage based on a users age group. Designed for use in parental control scenarios

FEATURES
. User login system with roles: parent or child
. Age-based access logic(block, limit to 3h, limit to 7h)
. Automatic daily reser of usage time
. Logs and restricts usage based on role and time limit
. SQLite databse with sample users, devices, and usage logs

FILE STRUCTURE
. server.js   - Main server file, sets up routes and logic
. database.js - initializes and seeds theSQLite database
. agecheck.js - Age-to-limit logic and time restriction handling

HOW TO RUN
. Install dependencies
  ```bash
  npm install
  ```
. Start the server
  ```bash
  node server.js
  ```
. check if running
  Go to http://localhost:9999 - you should see a message confirming it's working.
  if you changed the port in `server.js`, use the updated one here (e.g., http://localhost:3000)

API ENDPOINTS
. POST /login     - Authenticate user with `username` and `password`
. POST /add-user  - Add a new user with `username`, `password`, `role,` and `age_group`
. POST /age-check - Get access level based on detected age
. POST /log-usage - Update screen time usage for a user

