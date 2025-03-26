const pool = require("../config/db");
const { errorHandler } = require("../helpers/error.handler");
const jwtService = require("../services/jwt.service");
const config = require("config");
const uuid = require('uuid');
const mailService = require("../services/mail.service");
const { createOtp } = require("./otp.controller");

const AddUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      role,
      is_active,
      created_at,
      interests,
      bookmarks,
    } = req.body;
    const activation_link = uuid.v4(); 

    const newUser = await pool.query(
      `INSERT INTO users(first_name, last_name, email, phone_number, password, role, is_active, created_at, interests, bookmarks,activation_link)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) RETURNING *`,
      [
        first_name,
        last_name,
        email,
        phone_number,
        password,
        role,
        is_active,
        created_at,
        interests,
        bookmarks,
        activation_link,
      ]
    );

    if (newUser.rowCount === 0) {
      return res
        .status(404)
        .send({ message: "Qiymatlar shartni qanoatlantirmaydi " });
    }


    createOtp
    await mailService.sendActivationMail(
      newUser.rows[0].email, // ✅ Foydalanuvchining emailini olish
      `${config.get("api_url")}/api/users/activate/${activation_link}`
    );

    res.status(201).send({
      message:
        "Yangi foydalanuvchi qo'shildi. Akkauntni faollashtirish uchun pochtaga o'ting",
      newUser: newUser.rows[0],
    });
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
      phone_number,
    } = req.body;

    const updatedUser = await pool.query(
      `
            UPDATE users
            SET first_name = $1, last_name = $2, email = $3, password = $4, 
                role = $5, is_active = $6, created_at = $7, interests = $8, bookmarks = $9, phone_number=$10
            WHERE id = $11
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
        phone_number,
        id,
      ]
    );

    if (updatedUser.rowCount === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "User updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = await pool.query(`Select * from users where email = $1 `, [
      email,
    ]);
    const user = userQuery.rows[0];
    if (!user) {
      return res.status(400).send({ message: "userga qara yoqku" });
    }
    if (!password) {
      return res.status(400).send({ message: "passwordga qara yoqku" });
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    };
    const tokens = jwtService.genereteTokens(payload);
    console.log(tokens.refreshToken);
    
    await pool.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [
      tokens.refreshToken,
      user.id,
    ]);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });
    res
      .status(200)
      .send({ message: "login boldi", accessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    console.log(req.cookie)
    const { refreshToken } = req.cookies;
    const empty = "";
    if (!refreshToken) {
      return res.status(400).send({ message: "toekn yoq" });
    }
    await pool.query(
      `Update users Set refresh_token = $1 where refresh_token = $2`,
      [empty, refreshToken]
    );

    res.clearCookie("refreshToken");
    res.status(200).send({ message: "chiqib keydi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);

    if (!refreshToken) {
      return res.status(400).send({ message: "tokrn yoqqq" });
    }

    const userQuery = await pool.query(
      `Select * from users where refresh_token = $1`,
      [refreshToken]
    );
    const user = userQuery.rows[0];
    if (!user) {
      return res.status(400).send({ message: "bunday tokenligi yoqqq" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const tokens = jwtService.genereteTokens(payload);

    await pool.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [
      tokens.refreshToken,
      user.id,
    ]);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });
    res.status(200).send({ message: "Yangi", accessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const userActivee = async (req, res) => {
  try {
    const activation_link = req.params.link;
    const userQuery = await pool.query(
      `SELECT * FROM users WHERE activation_link = $1`,
      [activation_link]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = userQuery.rows[0];

    await pool.query(
      `UPDATE users SET is_active = true WHERE activation_link = $1`,
      [activation_link]
    );

    res.send({
      message: "User activated successfully",
      status: true, 
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
  updateUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
  userActivee
};
