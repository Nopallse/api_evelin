const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    if (!token) {
      throw new Error("No access token found");
    }

    // Verifikasi access token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
  } catch (err) {
    console.log("Access token verification failed:", err);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Lanjutkan ke middleware atau handler berikutnya
  next();
};

module.exports = { verifyToken };