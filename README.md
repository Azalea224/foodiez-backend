# Foodiez API

A RESTful API for managing recipes, ingredients, categories, and users. Built with Express.js, TypeScript, and MongoDB.

## Features

- 🔐 **Authentication** - User registration, login, and JWT-based authentication
- 🍳 **Recipe Management** - Create, read, update, and delete recipes
- 👥 **User Management** - Manage users who create recipes with profile images
- 📁 **Category Management** - Organize recipes by categories
- 🥘 **Ingredient Management** - Manage ingredients used in recipes
- 🔗 **Recipe Ingredients** - Link ingredients to recipes with quantities and units
- 🔍 **Filtering & Querying** - Filter recipes by user or category
- 🖼️ **Profile Images** - Upload and manage user profile images stored in MongoDB
- 🔒 **Protected Routes** - JWT token-based route protection
- ✅ **Error Handling** - Comprehensive error handling middleware
- 📝 **Request Logging** - HTTP request logging with Morgan

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Middleware**: CORS, Morgan (logging)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd foodiez-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/foodiez
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
```

**Important:** Change `JWT_SECRET` to a strong, random string in production!

4. Make sure MongoDB is running:
- Local MongoDB: Ensure MongoDB service is running on your machine
- Remote MongoDB: Update `MONGODB_URI` in your `.env` file or `src/index.ts`

## Running the Project

### Development Mode
```bash
npm run dev
```
This will start the server with hot-reload using `ts-node-dev`.

### Production Mode
```bash
# Build TypeScript
npm run build

# Start the server
npm start
```

The API will be available at `http://localhost:3000` (or the port specified in your environment variables).

## Frontend Integration

### Environment Variables

Create a `.env` file in your frontend project or configure your environment:

```env
VITE_API_URL=http://localhost:3000
# or
REACT_APP_API_URL=http://localhost:3000
# or
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Base URL Configuration

**JavaScript/TypeScript:**
```javascript
// config.js or constants.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// or for React
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
```

**Using Axios:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### CORS Configuration

The API has CORS enabled by default. Make sure your frontend origin is allowed. The API accepts requests from any origin in development mode.

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
- **GET** `/` - Check if the API is running

### Authentication
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user and get JWT token
- **POST** `/api/auth/logout` - Logout user (client-side token removal)
- **GET** `/api/auth/me` - Get current authenticated user (protected)

### Users
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create a new user
- **PUT** `/api/users/:id` - Update a user
- **DELETE** `/api/users/:id` - Delete a user
- **POST** `/api/users/:id/profile-image` - Upload profile image
- **DELETE** `/api/users/:id/profile-image` - Delete profile image

### Categories
- **GET** `/api/categories` - Get all categories
- **GET** `/api/categories/:id` - Get category by ID
- **POST** `/api/categories` - Create a new category
- **PUT** `/api/categories/:id` - Update a category
- **DELETE** `/api/categories/:id` - Delete a category

### Ingredients
- **GET** `/api/ingredients` - Get all ingredients (sorted by name)
- **GET** `/api/ingredients/:id` - Get ingredient by ID
- **POST** `/api/ingredients` - Create a new ingredient
- **PUT** `/api/ingredients/:id` - Update an ingredient
- **DELETE** `/api/ingredients/:id` - Delete an ingredient

### Recipes
- **GET** `/api/recipes` - Get all recipes
  - Query params: `?user_id=<id>`, `?category_id=<id>`
- **GET** `/api/recipes/:id` - Get recipe by ID
- **POST** `/api/recipes` - Create a new recipe
- **PUT** `/api/recipes/:id` - Update a recipe
- **DELETE** `/api/recipes/:id` - Delete a recipe

### Recipe Ingredients
- **GET** `/api/recipe-ingredients` - Get all recipe ingredients
  - Query params: `?recipe_id=<id>`, `?ingredient_id=<id>`
- **GET** `/api/recipe-ingredients/:id` - Get recipe ingredient by ID
- **GET** `/api/recipe-ingredients/recipe/:recipe_id` - Get all ingredients for a specific recipe
- **POST** `/api/recipe-ingredients` - Create a new recipe ingredient
- **PUT** `/api/recipe-ingredients/:id` - Update a recipe ingredient
- **DELETE** `/api/recipe-ingredients/:id` - Delete a recipe ingredient

## API Endpoint Details with Frontend Examples

### Health Check

**GET** `/`

**Variables:**
- `API_BASE_URL` - Your API base URL (e.g., `http://localhost:3000`)

