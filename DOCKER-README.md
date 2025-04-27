# ElegantTodos Docker Deployment

This guide explains how to deploy ElegantTodos using Docker.

## Prerequisites

Before you begin, ensure you have the following installed:
- Docker
- Docker Compose

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ElegantTodosDB
```

Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB credentials.

## Build and Run

### Using Docker Compose (Recommended)

1. Build and start the container:
   ```bash
   docker-compose up -d
   ```

2. View logs:
   ```bash
   docker-compose logs -f
   ```

3. Stop the container:
   ```bash
   docker-compose down
   ```

### Using Docker Directly

1. Build the Docker image:
   ```bash
   docker build -t eleganttodos .
   ```

2. Run the container:
   ```bash
   docker run -d -p 10000:10000 --env-file .env --name eleganttodos eleganttodos
   ```

3. View logs:
   ```bash
   docker logs -f eleganttodos
   ```

4. Stop the container:
   ```bash
   docker stop eleganttodos
   ```

## Verify Deployment

Once the container is running, you can verify it's working correctly:

1. Check that the API is accessible:
   ```bash
   curl http://localhost:10000/api/todos
   ```

2. Open the web application in your browser:
   ```
   http://localhost:10000
   ```

## Troubleshooting

### MongoDB Connection Issues

If the container fails to start due to MongoDB connection issues:

1. Check your MongoDB URI in the `.env` file
2. Ensure your MongoDB instance is accessible from the Docker container
3. Check container logs for specific error messages:
   ```bash
   docker logs eleganttodos
   ```

### Build Issues

If the build fails:

1. Check that all necessary files are present
2. Verify Docker has access to the internet to download packages
3. Try cleaning Docker's cache:
   ```bash
   docker system prune -a
   ```

## Customizing the Container

### Changing the Port

To use a different port:

1. Update the `docker-compose.yml` file:
   ```yaml
   ports:
     - "8080:10000"  # Change 8080 to your preferred port
   ```

2. Or, when using Docker directly:
   ```bash
   docker run -d -p 8080:10000 --env-file .env eleganttodos
   ```

### Persistent Data

This container doesn't store data locally (it uses MongoDB). If you need to persist data, configure your MongoDB connection appropriately.

## Production Deployment Tips

For production environments:

1. Use a robust MongoDB setup with replication
2. Set up a reverse proxy in front of the container (Nginx, Traefik)
3. Configure proper security headers
4. Use Docker secrets for sensitive information rather than environment variables
5. Set up monitoring and logging solutions