const factory = require("./handlersFactory");
const Event = require("../models/eventModel");

exports.getEvent = factory.getAll(Event);

exports.getEventById = factory.getOne(Event);

exports.createEvent = factory.createOne(Event,['title', 'date', 'location']);

exports.updateEvent = factory.updateOne(Event);

exports.deleteEvent = factory.deleteOne(Event);