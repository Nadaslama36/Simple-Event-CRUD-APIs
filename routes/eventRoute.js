const express = require("express");

const {
  createEventValidator,
  updateEventValidator,
  getEventValidator,
  deleteEventValidator
} = require("../utils/validatores/eventValidator");

const {
  getEvent,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../services/eventService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getEvent)
  .post(
   createEventValidator,
    createEvent
  );
router
  .route("/:id")
  .get(getEventValidator, getEventById)
  .put(
    updateEventValidator,
    updateEvent
  )
  .delete(
    deleteEventValidator,
    deleteEvent
  );

module.exports = router;