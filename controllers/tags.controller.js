const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const addTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newTag = await pool.query(
      `
            INSERT INTO tags(name,description)
            VALUES ($1, $2) RETURNING *;
            `,
      [name, description]
    );

    res.status(200).send({ message: "yangi qosj", newTag: newTag.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTag = async (req, res) => {
  try {
    const tags = await pool.query(`Select * From tags`);
    res.status(200).send({ tags: tags.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTagById = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await pool.query(`Select * From tags Where id = $1`, [
      id,
    ]);
    res.status(200).send({ tag: tag.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTag = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTag = await pool.query(
      `DELETE FROM tags WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ tag: deletedTag.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTag = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    const updatedTag = await pool.query(
      `
            UPDATE languages
            SET name = $1, description = $2
            WHERE id = $3
            RETURNING *;
            `,
      [name, description, id]
    );

    res.status(200).send({ tag: updatedTag.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addTag,
  getTag,
  getTagById,
  deleteTag,
  updateTag
};
