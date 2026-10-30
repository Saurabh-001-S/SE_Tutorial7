# Campus Library — A First Hands-On GraphQL App

CS543 · Web Services · GraphQL

A small app built end to end: **HTML/CSS front-end → GraphQL API (Node + Apollo) → MySQL**.
The page lists every author with their books in a single GraphQL query, and lets you add and delete books with mutations.

```
Browser (HTML + CSS + fetch)  →  GraphQL API (Node + Apollo, :4000)  →  MySQL (authors, books)
```

The browser never talks to MySQL directly. It sends GraphQL over HTTP POST, and the API's resolvers run the SQL.

## Project structure

```
campus-library/
  schema.sql      MySQL database, tables and sample rows
  db.js           shared MySQL connection pool
  server.js       GraphQL schema + resolvers (Apollo Server)
  package.json
  public/
    index.html    the web page (query + mutations)
    style.css
```

## Prerequisites

- Node.js v18 or newer (`node -v`)
- MySQL Community Server 8.x (`mysql --version`)
- VS Code with the **Live Server** extension

## Setup

### 1. Create the database

```bash
mysql -u root -p < schema.sql
```

This creates the `gqldemo` database with `authors` and `books` tables (one author has many books) and a few sample rows.

**Ubuntu/Debian note:** if you get `ERROR 1698 (28000): Access denied for user 'root'@'localhost'`, log in with `sudo mysql` and set a password:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Mysql@123';
FLUSH PRIVILEGES;
```

If you get `ERROR 1819` (password policy), use a password with at least 8 characters, upper and lower case, a digit and a symbol.

### 2. Set your MySQL password

Open `db.js` and replace `YOUR_MYSQL_PASSWORD` with your MySQL root password.

### 3. Install dependencies

```bash
npm install
```

This installs `@apollo/server`, `graphql` and `mysql2`.

### 4. Start the API

```bash
node server.js
```

You should see `GraphQL API ready at http://localhost:4000/`. Keep this terminal open.

### 5. Open the web page

In VS Code, right-click `public/index.html` and choose **Open with Live Server**. The page opens (usually at `http://127.0.0.1:5500`) and loads the data from the API.

## Try the API

Open `http://localhost:4000/` to use Apollo Sandbox.

**Query — every author with their books, in one request:**

```graphql
query {
  authors {
    name
    country
    books { title year }
  }
}
```

**Query — filter books by year:**

```graphql
query {
  books(year: 2022) {
    title
    year
    author { name }
  }
}
```

**Mutation — add a book:**

```graphql
mutation {
  addBook(title: "GraphQL for Beginners", year: 2025, authorId: 2) {
    id
    title
  }
}
```

**Mutation — delete a book (returns `true` if a book was deleted):**

```graphql
mutation {
  deleteBook(id: 3)
}
```

## The GraphQL schema

| Type | Field | Description |
| --- | --- | --- |
| Query | `authors` | all authors |
| Query | `author(id: ID!)` | one author |
| Query | `books(year: Int)` | all books, optionally filtered by year |
| Mutation | `addBook(title, year, authorId)` | insert a book and return it |
| Mutation | `deleteBook(id: ID!)` | delete a book, returns a Boolean |

Resolvers are written only for the root fields and the relationships (`Author.books`, `Book.author`). Plain fields such as `title` or `name` resolve automatically from the row's columns.

## Troubleshooting

- **The page says "Loading…" forever:** the API isn't running or the port is wrong. Make sure `node server.js` is running on port 4000 and that `API` in `public/index.html` is `http://localhost:4000/`.
- **`Access denied` when the server starts:** the password in `db.js` doesn't match your MySQL root password.
- **`Unknown database 'gqldemo'`:** run `schema.sql` first (step 1).
- **Delete does nothing:** restart `node server.js` so it picks up the `deleteBook` mutation, then refresh the page.

## Ideas for next steps

- Load the author dropdown in the "Add a book" form from the API instead of hard-coding it.
- Add an `addAuthor` mutation.
- Add an `updateBook` mutation.
