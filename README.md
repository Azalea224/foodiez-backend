# Foodiez API

A RESTful API for managing recipes, ingredients, categories, and users. Built with Express.js, TypeScript, and MongoDB.

## Features

- 🍳 **Recipe Management** - Create, read, update, and delete recipes
- 👥 **User Management** - Manage users who create recipes
- 📁 **Category Management** - Organize recipes by categories
- 🥘 **Ingredient Management** - Manage ingredients used in recipes
- 🔗 **Recipe Ingredients** - Link ingredients to recipes with quantities and units
- 🔍 **Filtering & Querying** - Filter recipes by user or category
- ✅ **Error Handling** - Comprehensive error handling middleware
- 📝 **Request Logging** - HTTP request logging with Morgan

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
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

3. Set up environment variables (optional):
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/foodiez
```

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

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
- **GET** `/` - Check if the API is running

### Users
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create a new user
- **PUT** `/api/users/:id` - Update a user
- **DELETE** `/api/users/:id` - Delete a user

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

## Request/Response Examples

### Create a User
**POST** `/api/users`
```json
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create a Category
**POST** `/api/categories`
```json
{
  "name": "Desserts",
  "description": "Sweet treats and desserts"
}
```

### Create an Ingredient
**POST** `/api/ingredients`
```json
{
  "name": "Flour"
}
```

### Create a Recipe
**POST** `/api/recipes`
```json
{
  "title": "Chocolate Chip Cookies",
  "description": "Delicious homemade chocolate chip cookies",
  "user_id": "60d5ec49f1b2c72b8c8e4f1a",
  "category_id": "60d5ec49f1b2c72b8c8e4f1b"
}
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

### Create a Recipe Ingredient
**POST** `/api/recipe-ingredients`
```json
{
  "recipe_id": "60d5ec49f1b2c72b8c8e4f1c",
  "ingredient_id": "60d5ec49f1b2c72b8c8e4f1d",
  "quantity": "2",
  "unit": "cups"
}
```

### Get Recipes Filtered by User
**GET** `/api/recipes?user_id=60d5ec49f1b2c72b8c8e4f1a`

### Get Recipes Filtered by Category
**GET** `/api/recipes?category_id=60d5ec49f1b2c72b8c8e4f1b`

## Data Models

### User
```typescript
{
  username: string;      // Required, unique
  email: string;         // Required, unique, lowercase
  createdAt: Date;
  updatedAt: Date;
}
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
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Project Structure

```
foodiez-backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── categoryController.ts
│   │   ├── ingredientController.ts
│   │   ├── recipeController.ts
│   │   ├── recipeIngredientController.ts
│   │   └── userController.ts
│   ├── middleware/        # Custom middleware
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

## Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build first)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

