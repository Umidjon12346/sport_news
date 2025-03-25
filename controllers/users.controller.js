const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");

const AddUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      created_at,
      interests,
      bookmarks,
    } = req.body;

    const newUser = await pool.query(
      `
            INSERT INTO users (first_name, last_name, email, password, role, is_active, created_at, interests, bookmarks)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
            `,
      [
        first_name,
        last_name,
        email,
        password,
        role,
        is_active,
        created_at,
        interests,
        bookmarks,
      ]
    );

    res
      .status(201)
      .send({ message: "User added successfully", user: newUser.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await pool.query(`Select * From users`);
    res.status(200).send({ users: users.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await pool.query(`Select * From users Where id = $1`, [id]);
    res.status(200).send({ user: user.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *;`,
      [id]
    );

    res.status(200).send({ users: deletedUser.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      created_at,
      interests,
      bookmarks,
    } = req.body;

    const updatedUser = await pool.query(
      `
            UPDATE users
            SET first_name = $1, last_name = $2, email = $3, password = $4, 
                role = $5, is_active = $6, created_at = $7, interests = $8, bookmarks = $9
            WHERE id = $10
            RETURNING *;
            `,
      [
        first_name,
        last_name,
        email,
        password,
        role,
        is_active,
        created_at,
        interests,
        bookmarks,
        id,
      ]
    );

    if (updatedUser.rowCount === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    res
      .status(200)
      .send({
        message: "User updated successfully",
        user: updatedUser.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  AddUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser
};
