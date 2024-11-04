const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }


    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    // Trigger "save" event when update document
    document.save();
    res.status(200).json({ data: document });
  });

// exports.createOne = (Model) =>
//   asyncHandler(async (req, res) => {
//     const newDoc = await Model.create(req.body);
//     res.status(201).json({ data: newDoc });
//   });
exports.createOne = (Model, uniqueFields = []) =>
  asyncHandler(async (req, res) => {
    // Build the filter based on unique fields
    const filter = {};
    uniqueFields.forEach(field => {
      if (req.body[field]) filter[field] = req.body[field];
    });

    // Check for an existing document with the same unique fields
    const existingDoc = await Model.findOne(filter);
    if (existingDoc) {
      return res.status(400).json({ message: 'This document already exists' });
    }

    // If no duplicate is found, create the new document
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });



exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });
  
  exports.getAll = (Model) =>
    asyncHandler(async (req, res) => {
      // Log the incoming query
      console.log("Request query:", req.query);
  
      // No filters applied
      const documentsCounts = await Model.countDocuments();
      console.log("Document count:", documentsCounts); // Log total count
  
      // Fetch all documents without any filter
      const documents = await Model.find(); // Fetch all events without any conditions
      console.log("Documents returned:", documents); // Log returned documents
  
      res.status(200).json({ results: documents.length, data: documents });
    });
  