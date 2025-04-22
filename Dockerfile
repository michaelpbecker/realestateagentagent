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

# Ensure theme.json exists in client directory
RUN test -f client/theme.json || (echo "theme.json not found in client directory" && exit 1)

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from build stage
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/shared/dist ./shared/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "server/dist/index.js"] 