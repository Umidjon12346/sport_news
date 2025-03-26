const { addMinute } = require("../helpers/add_minutes");
const { errorHandler } = require("../helpers/error.handler");
const otpGenerator = require("otp-generator");
const config = require("config");
const pool = require("../config/db");
const uuid = require("uuid");
const { encode, decode } = require("../helpers/crypt");
const mailService = require("../services/mail.service");

const createOtp = async (req, res) => {
  try {
    const { phone_number, email } = req.body; // ✅ Email ham olinadi

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expirationTime = addMinute(
      now,
      config.get("expiration_minute")
    );

    const newOtp = await pool.query(
      `INSERT INTO otp (id, otp, expiration_time)
       VALUES ($1, $2, $3) RETURNING id`,
      [uuid.v4(), otp, expirationTime, ]
    );

    const details = {
      timestamp: now,
      otp_id: newOtp.rows[0].id,
    };

    const encodedData = await encode(JSON.stringify(details));

    
    if (email) {
      await mailService.sendOtpMail(
        email,
        otp
      )
    }

    res.status(201).send({ verification_key: encodedData });
  } catch (error) {
    errorHandler(error, res);
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { verification_key, phone_number, otp } = req.body;
    const now = new Date();

    const decodedData = await decode(verification_key);
    const details = JSON.parse(decodedData);
    if (details.phone_number != phone_number) {
      const response = {
        Status: "Failure",
        message: "OTP yuborilmadi bunga",
      };
      return res.status(400).send(response);
    }
    const otpData = await pool.query(`Select * from otp where id=$1`, [
      details.otp_id,
    ]);
    const otpResult = otpData.rows[0];

    // res.send({ otpResult });
    if (otpData.rowCount == 0) {
      const response = {
        Status: "Failure",
        message: "OTP yo'qq",
      };
      return res.status(400).send(response);
    }

    if (otpResult.verified == true) {
      const response = {
        Status: "Failure",
        message: "OTP ishlatilgann",
      };
      return res.status(400).send(response);
    }

    if (otpResult.expiration_time < now) {
      const response = {
        Status: "Failure",
        message: "OTP vaqti ypq2wihefw",
      };
      return res.status(400).send(response);
    }

    if (otpResult.otp != otp) {
      const response = {
        Status: "Failure",
        message: "OTP mosmasa",
      };
      return res.status(400).send(response);
    }

    await pool.query(`Update otp SET verified = true where id =$1`, [
      otpResult.id,
    ]);
    let user_id,is_new;
    const userData = await pool.query(`Select * from users where phone_number =$1`,phone_number)
    if (userData.rows.length==0){
        const newUser = await pool.query(`
            INSERT INTO users (phone_number,is_active)
            VALUES ($1,true) RETURNING id;
            `,[phone_number]);
            user_id = newUser.rows[0].id;
            is_new = true
    }else{
        user_id = newUser.rows[0].id;
        is_new = false; 
    }

    // yacni yoki eski
    const response = {
      Status: "Success",
    };
    return res.status(200).send(response);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createOtp,
  verifyOtp,
};
