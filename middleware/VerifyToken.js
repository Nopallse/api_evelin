const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.log("No refresh token found, responding with JSON");
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;

  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.message === "No access token found") {
      console.log("Access token expired or not found, verifying refresh token");
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign(
          { userId: decodedRefresh.userId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );

        console.log("New access token generated:", newAccessToken);
        res.cookie('token', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        req.userId = decodedRefresh.userId;

      } catch (err) {
        console.log("Refresh token verification failed:", err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      console.log("Access token verification failed:", err);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  next();
};

module.exports = { verifyToken };
