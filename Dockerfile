# Use Node.js LTS version
FROM node:20-alpine

# Install build dependencies and curl for healthcheck
RUN apk add --no-cache curl

# Create app directory
WORKDIR /app

# Copy package.json files for both main app and client
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN cd client && npm run build

# Create directory for static files
RUN mkdir -p server/public
RUN cp -r client/dist/* server/public/

# Add entry point script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the port the app runs on
EXPOSE 10000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Use entrypoint to verify MongoDB connection before starting
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "production-server.cjs"]