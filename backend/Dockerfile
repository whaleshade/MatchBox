# Use the official Node.js LTS image as the base image
FROM node:18.16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install bcrypt again to ensure compatibility
RUN npm rebuild bcrypt --build-from-source


# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the application's port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
