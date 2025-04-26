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

## Deployment to GitHub Pages

### Automated Deployment (using GitHub Actions)

This repository includes a GitHub Actions workflow configuration in `.github/workflows/deploy.yml` that automatically deploys the app to GitHub Pages when changes are pushed to the main branch.

To enable automated deployment:

1. Go to your GitHub repository settings
2. Enable GitHub Pages from the "Pages" section
3. Set the source to "GitHub Actions"

### Manual Deployment

Alternatively, you can deploy manually using the included script:

1. Make the script executable: `chmod +x deploy.sh`
2. Run the deployment script: `./deploy.sh`
3. Follow the instructions shown in the terminal

## License

MIT