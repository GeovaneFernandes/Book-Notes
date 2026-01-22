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

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * from books ORDER BY id ASC");
    console.log(result.rows);
    res.render("index.ejs", {});
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
