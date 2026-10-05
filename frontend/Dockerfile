FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy application source
COPY . .

# Build Next.js application
RUN npm run build

# Start the application
CMD ["npm", "start"]

EXPOSE 3000
