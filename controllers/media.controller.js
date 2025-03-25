const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const addMedia = async (req, res) => {
  try {
    const { news_id, media_type, media_url, uploaded_at } = req.body;
    const newMedia = await pool.query(
      `
            INSERT INTO media(news_id,media_type,media_url,uploaded_at)
            VALUES ($1, $2,$3,$4) RETURNING *;
            `,
      [news_id, media_type, media_url, uploaded_at]
    );
    console.log(newLang.rows[0]);
    console.log(newLang);

    res.status(200).send({ message: "yangi qoshildi", media: newMedia.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getMedia = async (req, res) => {
  try {
    const medias = await pool.query(`Select * From media`);
    res.status(200).send({ media: medias.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getMediaById = async (req, res) => {
  try {
    const id = req.params.id;
    const media = await pool.query(`Select * From media Where id = $1`, [id]);
    res.status(200).send({ media: media.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteMedia = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMedia = await pool.query(
      `DELETE FROM media WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ media: deletedMedia.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateMedia = async (req, res) => {
  try {
    const id = req.params.id;
    const { news_id, media_type, media_url, uploaded_at } = req.body;

    const updatedMedia = await pool.query(
      `
            UPDATE media
            SET news_id = $1, media_type = $2, media_url = $3, uploaded_at = $4
            WHERE id = $5
            RETURNING *;
            `,
      [news_id, media_type, media_url, uploaded_at, id]
    );

    if (updatedMedia.rowCount === 0) {
      return res.status(404).send({ message: "Media not found" });
    }

    res.status(200).send({
      media: updatedMedia.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addMedia,
  getMedia,
  getMediaById,
  deleteMedia,
  updateMedia,
};
