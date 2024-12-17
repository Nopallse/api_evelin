const jwt = require('jsonwebtoken');
const Users = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");
const fs = require('fs/promises');
const multer = require('multer');
const { where } = require('sequelize');



const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Email tidak ditemukan, silahkan daftar terlebih dahulu" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    const userId = user.id;
   

    const token = jwt.sign({ userId}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    await Users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7,
      secure: process.env.NODE_ENV === 'production' 
    });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });


    res.status(200).json({
      error: false,
      message: "Login berhasil",
      data: {
        user: {
          id: userId,
          email: user.email,
        },
        token: token,
        refreshToken: refreshToken,
      },
    });


    

  } catch (error) {
    console.log(error);
    res.status(401).json(error.message);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password,noHp,institusi } = req.body;

    const user = await Users.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      name: name,
      email: email,
      password: hashedPassword,
      noHp: noHp,
      institusi: institusi,
    });

    res.status(201).json({
      error: false,
      message: "Pengguna berhasil didaftarkan",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}


const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      console.log('User tidak ditemukan dengan refresh token tersebut.');
      return res.sendStatus(204);
    }

    const userId = user.id;
    
    await Users.update({ refresh_token: null }, {
      where: {
        id: userId
      }
    });

    res.clearCookie('refreshToken');

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("Terjadi kesalahan server");
  }
};

function checkUserLoggedIn(req) {
    const refreshToken = req.cookies.refreshToken;
    
    let user = null;

    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            user = {
                userId: decoded.userId,
            };
            
        } catch (error) {
            console.error('Token invalid or expired:', error.message);
            return { user: null };
        }
    }
    return { user };
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await Users.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password saat ini salah" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedNewPassword });

    res.redirect('/logout');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const editProfile = async (req, res) => {
  try {
    const { newName, newNim, newPhoneNumber } = req.body;
    console.log(req.body);
    const mahasiswa = await Mahasiswa.findOne({ where: { nim: newNim } });
    await mahasiswa.update({ 
      name: newName,
      nim: newNim,
      phone: newPhoneNumber
    });
    return res.redirect('/profile');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const getUser = async (req, res) => {
  try {
    // Mengecek apakah user sudah login
    const { user } = checkUserLoggedIn(req);
    if (!user) {
      return res.status(401).json({ error: true, message: "User tidak terautentikasi" });
    }

    // Mendapatkan data user dari database berdasarkan userId
    const userData = await Users.findByPk(user.userId, {
      attributes: ['id', 'name', 'email','noHp','institusi'], // Pilih field yang ingin dikembalikan
    });

    if (!userData) {
      return res.status(404).json({ error: true, message: "User tidak ditemukan" });
    }

    // Mengembalikan data user sebagai JSON
    res.status(200).json({
      error: false,
      message: "Data user berhasil didapatkan",
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

const uploadProfilePicture = async (req, res) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        const user = await getUser(req, res);
        const userId = user.id;
        const dir = `public/data/user_${userId}`;
        await fs.mkdir(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        cb(null, 'profile.jpg');
      }
    })
  }).single('profile');

  await upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    await editProfile(req, res);
  });
};


module.exports = {
  Login,
  Logout,
  register,
  checkUserLoggedIn,
  changePassword,
  editProfile,
  getUser,
};
