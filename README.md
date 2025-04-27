# Todo App

A modern, user-friendly todo list application designed for efficient task management with intuitive interface and enhanced user experience.

## Key Features

- Drag-and-drop task reordering
- Floating editor for detailed task management
- Responsive design with adaptive UI elements
- Priority and styling customization
- Light and dark mode support
- Confirmation dialog for task deletion

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Deployment to Render.com

This application is configured for deployment on Render.com, which provides a seamless hosting experience with automatic deployments.

### Deployment Using render.yaml (Recommended)

This repository includes a `render.yaml` file that simplifies the deployment process:

1. Create an account on [Render.com](https://render.com/)
2. Connect your GitHub repository
3. Click "New" and select "Blueprint" to deploy using the render.yaml configuration
4. Render will automatically set up the services defined in the render.yaml file

### Manual Deployment

Alternatively, you can deploy manually:

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the service with the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: (if using a database)
     - `PORT`: `5000`

### Database Setup (Optional)

If you're using the PostgreSQL database features:

1. Create a PostgreSQL database on Render.com or your preferred provider
2. Add the `DATABASE_URL` environment variable with your connection string
3. Run database migrations using the Render.com console or during the build process

## License

MIT