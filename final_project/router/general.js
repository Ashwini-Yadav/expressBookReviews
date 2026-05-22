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
      success: false,
      message: " Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      success: false,
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    success: true,
    message: "User registerd successfully",
    users: users
  });
});

// Get the book list available in the shop
public_users.get('/',async  function (req, res) {
  //Write your code here
  // return res.status(200).json({
  //   success: true,
  //   message: "Books fetched successfully",
  //   books: books
  // });

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
  // const isbn = req.params.isbn;

  // if (!books[isbn]) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "Book not found"
  //   });
  // }

  // return res.status(200).json({
  //   success: true,
  //   message: "book fetched succesfully",
  //   book: books[isbn]
  // });

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
  //Write your code here
  // const author = req.params.author;
  // let filteredBooks = {};

  // Object.keys(books).forEach((key) => {
  //   if (books[key].author === author) {
  //     filteredBooks[key] = books[key];
  //   }
  // });

  // if (Object.keys(filteredBooks).length === 0) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "No books found for this author"
  //   });
  // }

  // return res.status(200).json({
  //   success: true, message: "Books fetched successfully",
  //   books: filteredBooks
  // });

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
  //Write your code here
  // const title = req.params.title;
  // let filteredBooks = {};

  // Object.keys(books).forEach((key) => {
  //   if (books[key].title === title) {
  //     filteredBooks[key] = books[key];
  //   }
  // });

  // if (Object.keys(filteredBooks).length === 0) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "No books found with this title"
  //   });
  // }
  // return res.status(200).json({
  //   success: true, message: "Books fetched successfully",
  //   books: filteredBooks
  // });
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
