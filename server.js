
const express = require('express'); // Express framework for building web applications
const fs = require('fs'); // File system module to read and write files
const path = require('path'); // Path module to work with file and directory paths
const app = express(); // Create an instance of Express

app.use(express.static('public')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse JSON and URL-encoded data



// User file
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
// Comment file
const COMMENTS_FILE = path.join(__dirname, 'data', 'comments.json');
// Recipe file
const RECIPES_FILE = path.join(__dirname, 'data', 'recipes.json');

//  ROUTE : Get the recipes
app.get('/recipes', (req, res) => {
  fs.readFile(RECIPES_FILE, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading recipes.');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// ROUTE : User registration
app.post('/register', (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.email || !newUser.password) {
    return res.status(400).json({ message: 'The name, email and password fields are mandatory.' });
  }

  fs.readFile(USERS_FILE, 'utf8', (err, data) => { // Read the users file
    let users = [];
    if (!err && data) {
      users = JSON.parse(data);
    }
    users.push(newUser);

    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => { // Write the new user to the file
      if (err) {
        return res.status(500).json({ message: 'Eror zhen registering user' });
      } else {
        return res.status(200).json({ message: 'User successfully registered' });
      }
    });
  });
});


//  ROUTE : Get comment for a recipe
app.get('/api/comments', (req, res) => {
  const recipeId = parseInt(req.query.recipeId);
  fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => { // Read the comments file
    if (err) return res.status(500).send('Server error');
    const comments = JSON.parse(data || '[]');
    const recipeComments = comments.filter(c => c.recipeId === recipeId); // Filter comments for the specific recipe
    res.json(recipeComments);
  });
});

//  ROUTE : Add a comment
app.post('/api/comments', (req, res) => {
  const newComment = req.body;
  fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
    const comments = err || !data ? [] : JSON.parse(data);
    comments.push(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), (err) => { // Write the new comment to the file
      if (err) return res.status(500).send('Server error');
      const recipeComments = comments.filter(c => c.recipeId === newComment.recipeId); 
      res.json(recipeComments);
    });
  });
});

//  Start the server
const PORT = process.env.PORT || 3000; // Define the port for the server to listen on
app.listen(PORT, () => { 
  console.log(`Server run on http://localhost:${PORT}`);
});
