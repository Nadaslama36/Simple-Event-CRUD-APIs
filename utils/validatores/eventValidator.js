const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validationMiddlewares'); 
const slugify = require('slugify');

exports.createEventValidator = [
  check("title")
    .isLength({ max: 50 })
    .withMessage("Title is required and max length is 50 characters")
    .notEmpty()
    .withMessage("Title is required"),
  check("description")
    .isLength({ max: 500 })
    .withMessage("Description too long"),
  check("date")
    .notEmpty()
    .withMessage("Event date is required")
    .isDate()
    .custom(value => new Date(value) > new Date())
    .withMessage('Date must be a future date'),
  check("location")
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 100 })
    .withMessage("Location must be a maximum of 100 characters"),
  check("attendees")
    .isArray({ min: 1 }) //the attendees is an array and not empty
    .withMessage("At least one attendee is required")
    .custom(attendees => {
      attendees.forEach(name => {
        if (typeof name !== 'string' || name.trim() === '') {
          throw new Error("Each attendee must be a non-empty string");
        }
      });
      return true;
    }),
  validatorMiddleware,
];

exports.getEventValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateEventValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("attendees")
    .optional() 
    .isArray()
    .withMessage("Attendees must be an array")
    .custom(attendees => {
      attendees.forEach(name => {
        if (typeof name !== 'string' || name.trim() === '') {
          throw new Error("Each attendee must be a non-empty string");
        }
      });
      return true;
    }),
  validatorMiddleware,
];

exports.deleteEventValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID format"),
  validatorMiddleware,
];

  