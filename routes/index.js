const express = require("express");
const { Login, Logout,register } = require("../controllers/auth.js");
const {getUser} = require("../controllers/Users.js");
const {getEvents,getEvent,addEvent,regEvent} = require("../controllers/event.js");
const { verifyToken } = require("../middleware/VerifyToken.js")
const { isUserLoggedIn } = require("../middleware/isUserLoggedIn.js");
const {upload} = require("../middleware/upload.js");

const router = express.Router();

router.post('/login', Login);
router.get('/login', isUserLoggedIn, (req, res) => {
  res.render('login');
});

router.get('/user', verifyToken, (req, res) => {
  getUser(req, res);
});

router.post('/register', register);

router.delete('/logout', Logout);
router.get('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.redirect('/login');
});

router.get('/events', (req, res) => {
  getEvents(req, res);
});

router.get('/event/:id', verifyToken, (req, res) => {
  getEvent(req, res);
});

router.post('/addEvent', verifyToken, upload.single("posterUrl"), addEvent);

router.post('/regEvent/:id', verifyToken, regEvent);




module.exports = router;
