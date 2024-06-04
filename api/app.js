const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const { body, validationResult } = require('express-validator');
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);
const COLLECTION = 'books';

// GET /books
// getBooks() with pagination, sorting, and filtering
router.get('/', async (req, res) => {
  let limit = parseInt(req.query.limit) || MAX_RESULTS;
  let page = parseInt(req.query.page) || 1;
  let query = {};

  // Add filtering by title if provided
  if (req.query.title) {
    query.title = { $regex: req.query.title, $options: 'i' };
  }

  const dbConnect = dbo.getDb();
  const skip = (page - 1) * limit;

  try {
    let results = await dbConnect.collection(COLLECTION)
      .find(query)
      .project({ title: 1, author: 1 })
      .sort(req.query.sort || { _id: -1 }) // Sorting
      .skip(skip)
      .limit(limit)
      .toArray();

    results.forEach(book => {
      book["link"] = `localhost:${process.env.PORT}${process.env.BASE_URI}/book/${book._id}`;
    });

    const total = await dbConnect.collection(COLLECTION).countDocuments(query);
    res.json({ results, total, page, totalPages: Math.ceil(total / limit) }).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// GET /books/:id
// getBookById()
router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = { _id: new ObjectId(req.params.id) };
  try {
    let result = await dbConnect.collection(COLLECTION).findOne(query);
    if (!result) {
      res.status(404).send('Book not found');
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// POST /books
// addBook() with data validation
router.post('/', [
  body('title').isString().notEmpty(),
  body('author').isString().notEmpty(),
  // Add more validations as needed
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const dbConnect = dbo.getDb();
  try {
    let result = await dbConnect.collection(COLLECTION).insertOne(req.body);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE /books/:id
// deleteBookById()
router.delete('/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const dbConnect = dbo.getDb();
  try {
    let result = await dbConnect.collection(COLLECTION).deleteOne(query);
    if (result.deletedCount === 0) {
      res.status(404).send("Book not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// PUT /books/:id
// Update partially a resource
router.put('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  const update = { $set: req.body }; // Assuming the body contains the fields to update partially
  try {
    let result = await dbConnect.collection(COLLECTION).updateOne(query, update);
    if (result.matchedCount === 0) {
      res.status(404).send("Book not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE /books
// Delete multiple resources
router.delete('/', async (req, res) => {
  // Extract IDs from request body
  const ids = req.body.ids;
  const query = { _id: { $in: ids.map(id => new ObjectId(id)) } };
  const dbConnect = dbo.getDb();
  try {
    let result = await dbConnect.collection(COLLECTION).deleteMany(query);
    if (result.deletedCount === 0) {
      res.status(404).send("No books found to delete");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
