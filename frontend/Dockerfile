# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./
RUN npm install

# Copy all source files and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for container
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
