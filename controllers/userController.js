const userModels = require("../models/userModel");
const bcrypt = require("bcrypt");

//handle get user list
exports.getUserList = async (req, res) => {
  try {
    const user_list = await userModels.find({
      _id: { $ne: req.user_id },
    });

    const users = user_list.map((user) => ({
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    }));

    return res.status(200).json({
      status: 200,
      message: "success",
      total: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error Get User List: ${error.message}`,
    });
  }
};

//handel get user by id
exports.getUserById = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        status: 500,
        message: "Bad Request, require is id",
      });

    const user_list = await userModels.findById(req.params.id);

    if (!user_list)
      return res.status(404).json({
        status: 404,
        message: "User not found.",
      });

    const users = {
      _id: user_list._id,
      email: user_list.email,
      name: user_list.name,
      phone: user_list.phone,
      role: user_list.role,
    };
    return res.status(200).json({
      status: 200,
      message: "success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error Get User By ID: ${error.message}`,
    });
  }
};

//handel get profile
exports.getProfile = async (req, res) => {
  try {
    const user_list = await userModels.findById(req?.user_id);

    if (!user_list)
      return res.status(404).json({
        status: 404,
        message: "User not found.",
      });

    const users = {
      _id: user_list._id,
      email: user_list.email,
      name: user_list.name,
      phone: user_list.phone,
      role: user_list.role,
      password: user_list.password,
    };
    return res.status(200).json({
      status: 200,
      message: "success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error Get User By ID: ${error.message}`,
    });
  }
};

//handle create user
exports.createUser = async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;
    console.log(email, password, name, phone, role);
    if (!email || !password || !name || !phone)
      return res.status(400).json({
        status: 400,
        message: "Bad Request, require is email, password, name, phone",
      });

    const check_email = await userModels.findOne({ email: email });

    if (check_email)
      return res.status(400).json({
        status: 400,
        message: "Email already exists",
      });

    const hash_password = await bcrypt.hash(password, 10);

    const create_user = await userModels.create({
      email: email,
      password: hash_password,
      name: name,
      phone: phone,
      role: role,
    });

    if (!create_user)
      return res.status(405).json({
        status: 405,
        message: "Error to create user",
      });

    return res.status(200).json({
      status: 200,
      message: "success",
      data: create_user._id,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error Create User: ${error.message}`,
    });
  }
};

//handle update user
exports.updateUser = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        status: 400,
        message: "Bad Request, require is id",
      });

    const check_user_id = await userModels.findById(req.params.id);

    if (!check_user_id)
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });

    const { email, name, phone, role } = req.body;

    if (!name || !name || !phone)
      return res.status(400).json({
        stauts: 400,
        message: "Bad Request, require is name, phone",
      });

    const update_user = await userModels.findByIdAndUpdate(
      req.params.id,
      {
        email: email,
        name: name,
        phone: phone,
        role: role,
      },
      {
        new: true,
      }
    );

    if (!update_user)
      return res.status(405).json({
        status: 405,
        message: "Error to update user",
      });

    return res.status(200).json({
      status: 200,
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error Update User: ${error.message}`,
    });
  }
};

//handle delete user`
exports.deleteUser = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        status: 400,
        message: "Bad Request, require is id",
      });

    const delete_user = await userModels.findByIdAndDelete(req.params.id);

    if (!delete_user)
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });

    return res.status(200).json({
      status: 200,
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error Delete User: ${error.message}`,
    });
  }
};
