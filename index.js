import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "123@mudar",
  database: "Book_Notes",
  port: 5432,
});

let books = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, description, TO_CHAR(read_date, 'YYYY-MM-DD') AS read_date, rate FROM books ORDER BY id ASC",
    );

    books = result.rows;
    res.render("index.ejs", {
      books: books,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/add", async (req, res) => {
  let { title, description, read_date, rate } = req.body;
  rate = parseInt(rate, 10);
  try {
    await db.query(
      "INSERT INTO books(title, description, read_date, rate) VALUES ($1, $2, $3, $4)",
      [title, description, read_date, rate],
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/edit/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    let editedBook = await db.query("SELECT * from books WHERE id = $1", [id]);
    editedBook = editedBook.rows;
    res.render("edit.ejs", {
      book: editedBook,
    });
  } catch (err) {
    console.log(err);
  }
});
//amanha a gente continua
app.post("/update/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE books SET title = $1, description = $2, read_date = $3, rate = $4 WHERE id = $5",
      [
        req.body.title,
        req.body.description,
        req.body.read_date,
        req.body.rate,
        req.params.id,
      ],
    );
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
    console.log(err);
  }
});

app.post("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
