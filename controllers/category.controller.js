const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const AddCategory = async (req, res) => {
  try {
    const { name,description,parent_id } = req.body;
    const newCatego = await pool.query(
      `
            INSERT INTO category(name,description,parent_id)
            VALUES ($1, $2,$3) RETURNING *;
            `,
      [name, description, parent_id]
    );
    res.status(200).send({ message: "yangi qosj", category: newCatego.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCategories = async (req, res) => {
  try {
    const catego = await pool.query(`Select * From category`);
    res.status(200).send({ categories: catego.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await pool.query(`Select * From category Where id = $1`, [
      id,
    ]);
    res.status(200).send({ category: category.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCatego = await pool.query(
      `DELETE FROM category WHERE id = $1 RETURNING *;`,
      [id]
    );

    res
      .status(200)
      .send({lang: deletedCatego.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, parent_id } = req.body;

    const updatedCatego = await pool.query(
      `
            UPDATE languages
            SET name = $1, description = $2,parent_id = $3
            WHERE id = $4
            RETURNING *;
            `,
      [name, description, parent_id,id]
    );

    res
      .status(200)
      .send({ category: updatedCatego.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  AddCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
  updateCategory
};
