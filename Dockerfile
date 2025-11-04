# my-chatbot-backend/Dockerfile.dev
# This Dockerfile is specifically for DEVELOPMENT

FROM node:20-slim

WORKDIR /app

# Copy package files to leverage Docker cache
COPY package*.json ./

# Install ALL dependencies, including devDependencies
RUN npm install

# Build node application
RUN npm run build
# The rest of the source code will be mounted via docker-compose volume,
# but it's good practice to copy it in.
COPY . .

EXPOSE 5000

# The default command to run for development
CMD ["npm", "run", "start"]