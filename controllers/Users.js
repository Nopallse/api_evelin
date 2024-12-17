
const User = require("../models/UserModel.js");
const jwt = require('jsonwebtoken');



function checkUserLoggedIn(req) {
  const refreshToken = req.cookies.refreshToken;
  console.log('refreshToken:', refreshToken);
  
  let user = null;

  if (refreshToken) {
      try {
          const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
          user = {
              userId: decoded.userId,
          };

          console.log('User logged in:', user);
          
      } catch (error) {
          console.error('Token invalid or expired:', error.message);
          return { user: null };
      }
  }
  return { user };
}


const getUser = async (req, res) => {
  try {
    // Mengecek apakah user sudah login
    const { user } = checkUserLoggedIn(req);
    if (!user) {
      return res.status(401).json({ error: true, message: "User tidak terautentikasi" });
    }

    // Mendapatkan data user dari database berdasarkan userId
    const userData = await User.findByPk(user.userId, {
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


module.exports = {
    getUser
  };
  