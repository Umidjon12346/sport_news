const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const AddNewsLang = async (req, res) => {
  try {
    const { title, content, summary_news, lang_id } = req.body;

    const newNewsLang = await pool.query(
      `
            INSERT INTO news_with_langs (title, content, summary_news, lang_id)
            VALUES ($1, $2, $3, $4) RETURNING *;
            `,
      [title, content, summary_news, lang_id]
    );

    res.status(201).send({
      newslang: newNewsLang.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getNewsLang = async (req, res) => {
  try {
    const newsLang = await pool.query(`Select * From news_with_langs`);
    res.status(200).send({ newsLang: newsLang.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNewsLangById = async (req, res) => {
  try {
    const id = req.params.id;
    const newsLang = await pool.query(
      `Select * From news_with_langs Where id = $1`,
      [id]
    );
    res.status(200).send({ newsLang: newsLang.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteNewsLang = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedNewsLang = await pool.query(
      `DELETE FROM news_with_langs WHERE id = $1 RETURNING *;`,
      [id]
    );
    res.status(200).send({
      newslang: deletedNewsLang.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateNewsLang = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, summary_news, lang_id } = req.body;

    const updatedNewsLang = await pool.query(
      `
            UPDATE news_with_langs
            SET title = $1, content = $2, summary_news = $3, lang_id = $4
            WHERE id = $5
            RETURNING *;
            `,
      [title, content, summary_news, lang_id, id]
    );
    res.status(200).send({
      newslang: updatedNewsLang.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  AddNewsLang,
  getNewsLang,
  getNewsLangById,
  deleteNewsLang,
  updateNewsLang,
};
