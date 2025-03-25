const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const addReport = async (req, res) => {
  try {
    const { user_id, news_id, reason, status, created_at } = req.body;

    const newReport = await pool.query(
      `
            INSERT INTO reports (user_id, news_id, reason, status, created_at)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `,
      [user_id, news_id, reason, status, created_at]
    );

    res.status(201).send({
      message: "Report added successfully",
      report: newReport.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await pool.query(`Select * From reports`);
    res.status(200).send({ reports: reports.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getReportById = async (req, res) => {
  try {
    const id = req.params.id;
    const report = await pool.query(`Select * From reports Where id = $1`, [
      id,
    ]);
    res.status(200).send({ report: report.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteReport = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedReport = await pool.query(
      `DELETE FROM reports WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ report: deletedReport.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateReport = async (req, res) => {
  try {
    const id = req.params.id;
    const { user_id, news_id, reason, status, created_at } = req.body;

    const updatedReport = await pool.query(
      `
            UPDATE reports
            SET user_id = $1, news_id = $2, reason = $3, status = $4, created_at = $5
            WHERE id = $6
            RETURNING *;
            `,
      [user_id, news_id, reason, status, created_at, id]
    );

    if (updatedReport.rowCount === 0) {
      return res.status(404).send({ message: "Report not found" });
    }

    res.status(200).send({
      report: updatedReport.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addReport,
  getReports,
  getReportById,
  deleteReport,
  updateReport,
};