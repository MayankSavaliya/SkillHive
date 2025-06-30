# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the server code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the server
CMD ["node", "index.js"]
