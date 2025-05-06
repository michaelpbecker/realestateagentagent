# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --production

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/shared/dist ./shared/dist

# Create necessary directories and copy files
RUN mkdir -p /app/dist/public/assets && \
    mkdir -p /app/server/dist/shared && \
    mkdir -p /app/server/dist/public && \
    cp -r /app/shared/dist/* /app/server/dist/shared/ && \
    cp -r /app/dist/public/* /app/server/dist/public/

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the server
CMD ["node", "server/dist/server/index.js"] 