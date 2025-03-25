const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const addNotifaction = async (req, res) => {
  try {
    const { news_id, user_id, msg_type, is_checked, created_at } = req.body;

    const newNotification = await pool.query(
      `
            INSERT INTO notifications (news_id, user_id, msg_type, is_checked, created_at)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `,
      [news_id, user_id, msg_type, is_checked, created_at]
    );

    res.status(201).send({
      message: "Notification added successfully",
      notification: newNotification.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNotifaction = async (req, res) => {
  try {
    const notifications = await pool.query(`Select * From notifactions`);
    res.status(200).send({ notifications: notifications.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNotifactionById = async (req, res) => {
  try {
    const id = req.params.id;
    const notifaction = await pool.query(
      `Select * From notifactions Where id = $1`,
      [id]
    );
    res.status(200).send({ notifaction: notifaction.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteNotifaction = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedNotifaction = await pool.query(
      `DELETE FROM notifactions WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ notifaction: deletedNotifaction.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateNotifaction = async (req, res) => {
  try {
    const id = req.params.id;
    const { news_id, user_id, msg_type, is_checked, created_at } = req.body;

    const updatedNotification = await pool.query(
      `
            UPDATE notifications
            SET news_id = $1, user_id = $2, msg_type = $3, is_checked = $4, created_at = $5
            WHERE id = $6
            RETURNING *;
            `,
      [news_id, user_id, msg_type, is_checked, created_at, id]
    );

    if (updatedNotification.rowCount === 0) {
      return res.status(404).send({ message: "Notification not found" });
    }

    res.status(200).send({
      message: "Notification updated successfully",
      notification: updatedNotification.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNotifaction,
  getNotifaction,
  getNotifactionById,
  updateNotifaction,
  deleteNotifaction,
};