**Fetch Example:**
```javascript
const response = await fetch(`${API_BASE_URL}/`);
const data = await response.json();
console.log(data); // { success: true, message: "Foodiez API is running!" }
```

**Axios Example:**
```javascript
const response = await api.get('/');
console.log(response.data);
```

---

### Users

#### Get All Users

**GET** `/api/users`

**Variables:**
- `API_BASE_URL` - Your API base URL

**Fetch Example:**
```javascript
const response = await fetch(`${API_BASE_URL}/api/users`);
const data = await response.json();
// data: { success: true, count: 10, data: [...] }
```

**Axios Example:**
```javascript
const { data } = await api.get('/api/users');
// data: { success: true, count: 10, data: [...] }
```

#### Get User by ID

**GET** `/api/users/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `userId` - User ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
const data = await response.json();
```

**Axios Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const { data } = await api.get(`/api/users/${userId}`);
```

#### Create User

**POST** `/api/users`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `username` - Username (string, required, unique)
- `email` - Email address (string, required, unique)

**Fetch Example:**
```javascript
const userData = {
  username: 'john_doe',
  email: 'john@example.com'
};

const response = await fetch(`${API_BASE_URL}/api/users`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const userData = {
  username: 'john_doe',
  email: 'john@example.com'
};

const { data } = await api.post('/api/users', userData);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "username": "john_doe",
    "email": "john@example.com",
    "profileImage": null,
    "profileImageContentType": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update User

**PUT** `/api/users/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `userId` - User ID (MongoDB ObjectId)
- `username` - New username (string, optional)
- `email` - New email (string, optional)

**Fetch Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const updateData = {
  username: 'john_doe_updated',
  email: 'john.updated@example.com'
};

const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updateData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const updateData = {
  username: 'john_doe_updated',
  email: 'john.updated@example.com'
};

const { data } = await api.put(`/api/users/${userId}`, updateData);
```

#### Delete User

**DELETE** `/api/users/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `userId` - User ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
  method: 'DELETE',
});
const data = await response.json();
```

**Axios Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const { data } = await api.delete(`/api/users/${userId}`);
```

#### Upload Profile Image

**POST** `/api/users/:id/profile-image`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `userId` - User ID (MongoDB ObjectId)
- `profileImage` - Image file (File object, max 5MB, image types only)

**Fetch Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const fileInput = document.querySelector('input[type="file"]');
const formData = new FormData();
formData.append('profileImage', fileInput.files[0]);

const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile-image`, {
  method: 'POST',
  body: formData, // Don't set Content-Type header, browser will set it with boundary
});
const data = await response.json();
```

**Axios Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const fileInput = document.querySelector('input[type="file"]');
const formData = new FormData();
formData.append('profileImage', fileInput.files[0]);

const { data } = await api.post(
  `/api/users/${userId}/profile-image`,
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
);
```

**React Example:**
```jsx
const uploadProfileImage = async (userId, file) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile-image`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

// Usage in component
<input 
  type="file" 
  accept="image/*" 
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      uploadProfileImage(userId, e.target.files[0]);
    }
  }}
/>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "username": "john_doe",
    "email": "john@example.com",
    "profileImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "profileImageContentType": "image/jpeg",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Display Profile Image:**
```jsx
// React example
<img 
  src={user.profileImage || '/default-avatar.png'} 
  alt="Profile" 
/>
```

#### Delete Profile Image

**DELETE** `/api/users/:id/profile-image`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `userId` - User ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile-image`, {
  method: 'DELETE',
});
const data = await response.json();
```

**Axios Example:**
```javascript
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const { data } = await api.delete(`/api/users/${userId}/profile-image`);
```

---

### Categories

#### Get All Categories

**GET** `/api/categories`

**Variables:**
- `API_BASE_URL` - Your API base URL

