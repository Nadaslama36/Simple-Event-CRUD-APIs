const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
   title: { type: String, required: true, maxlength: 50, trim: true },
   description: { type: String, maxlength: 500 },
   date: { type: Date, required: true, index: true, validate: { validator: value => value > new Date(), message: 'Date must be in the future' } },
   location: { type: String, required: true, maxlength: 100, trim: true },
   attendees: [String] , 
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
