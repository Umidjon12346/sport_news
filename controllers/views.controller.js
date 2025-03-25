const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const addView = async (req, res) => {
  try {
    const { news_id, user_id, viewed_at } = req.body;
    const newView = await pool.query(
      `
            INSERT INTO views(news_id,user_id,viewed_at)
            VALUES ($1, $2,$3) RETURNING *;
            `,
      [news_id, user_id, viewed_at]
    );
    
    res.status(200).send({ message: "yangi qosj", view: newView.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getView = async (req, res) => {
  try {
    const views = await pool.query(`Select * From views`);
    res.status(200).send({ view: views.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getViewById = async (req, res) => {
  try {
    const id = req.params.id;
    const view = await pool.query(`Select * From views Where id = $1`, [id]);
    res.status(200).send({ view: view.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteView = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedView = await pool.query(
      `DELETE FROM views WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ view: deletedView.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateView = async (req, res) => {
  try {
    const id = req.params.id;
    const { news_id, user_id, viewed_at } = req.body;

    const updatedView = await pool.query(
      `
            UPDATE views
            SET news_id = $1, user_id = $2, viewed_at = $3
            WHERE id = $4
            RETURNING *;
            `,
      [news_id, user_id, viewed_at, id]
    );

    if (updatedView.rowCount === 0) {
      return res.status(404).send({ message: "View not found" });
    }

    res.status(200).send({
      message: "View updated successfully",
      view: updatedView.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addView,
  getView,
  getViewById,
  deleteView,
  updateView,
};
