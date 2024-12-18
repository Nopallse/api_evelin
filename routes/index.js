const express = require("express");
const { Login, Logout,register } = require("../controllers/auth.js");
const {getUser} = require("../controllers/Users.js");
const {getEvents,getEvent,addEvent,regEvent, getMyEvents, getMyEventsDetails, editEvent, searchEvent,getHistory} = require("../controllers/event.js");
const { isUserLoggedIn } = require("../middleware/isUserLoggedIn.js");
const {upload} = require("../middleware/upload.js");

const router = express.Router();

router.post('/login', Login);
router.get('/login', isUserLoggedIn, (req, res) => {
  res.render('login');
});

router.get('/user', (req, res) => {
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

router.get('/history', (req, res) => {
  getHistory(req, res);
});

router.get('/event/:id', (req, res) => {
  getEvent(req, res);
});

router.post('/addEvent', upload.single("posterUrl"), addEvent);

router.post('/regEvent/:id', regEvent);

router.get('/myEvents', (req, res) => {
  getMyEvents(req, res);
});
router.get('/myEvent/:id', (req, res) => {
  getMyEventsDetails(req, res);
});



// router.put('/editEvent/:id', verifyToken, editEvent);

router.get('/searchEvent', (req, res) => {
  searchEvent(req, res);
});

module.exports = router;