**Fetch Example:**
```javascript
const response = await fetch(`${API_BASE_URL}/api/categories`);
const data = await response.json();
```

**Axios Example:**
```javascript
const { data } = await api.get('/api/categories');
```

#### Get Category by ID

**GET** `/api/categories/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `categoryId` - Category ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const categoryId = '60d5ec49f1b2c72b8c8e4f1b';
const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`);
const data = await response.json();
```

**Axios Example:**
```javascript
const categoryId = '60d5ec49f1b2c72b8c8e4f1b';
const { data } = await api.get(`/api/categories/${categoryId}`);
```

#### Create Category

**POST** `/api/categories`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `name` - Category name (string, required, unique)
- `description` - Category description (string, optional)

**Fetch Example:**
```javascript
const categoryData = {
  name: 'Desserts',
  description: 'Sweet treats and desserts'
};

const response = await fetch(`${API_BASE_URL}/api/categories`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(categoryData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const categoryData = {
  name: 'Desserts',
  description: 'Sweet treats and desserts'
};

const { data } = await api.post('/api/categories', categoryData);
```

#### Update Category

**PUT** `/api/categories/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `categoryId` - Category ID (MongoDB ObjectId)
- `name` - New category name (string, optional)
- `description` - New description (string, optional)

**Fetch Example:**
```javascript
const categoryId = '60d5ec49f1b2c72b8c8e4f1b';
const updateData = {
  name: 'Desserts Updated',
  description: 'Updated description'
};

const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updateData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const categoryId = '60d5ec49f1b2c72b8c8e4f1b';
const updateData = {
  name: 'Desserts Updated',
  description: 'Updated description'
};

const { data } = await api.put(`/api/categories/${categoryId}`, updateData);
```

#### Delete Category

**DELETE** `/api/categories/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `categoryId` - Category ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const categoryId = '60d5ec49f1b2c72b8c8e4f1b';
const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
  method: 'DELETE',
});
const data = await response.json();
```

**Axios Example:**
```javascript
const categoryId = '60d5ec49f1b2c72b8c8e4f1b';
const { data } = await api.delete(`/api/categories/${categoryId}`);
```

---

### Ingredients

#### Get All Ingredients

**GET** `/api/ingredients`

**Variables:**
- `API_BASE_URL` - Your API base URL

**Fetch Example:**
```javascript
const response = await fetch(`${API_BASE_URL}/api/ingredients`);
const data = await response.json();
```

**Axios Example:**
```javascript
const { data } = await api.get('/api/ingredients');
```

#### Get Ingredient by ID

**GET** `/api/ingredients/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `ingredientId` - Ingredient ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const ingredientId = '60d5ec49f1b2c72b8c8e4f1d';
const response = await fetch(`${API_BASE_URL}/api/ingredients/${ingredientId}`);
const data = await response.json();
```

**Axios Example:**
```javascript
const ingredientId = '60d5ec49f1b2c72b8c8e4f1d';
const { data } = await api.get(`/api/ingredients/${ingredientId}`);
```

#### Create Ingredient

**POST** `/api/ingredients`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `name` - Ingredient name (string, required, unique)

**Fetch Example:**
```javascript
const ingredientData = {
  name: 'Flour'
};

const response = await fetch(`${API_BASE_URL}/api/ingredients`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(ingredientData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const ingredientData = {
  name: 'Flour'
};

const { data } = await api.post('/api/ingredients', ingredientData);
```

#### Update Ingredient

**PUT** `/api/ingredients/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `ingredientId` - Ingredient ID (MongoDB ObjectId)
- `name` - New ingredient name (string, optional)

**Fetch Example:**
```javascript
const ingredientId = '60d5ec49f1b2c72b8c8e4f1d';
const updateData = {
  name: 'All-Purpose Flour'
};

const response = await fetch(`${API_BASE_URL}/api/ingredients/${ingredientId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updateData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const ingredientId = '60d5ec49f1b2c72b8c8e4f1d';
const updateData = {
  name: 'All-Purpose Flour'
};

const { data } = await api.put(`/api/ingredients/${ingredientId}`, updateData);
```

#### Delete Ingredient

**DELETE** `/api/ingredients/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `ingredientId` - Ingredient ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const ingredientId = '60d5ec49f1b2c72b8c8e4f1d';
const response = await fetch(`${API_BASE_URL}/api/ingredients/${ingredientId}`, {
  method: 'DELETE',
});
const data = await response.json();
```

**Axios Example:**
```javascript
const ingredientId = '60d5ec49f1b2c72b8c8e4f1d';
const { data } = await api.delete(`/api/ingredients/${ingredientId}`);
```

---

### Recipes

#### Get All Recipes

**GET** `/api/recipes`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `user_id` - (optional) Filter by user ID (query parameter)
- `category_id` - (optional) Filter by category ID (query parameter)

**Fetch Example:**
```javascript
// Get all recipes
const response = await fetch(`${API_BASE_URL}/api/recipes`);
const data = await response.json();

// Get recipes by user
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const response = await fetch(`${API_BASE_URL}/api/recipes?user_id=${userId}`);
const data = await response.json();

// Get recipes by category
const categoryId = '60d5ec49f1b2c72b8c8e4f1b';
const response = await fetch(`${API_BASE_URL}/api/recipes?category_id=${categoryId}`);
const data = await response.json();
```

**Axios Example:**
```javascript
// Get all recipes
const { data } = await api.get('/api/recipes');

// Get recipes by user
const userId = '60d5ec49f1b2c72b8c8e4f1a';
const { data } = await api.get('/api/recipes', {
  params: { user_id: userId }
});

// Get recipes by category
const categoryId = '60d5ec49f1b2c72b8c8e4f1b';
const { data } = await api.get('/api/recipes', {
  params: { category_id: categoryId }
});
```

#### Get Recipe by ID

**GET** `/api/recipes/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `recipeId` - Recipe ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`);
const data = await response.json();
```

**Axios Example:**
```javascript
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const { data } = await api.get(`/api/recipes/${recipeId}`);
```

#### Create Recipe

**POST** `/api/recipes`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `title` - Recipe title (string, required)
- `description` - Recipe description (string, optional)
- `user_id` - User ID (MongoDB ObjectId, required)
- `category_id` - Category ID (MongoDB ObjectId, required)

**Fetch Example:**
```javascript
const recipeData = {
  title: 'Chocolate Chip Cookies',
  description: 'Delicious homemade chocolate chip cookies',
  user_id: '60d5ec49f1b2c72b8c8e4f1a',
  category_id: '60d5ec49f1b2c72b8c8e4f1b'
};

const response = await fetch(`${API_BASE_URL}/api/recipes`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(recipeData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const recipeData = {
  title: 'Chocolate Chip Cookies',
  description: 'Delicious homemade chocolate chip cookies',
  user_id: '60d5ec49f1b2c72b8c8e4f1a',
  category_id: '60d5ec49f1b2c72b8c8e4f1b'
};

const { data } = await api.post('/api/recipes', recipeData);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "title": "Chocolate Chip Cookies",
    "description": "Delicious homemade chocolate chip cookies",
    "user_id": {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "category_id": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "name": "Desserts",
      "description": "Sweet treats and desserts"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Recipe

**PUT** `/api/recipes/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `recipeId` - Recipe ID (MongoDB ObjectId)
- `title` - New recipe title (string, optional)
- `description` - New description (string, optional)
- `user_id` - New user ID (MongoDB ObjectId, optional)
- `category_id` - New category ID (MongoDB ObjectId, optional)

**Fetch Example:**
```javascript
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const updateData = {
  title: 'Updated Recipe Title',
  description: 'Updated description'
};

const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updateData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const updateData = {
  title: 'Updated Recipe Title',
  description: 'Updated description'
};

const { data } = await api.put(`/api/recipes/${recipeId}`, updateData);
```

#### Delete Recipe

**DELETE** `/api/recipes/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `recipeId` - Recipe ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`, {
  method: 'DELETE',
});
const data = await response.json();
```

**Axios Example:**
```javascript
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const { data } = await api.delete(`/api/recipes/${recipeId}`);
```

---

### Recipe Ingredients

#### Get All Recipe Ingredients

**GET** `/api/recipe-ingredients`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `recipe_id` - (optional) Filter by recipe ID (query parameter)
- `ingredient_id` - (optional) Filter by ingredient ID (query parameter)

**Fetch Example:**
```javascript
// Get all recipe ingredients
const response = await fetch(`${API_BASE_URL}/api/recipe-ingredients`);
const data = await response.json();

// Get recipe ingredients by recipe
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const response = await fetch(`${API_BASE_URL}/api/recipe-ingredients?recipe_id=${recipeId}`);
const data = await response.json();
```

**Axios Example:**
```javascript
// Get all recipe ingredients
const { data } = await api.get('/api/recipe-ingredients');

// Get recipe ingredients by recipe
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const { data } = await api.get('/api/recipe-ingredients', {
  params: { recipe_id: recipeId }
});
```

#### Get Ingredients by Recipe ID

**GET** `/api/recipe-ingredients/recipe/:recipe_id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `recipeId` - Recipe ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const response = await fetch(`${API_BASE_URL}/api/recipe-ingredients/recipe/${recipeId}`);
const data = await response.json();
```

**Axios Example:**
```javascript
const recipeId = '60d5ec49f1b2c72b8c8e4f1c';
const { data } = await api.get(`/api/recipe-ingredients/recipe/${recipeId}`);
```

#### Get Recipe Ingredient by ID

**GET** `/api/recipe-ingredients/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `recipeIngredientId` - Recipe Ingredient ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const recipeIngredientId = '60d5ec49f1b2c72b8c8e4f1e';
const response = await fetch(`${API_BASE_URL}/api/recipe-ingredients/${recipeIngredientId}`);
const data = await response.json();
```

**Axios Example:**
```javascript
const recipeIngredientId = '60d5ec49f1b2c72b8c8e4f1e';
const { data } = await api.get(`/api/recipe-ingredients/${recipeIngredientId}`);
```

#### Create Recipe Ingredient

**POST** `/api/recipe-ingredients`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `recipe_id` - Recipe ID (MongoDB ObjectId, required)
- `ingredient_id` - Ingredient ID (MongoDB ObjectId, required)
- `quantity` - Quantity (string, required)
- `unit` - Unit of measurement (string, required)

**Fetch Example:**
```javascript
const recipeIngredientData = {
  recipe_id: '60d5ec49f1b2c72b8c8e4f1c',
  ingredient_id: '60d5ec49f1b2c72b8c8e4f1d',
  quantity: '2',
  unit: 'cups'
};

const response = await fetch(`${API_BASE_URL}/api/recipe-ingredients`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(recipeIngredientData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const recipeIngredientData = {
  recipe_id: '60d5ec49f1b2c72b8c8e4f1c',
  ingredient_id: '60d5ec49f1b2c72b8c8e4f1d',
  quantity: '2',
  unit: 'cups'
};

const { data } = await api.post('/api/recipe-ingredients', recipeIngredientData);
```

#### Update Recipe Ingredient

**PUT** `/api/recipe-ingredients/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `recipeIngredientId` - Recipe Ingredient ID (MongoDB ObjectId)
- `recipe_id` - New recipe ID (MongoDB ObjectId, optional)
- `ingredient_id` - New ingredient ID (MongoDB ObjectId, optional)
- `quantity` - New quantity (string, optional)
- `unit` - New unit (string, optional)

**Fetch Example:**
```javascript
const recipeIngredientId = '60d5ec49f1b2c72b8c8e4f1e';
const updateData = {
  quantity: '3',
  unit: 'tablespoons'
};

const response = await fetch(`${API_BASE_URL}/api/recipe-ingredients/${recipeIngredientId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updateData),
});
const data = await response.json();
```

**Axios Example:**
```javascript
const recipeIngredientId = '60d5ec49f1b2c72b8c8e4f1e';
const updateData = {
  quantity: '3',
  unit: 'tablespoons'
};

const { data } = await api.put(`/api/recipe-ingredients/${recipeIngredientId}`, updateData);
```

#### Delete Recipe Ingredient

**DELETE** `/api/recipe-ingredients/:id`

**Variables:**
- `API_BASE_URL` - Your API base URL
- `recipeIngredientId` - Recipe Ingredient ID (MongoDB ObjectId)

**Fetch Example:**
```javascript
const recipeIngredientId = '60d5ec49f1b2c72b8c8e4f1e';
const response = await fetch(`${API_BASE_URL}/api/recipe-ingredients/${recipeIngredientId}`, {
  method: 'DELETE',
});
const data = await response.json();
```

**Axios Example:**
```javascript
const recipeIngredientId = '60d5ec49f1b2c72b8c8e4f1e';
const { data } = await api.delete(`/api/recipe-ingredients/${recipeIngredientId}`);
```

---

## Error Handling Examples

### Frontend Error Handling

**Fetch with Error Handling:**
```javascript
const fetchUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    // Handle error in UI
    return null;
  }
};
```

**Axios with Error Handling:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data.error || 'Something went wrong';
      console.error('API Error:', errorMessage);
      // Handle error in UI
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);
```

**Error Response Format:**
```json
{
  "success": false,
  "error": "User not found"
}
```

## Data Models

### User
```typescript
{
  username: string;              // Required, unique
  email: string;                 // Required, unique, lowercase
  password: string;              // Required, hashed with bcrypt, min 6 characters
  profileImage?: string;         // Base64 encoded image data URI (optional)
  profileImageContentType?: string; // MIME type (optional)
  createdAt: Date;
  updatedAt: Date;
}
```
```

### Category
```typescript
{
  name: string;         // Required, unique
  description: string;  // Optional
  createdAt: Date;
  updatedAt: Date;
}
```

### Ingredient
```typescript
{
  name: string;         // Required, unique
  createdAt: Date;
  updatedAt: Date;
}
```

### Recipe
```typescript
{
  title: string;        // Required
  description: string;  // Optional
  user_id: ObjectId;    // Required, references User
  category_id: ObjectId; // Required, references Category
  createdAt: Date;
  updatedAt: Date;
}
```

### RecipeIngredient
```typescript
{
  recipe_id: ObjectId;     // Required, references Recipe
  ingredient_id: ObjectId; // Required, references Ingredient
  quantity: string;        // Required
  unit: string;            // Required
  createdAt: Date;
  updatedAt: Date;
}
```

**Note:** The combination of `recipe_id` and `ingredient_id` must be unique.

## Error Handling

The API uses a centralized error handling middleware. All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, missing required fields)
- `401` - Unauthorized (invalid or missing token, invalid credentials)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

**Error Response Examples:**
```json
{
  "success": false,
  "error": "Username and email are required"
}
```

```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

## Project Structure

```
foodiez-backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── authController.ts
│   │   ├── categoryController.ts
│   │   ├── ingredientController.ts
│   │   ├── recipeController.ts
│   │   ├── recipeIngredientController.ts
│   │   └── userController.ts
│   ├── middleware/        # Custom middleware
│   │   ├── authorize.ts
│   │   ├── errorHandler.ts
│   │   └── ...
│   ├── models/           # Mongoose models
│   │   ├── Category.ts
│   │   ├── Ingredient.ts
│   │   ├── Recipe.ts
│   │   ├── RecipeIngredient.ts
│   │   ├── User.ts
│   │   └── index.ts
│   ├── routers/          # Route definitions
│   │   ├── authRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── ingredientRoutes.ts
│   │   ├── recipeRoutes.ts
│   │   ├── recipeIngredientRoutes.ts
│   │   └── userRoutes.ts
│   ├── type/             # TypeScript type definitions
│   └── index.ts          # Application entry point
├── dist/                 # Compiled JavaScript (generated)
├── node_modules/         # Dependencies
├── package.json
├── tsconfig.json
├── Foodiez_API.postman_collection.json
└── README.md
```

## Postman Collection

A complete Postman collection is included in the repository (`Foodiez_API.postman_collection.json`). 

To use it:
1. Import the collection into Postman
2. Update the `base_url` variable to match your server URL (default: `http://localhost:3000`)
3. Start testing the API endpoints

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/foodiez` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-secret-key-change-in-production` |
| `JWT_EXPIRE` | JWT token expiration time | `7d` |

## Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build first)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

