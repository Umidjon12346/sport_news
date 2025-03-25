const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const addNewsTag = async (req, res) => {
  try {
    const { news_id, tag_id } = req.body;
    const newNewsTag = await pool.query(
      `
            INSERT INTO news_tags(news_id,tag_id)
            VALUES ($1, $2) RETURNING *;
            `,
      [news_id, tag_id]
    );

    res.status(200).send({ message: "yangi qosj", newsTag: newNewsTag.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNewsTags = async (req, res) => {
  try {
    const newsTag = await pool.query(`Select * From news_tags`);
    res.status(200).send({ newsTag: newsTag.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNewsTagById = async (req, res) => {
  try {
    const id = req.params.id;
    const newsTag = await pool.query(`Select * From news_tags Where id = $1`, [id]);
    res.status(200).send({ newsTag: newsTag.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteNewsTag = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedNewsTag = await pool.query(
      `DELETE FROM news_tags WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ newsTag: deletedNewsTag.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateNewsTag = async (req, res) => {
  try {
    const id = req.params.id;
    const { news_id, tag_id } = req.body;

    const updatedNewsTag = await pool.query(
      `
            UPDATE likes
            SET news_id = $1, tag_id = $2
            WHERE id = $3
            RETURNING *;
            `,
      [news_id, tag_id, id]
    );

    if (updatedNewsTag.rowCount === 0) {
      return res.status(404).send({ message: "newsTag not found" });
    }

    res.status(200).send({
      newsTag: updatedNewsTag.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewsTag,
  getNewsTags,
  getNewsTagById,
  updateNewsTag,
  deleteNewsTag
};
