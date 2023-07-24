# Stage 1: Build the Angular application
FROM node:18.16-alpine AS build

WORKDIR /app

# Copy the package.json and package-lock.json files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire application to the container
COPY . .

# Build the Angular application in production mode
RUN npm run build

# Stage 2: Create the production-ready container
FROM nginx:alpine

# Copy the build artifacts from the previous stage to the Nginx public directory
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/lead-manager-web /usr/share/nginx/html

# The default Nginx port, change if needed
#EXPOSE 80

# Start Nginx when the container is run
#CMD ["nginx", "-g", "daemon off;"]