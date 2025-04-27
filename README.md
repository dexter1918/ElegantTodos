# Elegant Todo App

A modern, user-friendly todo list application designed for efficient task management with MongoDB integration and productivity features.

## Key Features

- Drag-and-drop task reordering
- Floating editor for detailed task management
- Dark and light mode theming
- Priority marking and due dates
- MongoDB integration with local storage fallback
- Category organization and filtering
- Smart search functionality across task text, notes, and categories
- Confirmation dialog for task deletion
- Connection status indicator

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update the MongoDB connection string
4. Start the development server: `npm run dev`

## Environment Variables

This application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ElegantTodosDB
```

**IMPORTANT: Never commit your `.env` file to version control. It is already added to `.gitignore`.**

## MongoDB Setup

This application uses MongoDB Atlas with a dual-collection structure:
- ActiveTasks: Stores incomplete tasks
- CompletedTasks: Stores completed tasks

When setting up your MongoDB database:
1. Create a MongoDB Atlas account if you don't have one
2. Create a new cluster
3. Create a database named "ElegantTodosDB"
4. The collections will be created automatically by the application

## Deployment to Render

The application is designed for easy deployment on Render as a Web Service:

### Single Service Deployment (Recommended)

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Add Environment Variables:
     - `NODE_ENV`: `production`
     - `MONGODB_URI`: (your secure MongoDB connection string)

### Security Best Practices

- **Never commit credentials to your repository**
- Use environment variables for all sensitive information
- Create a dedicated MongoDB user with appropriate permissions
- Set IP restrictions on your MongoDB Atlas cluster
- Regularly rotate your MongoDB password

## License

MIT