# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Install dependencies
RUN npm ci

# Copy source files
COPY client/ ./client/
COPY server/ ./server/
COPY shared/ ./shared/

# Verify theme.json exists
RUN test -f client/theme.json || (echo "theme.json not found in client directory" && exit 1)
RUN cp client/theme.json ./

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Create necessary directories
RUN mkdir -p dist/public server/dist shared/dist

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/shared/dist ./shared/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the application
CMD ["node", "server/dist/index.js"] 