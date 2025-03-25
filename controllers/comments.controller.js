const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const addComment = async (req, res) => {
  try {
    const {
      news_id,
      user_id,
      content,
      created_at,
      reply_comment_id,
      is_approved,
      is_deleted,
      views,
      likes,
    } = req.body;

    const newComment = await pool.query(
      `
            INSERT INTO comments (news_id, user_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
            `,
      [
        news_id,
        user_id,
        content,
        created_at,
        reply_comment_id,
        is_approved,
        is_deleted,
        views,
        likes,
      ]
    );

    res.status(201).send({
      message: "Comment added successfully",
      comment: newComment.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getComment = async (req, res) => {
  try {
    const comments = await pool.query(`Select * From comments`);
    res.status(200).send({ comments: comments.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCommentById = async (req, res) => {
  try {
    const id = req.params.id;
    const comment = await pool.query(`Select * From comments Where id = $1`, [
      id,
    ]);
    res.status(200).send({ comment: comment.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedComment = await pool.query(
      `DELETE FROM comments WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ comment: deletedComment.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateComment = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      news_id,
      user_id,
      content,
      created_at,
      reply_comment_id,
      is_approved,
      is_deleted,
      views,
      likes,
    } = req.body;

    const updatedComment = await pool.query(
      `
            UPDATE comments
            SET news_id = $1, user_id = $2, content = $3, created_at = $4, 
                reply_comment_id = $5, is_approved = $6, is_deleted = $7, views = $8, likes = $9
            WHERE id = $10
            RETURNING *;
            `,
      [
        news_id,
        user_id,
        content,
        created_at,
        reply_comment_id,
        is_approved,
        is_deleted,
        views,
        likes,
        id,
      ]
    );

    if (updatedComment.rowCount === 0) {
      return res.status(404).send({ message: "Comment not found" });
    }

    res.status(200).send({
      comment: updatedComment.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addComment,
  getComment,
  getCommentById,
  deleteComment,
  updateComment,
};
