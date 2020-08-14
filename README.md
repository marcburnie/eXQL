# SQL-DB-Visualizer-and-Editor
Visualizer for SQL databases able to read and write data from a databse using a website front end: https://pg-sql-visualizer.herokuapp.com/.

Current Version Notes:
- Click on the table name to pull the full table
- Bad links will kick you back to login without prompt. Successful links will display the data.
- User data is not saved. Sessions are persisted from JWT's on sign-up. If you'd like to change the database, return to the login screen and "sign-up" with a new database link to receive a new session JWT.
- There is a bug where queries do not go through to the databse. Just keep trying until it works. Create and update commands are performed after a cell is unselected.
- The insert row above/below doesn't work yet and has been disabled but the text it still displayed in the context menu.

Basic Features:
- [x] Visualize all tables and column names
- [x] Visualize all rows from a table when table name is clicked
- [x] Create, Read, Update, Destroy for individual rows
- [x] Drag cell values down to quickly copy and write to adjacent cells from same column
- [ ] Highlight primary key column
- [ ] Able to create new column
- [ ] Able to create new table
- [ ] Able to filter rows based on user input
- [ ] Able to sort rows based on user input

Advanced Features:
- [ ] Highlight and identify foreign keys/tables
- [ ] Able to manually create relationships between tables using keys
- [ ] Able to automatically create relationships between tables using keys
- [ ] Able to join tables
- [ ] Data visualization
- [ ] Data type matching

Authentication and Sessions:
- [x] Save and persist database link in session as JWT
- [ ] Save user data in database to retrieve on login
- [ ] Store and switch between user databases from main page
- [ ] OAuth login

Quality of Life Features:
- [ ] Feedback if data was not written to database
- [ ] Feedback if database not successfully loaded

Stretch Features:
- [ ] Able to insert data in the middle at user-designated row
- [ ] Able to re-order columns by drag-drop
- [ ] Able to re-size columns
- [ ] Able to print table data