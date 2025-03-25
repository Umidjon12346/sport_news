const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const addLike = async (req, res) => {
  try {
    const { news_id, user_id, liked_at } = req.body;
    const newLike = await pool.query(
      `
            INSERT INTO likes(news_id,user_id,liked_at)
            VALUES ($1, $2,$3) RETURNING *;
            `,
      [news_id, user_id, liked_at]
    );

    res.status(200).send({ message: "yangi qosj", like: newLike.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getLike = async (req, res) => {
  try {
    const likes = await pool.query(`Select * From likes`);
    res.status(200).send({ like: likes.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getLikeById = async (req, res) => {
  try {
    const id = req.params.id;
    const like = await pool.query(`Select * From likes Where id = $1`, [id]);
    res.status(200).send({ like: like.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteLike = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLike = await pool.query(
      `DELETE FROM likes WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ like: deletedLike.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateLike = async (req, res) => {
  try {
    const id = req.params.id;
    const { news_id, user_id, liked_at } = req.body;

    const updatedLike = await pool.query(
      `
            UPDATE likes
            SET news_id = $1, user_id = $2, liked_at = $3
            WHERE id = $4
            RETURNING *;
            `,
      [news_id, user_id, liked_at, id]
    );

    if (updatedLike.rowCount === 0) {
      return res.status(404).send({ message: "Like not found" });
    }

    res.status(200).send({
      message: "Like updated successfully",
      like: updatedLike.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addLike,
  getLike,
  getLikeById,
  deleteLike,
  updateLike,
};
