// For the registration page (register.html)

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Reset validation classes
      form.classList.remove('was-validated'); 
  
      // Check if the form is valid
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
  
      // Get form data
      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value
      };
  
      try {
        // Send data to the server using fetch
        const response = await fetch('/register', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
  
        if (response.ok) {
          // Redirect to homepage after successful registration
          window.location.href = 'home.html';
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'An error occurred during registration.');
        }
      } catch (error) {
        console.error('Error while submitting the form:', error);
        alert('Registration failed. Please try again later.');
      }
    });
  });
  
  // Load recipes dynamically from recipe.json into home.html
  
  // Function to create a recipe card
  function createRecipeCard(recipe) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
  
    const card = document.createElement('div');
    card.className = 'card h-100';
  
    const img = document.createElement('img');
    img.src = recipe.image;
    img.className = 'card-img-top';
    img.alt = recipe.title;
  
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';
  
    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = recipe.title;
  
    const button = document.createElement('a');
    button.href = `recipes.html?id=${recipe.id}`; // Link to recipe details
    button.className = 'btn btn-burgundy mt-auto'; // Burgundy color 
    button.target = '_blank'; // Open in new tab
    button.textContent = 'View Recipe'; // Button text
  
    cardBody.appendChild(title);
    cardBody.appendChild(button);
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
  
    return col;
  }
  
  // Load recipes on page load
  document.addEventListener('DOMContentLoaded', () => { 
    fetch('/recipes')
      .then(response => response.json()) // Assuming the server returns a JSON array of recipes
      .then(data => {  // Assuming data is an array of recipe objects
        const container = document.getElementById('recipes-container'); // Assuming you have a container with this ID in your HTML
        data.forEach(recipe => { // Loop through each recipe
          const card = createRecipeCard(recipe); // Create a card for each recipe
          container.appendChild(card); // Append the card to the container
        });
      })
      .catch(error => {
        console.error('Error loading recipes:', error);
      });
  });
  
  // Load recipe details dynamically from recipe.json into recipes.html
  
  // Function to get URL parameter
  function getQueryParam(param) { 
    const urlParams = new URLSearchParams(window.location.search); // Get the URL parameters
    return urlParams.get(param); // Return the value of the specified parameter
  }
  
  // Function to display recipe details
  function displayRecipeDetails(recipe) {
    const container = document.getElementById('recipe-details'); 
  
    const title = document.createElement('h2');
    title.textContent = recipe.title;
  
    const image = document.createElement('img');
    image.src = recipe.image; 
    image.alt = recipe.title;
    image.className = 'img-fluid mb-4';
  
    const ingredientsTitle = document.createElement('h4');
    ingredientsTitle.textContent = 'Ingredients';
  
    const ingredientsList = document.createElement('ul');
    recipe.ingredients.forEach(ingredient => {
      const li = document.createElement('li');
      li.textContent = ingredient;
      ingredientsList.appendChild(li);
    });
  
    const instructionsTitle = document.createElement('h4');
    instructionsTitle.textContent = 'Instructions';
  
    const instructions = document.createElement('p');
    instructions.textContent = recipe.instructions;
  
    container.appendChild(title);
    container.appendChild(image);
    container.appendChild(ingredientsTitle);
    container.appendChild(ingredientsList);
    container.appendChild(instructionsTitle);
    container.appendChild(instructions);
  }
  
  // Load recipe details when page is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const recipeId = getQueryParam('id');
  
    fetch('/recipes')
      .then(response => response.json())
      .then(data => {
        const recipe = data.find(r => r.id === parseInt(recipeId)); // Find the recipe by ID
        if (recipe) {
          displayRecipeDetails(recipe); 
        } else {
          document.getElementById('recipe-details').textContent = 'Recipe not found.';
        }
      })
      .catch(error => {
        console.error('Error loading recipe details:', error);
      });
  });
  
  // Manage comments on recipes.html
  
  // Function to display comments
  function displayComments(comments) {
    const commentsList = document.getElementById('comments-list'); // Assuming you have a <ul> with this ID in your HTML
    commentsList.innerHTML = ''; // Reset the list
  
    comments.forEach(comment => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `<strong>${comment.username}:</strong> ${comment.text}`; // Display username and comment text
      commentsList.appendChild(li);
    });
  }
  
  // Load comments on page load
  document.addEventListener('DOMContentLoaded', () => {
    const recipeId = getQueryParam('id'); 
  
    // Get existing comments
    fetch(`/api/comments?recipeId=${recipeId}`) // Fetch comments for the specific recipe
      .then(response => response.json()) // Assuming the server returns a JSON array of comments
      .then(data => { // Assuming data is an array of comment objects
        displayComments(data);
      })
      .catch(error => {
        console.error('Error loading comments:', error);
      });
  
    // Handle comment form submission
    const commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', (e) => { // Assuming you have a form with this ID in your HTML
      e.preventDefault();
  
      const username = document.getElementById('username').value.trim(); // Get the username from the input field
      const text = document.getElementById('comment').value.trim(); 
  
      if (username && text) {
        const newComment = { recipeId: parseInt(recipeId), username, text }; // Create a new comment object
  
        fetch('/api/comments', { // Send the new comment to the server
          method: 'POST', // Assuming you have a POST endpoint for adding comments
          headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
          },
          body: JSON.stringify(newComment) // Convert the comment object to a JSON string
        })
          .then(response => response.json()) // Assuming the server returns the updated list of comments
          .then(data => { // Assuming the server returns the updated list of comments
            displayComments(data); 
            commentForm.reset(); 
          })
          .catch(error => {
            console.error('Error submitting comment:', error);
          });
      }
    });
  });
  