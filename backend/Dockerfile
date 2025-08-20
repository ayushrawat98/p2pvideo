# backend/Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install ffmpeg & other dependencies
RUN apk add --no-cache ffmpeg

# Copy source code
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
