const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");


const AddLanguage = async (req,res)=>{
    try {
        const {name,code} = req.body;
        const newLang = await pool.query(
            `
            INSERT INTO languages(name,code)
            VALUES ($1, $2) RETURNING *;
            `,
            [name,code]
        )
        console.log(newLang.rows[0]);
        console.log(newLang);
        
        res.status(200).send({ message: "yangi qosj", lang: newLang.rows[0] });
        
        
    } catch (error) {
    errorHandler(error,res)    
}
}

const getLanguage = async(req,res)=>{
    try {
        const langs = await pool.query(
            `Select * From languages`
        )
        res.status(200).send({langs:langs.rows})
    } catch (error) {
        errorHandler(error,res)
    }
}

const getLangById = async (req,res) => {
    try {
        const id = req.params.id;
        const lang = await pool.query(
            `Select * From languages Where id = $1`,
            [id]
        )
        res.status(200).send({lang:lang.rows})
    } catch (error) {
        errorHandler(error,res)
    }
}


const deleteLanguage = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLang = await pool.query(
      `DELETE FROM languages WHERE id = $1 RETURNING *;`,
      [id]
    );

    res
      .status(200)
      .send({  lang: deletedLang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateLanguage = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, code } = req.body;

    const updatedLang = await pool.query(
      `
            UPDATE languages
            SET name = $1, code = $2
            WHERE id = $3
            RETURNING *;
            `,
      [name, code, id]
    );

    res
      .status(200)
      .send({ lang: updatedLang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  AddLanguage,
  getLanguage,
  getLangById,
  deleteLanguage,
  updateLanguage,
};