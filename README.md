# Foodiez API

A comprehensive RESTful API backend for a recipe management application. This API provides authentication, user management, recipe creation, ingredient tracking, and image upload capabilities. Built with modern technologies for scalability and maintainability.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Frontend Developer Guide](#frontend-developer-guide)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 📖 Project Description

Foodiez API is a backend service designed to power recipe management applications. It enables users to:

- **Create and manage accounts** with secure authentication
- **Upload profile and recipe images** stored directly in MongoDB
- **Create, organize, and share recipes** with detailed information
- **Manage ingredients** and link them to recipes with quantities
- **Categorize recipes** for better organization
- **Filter and search** recipes by user, category, or ingredients

The API follows RESTful principles and uses JWT-based authentication for secure access to protected resources.

## 🛠 Tech Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.9
- **Database**: MongoDB with Mongoose ODM

### Key Libraries
- **Authentication**: JWT (jsonwebtoken) with bcrypt password hashing
- **File Upload**: Multer for handling multipart/form-data
- **Middleware**: 
  - CORS for cross-origin requests
  - Morgan for HTTP request logging
  - dotenv for environment configuration

### Development Tools
- TypeScript for type safety
- ts-node-dev for hot-reload development
- Postman collection for API testing

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration, login, and token-based access
- 👥 **User Management** - Complete CRUD operations with profile image support
- 🍳 **Recipe Management** - Create, update, delete recipes with images
- 📁 **Category System** - Organize recipes into categories
- 🥘 **Ingredient Tracking** - Manage ingredients and link them to recipes
- 🔗 **Recipe Ingredients** - Associate ingredients with quantities and units
- 🖼️ **Image Storage** - Profile and recipe images stored as base64 in MongoDB
- 🔍 **Advanced Filtering** - Filter recipes by user, category, or ingredients
- 🔒 **Protected Routes** - JWT middleware for route protection
- ✅ **Error Handling** - Centralized error handling with meaningful messages
- 📝 **Request Logging** - HTTP request logging for debugging

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foodiez-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example.txt` to `.env`:
   ```bash
   cp .env.example.txt .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/foodiez
   # Or MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodiez?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   # Linux/Mac
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 mongo
   ```

5. **Run the application**
   ```bash
   # Development mode (with hot-reload)
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

The API will be available at `http://localhost:3000`

## 👨‍💻 Frontend Developer Guide

This section provides everything frontend developers need to integrate with the Foodiez API.

### Base URL Configuration

**For Development:**
```
http://localhost:3000
```

**For Production:**
```
http://134.122.96.197:3000
# Or your production domain
```

### Environment Setup

Create a `.env` file in your frontend project:

**Vite:**
```env
VITE_API_URL=http://localhost:3000
```

**React (Create React App):**
```env
REACT_APP_API_URL=http://localhost:3000
```

**Next.js:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### API Client Setup

#### Using Fetch API

```javascript
// config.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// api.js
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  
  return response.json();
};
```

#### Using Axios (Recommended)

```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Authentication Flow

#### 1. Register a New User

```javascript
const register = async (username, email, password) => {
  const response = await api.post('/api/auth/register', {
    username,
    email,
    password,
  });
  
  // Store token
  localStorage.setItem('token', response.data.data.token);
  return response.data;
};
```

#### 2. Login

```javascript
const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  
  // Store token
  localStorage.setItem('token', response.data.data.token);
  return response.data;
};
```

#### 3. Get Current User

```javascript
const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data.data;
};
```

#### 4. Logout

```javascript
const logout = async () => {
  localStorage.removeItem('token');
  // Optionally call logout endpoint
  await api.post('/api/auth/logout');
};
```

### React Authentication Hook Example

```jsx
// useAuth.js
import { useState, useEffect } from 'react';
import api from './api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/me')
        .then((res) => {
          setUser(res.data.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, logout };
};
```

### Image Upload Examples

#### Upload Profile Image

```javascript
const uploadProfileImage = async (userId, file) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  
  const response = await api.post(
    `/api/users/${userId}/profile-image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};
```

#### Upload Recipe Image

```javascript
const uploadRecipeImage = async (recipeId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post(
    `/api/recipes/${recipeId}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};
```

#### Display Images

```jsx
// React component
<img 
  src={user.profileImage || '/default-avatar.png'} 
  alt="Profile" 
/>

<img 
  src={recipe.image || '/default-recipe.png'} 
  alt={recipe.title} 
/>
```

### Common API Patterns

#### Creating a Recipe

```javascript
const createRecipe = async (recipeData) => {
  const response = await api.post('/api/recipes', {
    title: recipeData.title,
    description: recipeData.description,
    user_id: recipeData.userId,
    category_id: recipeData.categoryId,
  });
  return response.data;
};
```

#### Filtering Recipes

```javascript
// Get recipes by user
const getUserRecipes = async (userId) => {
  const response = await api.get(`/api/recipes?user_id=${userId}`);
  return response.data;
};

// Get recipes by category
const getCategoryRecipes = async (categoryId) => {
  const response = await api.get(`/api/recipes?category_id=${categoryId}`);
  return response.data;
};
```

#### Error Handling

```javascript
try {
  const response = await api.get('/api/recipes');
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('API Error:', error.response.data.error);
  } else if (error.request) {
    // Request made but no response
    console.error('Network Error:', error.message);
  } else {
    // Something else happened
    console.error('Error:', error.message);
  }
}
```

### CORS Configuration

The API has CORS enabled. For production, ensure your frontend domain is whitelisted. Contact the backend team to add your domain to the allowed origins.

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3000
Production: http://134.122.96.197:3000
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | No |
| GET | `/api/users/:id` | Get user by ID | No |
| POST | `/api/users` | Create user | No |
| PUT | `/api/users/:id` | Update user | No |
| DELETE | `/api/users/:id` | Delete user | No |
| POST | `/api/users/:id/profile-image` | Upload profile image | No |
| DELETE | `/api/users/:id/profile-image` | Delete profile image | No |

### Recipe Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/recipes` | Get all recipes (supports `?user_id=` and `?category_id=` query params) | No |
| GET | `/api/recipes/:id` | Get recipe by ID | No |
| POST | `/api/recipes` | Create recipe | No |
| PUT | `/api/recipes/:id` | Update recipe | No |
| DELETE | `/api/recipes/:id` | Delete recipe | No |
| POST | `/api/recipes/:id/image` | Upload recipe image | No |
| DELETE | `/api/recipes/:id/image` | Delete recipe image | No |

### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | No |
| GET | `/api/categories/:id` | Get category by ID | No |
| POST | `/api/categories` | Create category | No |
| PUT | `/api/categories/:id` | Update category | No |
| DELETE | `/api/categories/:id` | Delete category | No |

### Ingredient Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/ingredients` | Get all ingredients | No |
| GET | `/api/ingredients/:id` | Get ingredient by ID | No |
| POST | `/api/ingredients` | Create ingredient | No |
| PUT | `/api/ingredients/:id` | Update ingredient | No |
| DELETE | `/api/ingredients/:id` | Delete ingredient | No |

### Recipe Ingredient Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/recipe-ingredients` | Get all recipe ingredients (supports `?recipe_id=` and `?ingredient_id=` query params) | No |
| GET | `/api/recipe-ingredients/:id` | Get recipe ingredient by ID | No |
| GET | `/api/recipe-ingredients/recipe/:recipe_id` | Get all ingredients for a recipe | No |
| POST | `/api/recipe-ingredients` | Create recipe ingredient | No |
| PUT | `/api/recipe-ingredients/:id` | Update recipe ingredient | No |
| DELETE | `/api/recipe-ingredients/:id` | Delete recipe ingredient | No |

## 🔐 Authentication

### How It Works

1. **Register/Login**: User provides credentials and receives a JWT token
2. **Token Storage**: Store token in `localStorage` or secure storage
3. **Authenticated Requests**: Include token in `Authorization` header
4. **Token Expiration**: Tokens expire after 7 days (configurable)

### Request Format

```javascript
// Include token in Authorization header
headers: {
  'Authorization': 'Bearer <your-jwt-token>'
}
```

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 📊 Data Models

### User
```typescript
{
  _id: string;
  username: string;              // Required, unique
  email: string;                 // Required, unique
  password: string;              // Hashed, not returned in responses
  profileImage?: string;         // Base64 data URI
  profileImageContentType?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Recipe
```typescript
{
  _id: string;
  title: string;                // Required
  description?: string;
  user_id: ObjectId;            // Required, references User
  category_id: ObjectId;         // Required, references Category
  image?: string;                // Base64 data URI
  imageContentType?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
{
  _id: string;
  name: string;                 // Required, unique
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Ingredient
```typescript
{
  _id: string;
  name: string;                 // Required, unique
  createdAt: Date;
  updatedAt: Date;
}
```

### RecipeIngredient
```typescript
{
  _id: string;
  recipe_id: ObjectId;          // Required, references Recipe
  ingredient_id: ObjectId;      // Required, references Ingredient
  quantity: string;             // Required (e.g., "2", "1.5")
  unit: string;                 // Required (e.g., "cups", "tablespoons")
  createdAt: Date;
  updatedAt: Date;
}
```

**Note:** The combination of `recipe_id` and `ingredient_id` must be unique.

## ⚠️ Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### Common Errors

**Validation Error:**
```json
{
  "success": false,
  "error": "Username and email are required"
}
```

**Authentication Error:**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Authorization Error:**
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

**Not Found Error:**
```json
{
  "success": false,
  "error": "Recipe not found"
}
```

## 🚢 Deployment

### Environment Variables

Required environment variables for production:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodiez
JWT_SECRET=your-strong-secret-key-minimum-32-characters
JWT_EXPIRE=7d
NODE_ENV=production
```

### Build for Production

```bash
npm run build
npm start
```

### Using PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start dist/index.js --name foodiez-api
pm2 save
pm2 startup
```

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📦 Project Structure

```
foodiez-backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── recipeController.ts
│   │   ├── categoryController.ts
│   │   ├── ingredientController.ts
│   │   └── recipeIngredientController.ts
│   ├── middleware/           # Custom middleware
│   │   ├── authorize.ts      # JWT authentication
│   │   ├── errorHandler.ts   # Error handling
│   │   └── upload.ts         # File upload handling
│   ├── models/              # Mongoose models
│   │   ├── User.ts
│   │   ├── Recipe.ts
│   │   ├── Category.ts
│   │   ├── Ingredient.ts
│   │   ├── RecipeIngredient.ts
│   │   └── index.ts
│   ├── routers/             # Route definitions
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── recipeRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── ingredientRoutes.ts
│   │   └── recipeIngredientRoutes.ts
│   ├── type/                # TypeScript types
│   │   └── http.ts
│   └── index.ts             # Application entry point
├── dist/                    # Compiled JavaScript (generated)
├── .env.example.txt         # Environment variables template
├── Foodiez_API.postman_collection.json  # Postman collection
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

### Postman Collection

A complete Postman collection is included (`Foodiez_API.postman_collection.json`). 

**To use:**
1. Import the collection into Postman
2. Update the `base_url` variable to match your server URL
3. Start testing endpoints

### Manual Testing

```bash
# Health check
curl http://localhost:3000/

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## 📝 Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build first)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Happy Coding! 🚀**
