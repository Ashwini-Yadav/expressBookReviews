const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: " Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User registered successfully",
  });
});

// Get the book list available in the shop
public_users.get('/',async  function (req, res) {
  //Write your code here
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
 const isbn = req.params.isbn;

 new Promise((resolve, reject) => {
  if (books[isbn]) resolve(books[isbn]);
  else reject("Book not found");
 })
 .then(data => res.status(200).json(data))
 .catch(err => res.status(404).json({ message: err }))
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    let result = {};

    Object.keys(books).forEach(key => {
      if (books[key].author === author) {
        result[key] = books[key];
      }
    });

    if (Object.keys(result).length > 0) resolve(result);
    else reject("No books found for this author");
  })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
 
  const title = req.params.title;

  new Promise((resolve, reject) => {
    let result = {};

    Object.keys(books).forEach(key => {
      if (books[key].title === title) {
        result[key] = books[key];
      }
    });

    if (Object.keys(result).length > 0) resolve(result);
    else reject("No books found with this title");
  })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      success: false,
      message: "Book not found"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    reviews: books[isbn].reviews
  });
});

module.exports.general = public_users;
