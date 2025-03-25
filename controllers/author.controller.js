const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const addAuthor = async (req, res) => {
  try {
    const { user_id, is_approved, is_editor } = req.body;

    const newAuthor = await pool.query(
      `
            INSERT INTO authors (user_id, is_approved, is_editor])
            VALUES ($1, $2, $3) RETURNING *;
            `,
      [user_id, is_approved, is_editor]
    );

    res.status(201).send({
      author: newAuthor.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthor = async (req, res) => {
  try {
    const authors = await pool.query(`Select * From authors`);
    res.status(200).send({ authors: authors.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await pool.query(`Select * From authors Where id = $1`, [
      id,
    ]);
    res.status(200).send({ author: author.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedAuthor = await pool.query(
      `DELETE FROM authors WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ author: deletedAuthor.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const { user_id, is_approved, is_editor } = req.body;

    const updatedAuthor = await pool.query(
      `
            UPDATE authors
            SET user_id = $1, is_approved = $2, is_editor = $3
            WHERE id = $4
            RETURNING *;
            `,
      [user_id, is_approved, is_editor, id]
    );

    if (updatedAuthor.rowCount === 0) {
      return res.status(404).send({ message: "Author not found" });
    }

    res.status(200).send({
      message: "Author updated successfully",
      author: updatedAuthor.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addAuthor,
  getAuthor,
  getAuthorById,
  deleteAuthor,
  updateAuthor,
};