const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const axios = require("axios");
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
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here

  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  }catch(error) {
    return res.status(500).json({ message: " Error fetching book by ISBN"});
  }
});

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {

  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
 
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`)
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
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
