const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const AddNews = async (req, res) => {
  try {
    const {
      newslang_id,
      category_id,
      author_id,
      status,
      published_at,
      source,
      lang_id,
    } = req.body;
    const newNews = await pool.query(
      `
            INSERT INTO news (newslang_id, category_id, author_id, status, published_at, source, lang_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
            `,
      [
        newslang_id,
        category_id,
        author_id,
        status,
        published_at,
        source,
        lang_id,
      ]
    );
    res.status(200).send({ message: "yangi qosj", news: newNews.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNews = async (req, res) => {
  try {
    const news = await pool.query(`Select * From news`);
    res.status(200).send({ news: news.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNewsById = async (req, res) => {
  try {
    const id = req.params.id;
    const news = await pool.query(`Select * From news Where id = $1`, [id]);
    res.status(200).send({ news: news.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteNews = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedNews = await pool.query(
      `DELETE FROM news WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ news: deletedNews.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateNews = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      newslang_id,
      category_id,
      author_id,
      status,
      published_at,
      source,
      lang_id,
    } = req.body;

    const updatedNews = await pool.query(
      `
            UPDATE news
            SET newslang_id = $1, category_id = $2, author_id = $3, status = $4, 
                published_at = $5, source = $6, lang_id = $7
            WHERE id = $8
            RETURNING *;
            `,
      [
        newslang_id,
        category_id,
        author_id,
        status,
        published_at,
        source,
        lang_id,
        id,
      ]
    );

    res.status(200).send({ news: updatedNews.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  AddNews,
  getNews,
  getNewsById,
  deleteNews,
  updateNews,
};
