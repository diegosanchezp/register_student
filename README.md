# Register Student

A web application that registers a university student and displays it in a /students route-page, along with the other students registered
This page was built to practice full-stack development with nodejs using packages like 
* Expressjs
* Swig templating engine 
* SQLite3
And many more, see package.json to see the list of packages used 

# Page explanation

## Servers

The page has two servers
1. **A static server** that serves the files contained into the client folder to the client.
2. **A rest API server** that serves the data needed to search and display students, it also registers a student into the database.
### Run the servers

Run the servers via the folowing commands

For the rest API server

`npm run dev`

For the static file server

`npm run static`

## Database

I used sqlite3 since i only needed to store 1 table in the database, so this implies 1 .db file, i did not needed anything complex

I named the table students and it looks like this

id | name | last_name | e_mail | age | gender | school | uni | prf_pic
---|------|-----------|--------|-----|--------|--------|-----|--------
1  | John | Doe       | doejohn@mail.com | 28 | M | School | MIT | prf_pic.jpeg      

### Initialize the database

You can initialize the database by running the following command

`node init-db.js`

Note: if you have already initialized the database and run the previous command, the table students will be deleted.

## Template Engine
I used swig since i was practicing flask to do this same page. 

# Inspiration
I watched this videos and got inspired to do full-stack development

[Youtube - Build a Full Stack Twitter Clone with Coding Garden](https://www.youtube.com/watch?v=JnEH9tYLxLk&t=1903s)

[Youtube - Express.js Tutorial: Build RESTful APIs with Node and Express | Mosh](https://www.youtube.com/watch?v=pKd0Rpw7O48&t=1523s)
