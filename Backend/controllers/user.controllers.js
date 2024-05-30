import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModals from "../models/user.modals";

export const addUser = (req, res) => {
  try {
    const { firstName, lastName, email, password, contact } = req.body;

    const saveUser = new userModals({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      contact: contact,
    });
    saveUser.save();

    if (saveUser) {
      return res.status(201).json({
        data: saveUser,
        message: "Successfully data inserted.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const getUserData = await userModals.find({ status: 1 });
    if (getUserData) {
      return res.status(200).json({
        data: getUserData,
        message: "Successfully fetched.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const getUserData = await userModals.findOne({ _id: userID, status: 1 });
    if (getUserData) {
      return res.status(200).json({
        data: getUserData,
        message: "Successfully fetched single user data.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const { firstName, lastName, email, password, contact1 } = req.body;

    const updated = await userModals.updateOne(
      { _id: userID },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          contact: contact1,
        },
      }
    );
    if (updated.acknowledged) {
      return res.status(200).json({
        message: "Updated.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userID = req.params.user_id;

    const deleted = await userModals.deleteOne({ _id: userID });
    if (deleted.acknowledged) {
      return res.status(200).json({
        message: "deleted.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const userID = req.params.user_id;

    const deleted = await userModals.updateOne(
      { _id: userID },
      { $set: { status: 0 } }
    );
    if (deleted.acknowledged) {
      return res.status(200).json({
        message: "deleted.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, contact1 } = req.body;

    const existUser = await userModals.findOne({ email: email });
    if (existUser) {
      return res.status(200).json({
        message: "User already exist.",
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const saveUser = new userModals({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      contact: contact1,
    });
    saveUser.save();

    if (saveUser) {
      return res.status(200).json({
        message: "Successfully signup",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await userModals.findOne({ email: email });
    if (!existUser) {
      return res.status(400).json({
        message: "User doesn't exist",
      });
    }

    const checkPassword = bcrypt.compareSync(password, existUser.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid credential"
      })
    }

    const secretKey = process.env.SECRET_KEY || 'fallback_secret_key';
    const token = jwt.sign(
      { userid: existUser._id, email: existUser.email },
      secretKey,
      { expiresIn: "1h" }
    );
    console.log(token);

    return res.status(200).json({
      token: token,
      data: existUser,
      message: 'Login success'
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
