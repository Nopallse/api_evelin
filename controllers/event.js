const Event = require("../models/EventModel");
const EventParticipant = require("../models/EventParticipantModel");
const jwt = require("jsonwebtoken");

function checkUserLoggedIn(req) {
  const refreshToken = req.cookies.refreshToken;

  let user = null;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      user = {
        userId: decoded.userId,
      };

      console.log("User logged in:", user);
    } catch (error) {
      console.error("Token invalid or expired:", error.message);
      return { user: null };
    }
  }
  return { user };
}

const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();

    res.status(200).json({
      error: false,
      message: "Data events berhasil didapatkan",
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ error: true, message: "Event tidak ditemukan" });
    }

    res.status(200).json({
      error: false,
      message: "Data event berhasil didapatkan",
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
const addEvent = async (req, res) => {
  try {
    const { user } = checkUserLoggedIn(req);

    if (!user) {
      return res
        .status(401)
        .json({ error: true, message: "User not authenticated" });
    }

    const { title, description, eventDate, location, category, speaker } =req.body;
    const posterUrl = req.file ? req.file.path : null;

    console.log("posterUrl:", posterUrl);
    console.log("Request Files:", req.files);
    console.log("Request Body:", req.body);
    if (
      !title ||
      !description ||
      !eventDate ||
      !location ||
      !category ||
      !speaker
    ) {
      return res.status(400).json({
        error: true,
        message: "All fields except 'poster' are required",
      });
    }

    if (!posterUrl) {
      return res.status(400).json({
        error: true,
        message: "Poster image is required",
      });
    }

    const event = await Event.create({
      userId: user.userId,
      title,
      description,
      eventDate,
      location,
      category,
      speaker,
      posterUrl,
    });

    res.status(201).json({
      error: false,
      message: "Event berhasil ditambahkan",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

const regEvent = async (req, res) => {
  try {
    const { user } = checkUserLoggedIn(req);

    if (!user) {
      return res
        .status(401)
        .json({ error: true, message: "User not authenticated" });
    }

    const eventParticipant = await EventParticipant.create({
      userId: user.userId,
      eventId: req.params.id,
    });


    res.status(201).json({
      error: false,
      message: "Event berhasil ditambahkan",
      data: eventParticipant,
    });
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  getEvents,
  getEvent,
  addEvent,
  regEvent
};
