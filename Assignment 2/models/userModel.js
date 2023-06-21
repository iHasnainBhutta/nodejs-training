const client = require("../config/dbConnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (body) => {
  const { email, password } = body;
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const { rows } = await client().query(query, values);

    if (rows.length > 0) {
      return { success: false, message: "Email already exist!" };
    }

    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.error("Error during password hashing:", error);
      throw error;
    }

    const user = {
      email,
      password: hashedPassword,
    };

    const result = await client().query(
      `INSERT INTO users (email, password) VALUES ($1, $2);`,
      [user.email, user.password]
    );

    return {
      success: true,
      message: "User Registered Successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);
  }
};

const loginUser = async (email, password) => {
  try {
    const result = await client().query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );
    const user = result.rows;
    if (user.length === 0) {
      return "userNotFound";
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return "invalidPassword";
    } else {
      return { success: true, message: "User Login Successfully", DATA: user };
    }
  } catch (err) {
    console.error("ERROR", err.message);
  }
};
const deleteUser = async (id) => {
  try {
    const query_ = `DELETE FROM users WHERE user_id = ${id}`;
    const result = client().query(query_);
    if (result.rowCount === 0) {
      throw new Error("User not found");
    }

    return true;
  } catch (error) {
    console.error("Error during user deletion:", error);
    throw new Error("Error during database query");
  }
};

const getUserById = async (id) => {
  try {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const values = [id];
    const result = await client().query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error during user retrieval:", error);
    throw new Error("Error during database query");
  }
};

const updateUserById = async (id, email) => {
  try {
    const query = "UPDATE users SET  email = $1 WHERE user_id = $2";
    const values = [email, id];
    await client().query(query, values);
    return true;
  } catch (error) {
    console.error("Error during user update:", error);
    throw new Error("Error during database query");
  }
};

module.exports = {
  loginUser,
  registerUser,
  deleteUser,
  getUserById,
  updateUserById,
};
