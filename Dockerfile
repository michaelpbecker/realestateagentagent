# Build stage
FROM node:20-slim as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/server/dist ./server/dist

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Start the server
CMD ["node", "server/dist/index.js"] 