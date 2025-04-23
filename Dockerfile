# Build stage
FROM node:20-slim as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Debug: List contents of build directories
RUN echo "Contents of /app/dist:" && ls -la /app/dist && \
    echo "\nContents of /app/dist/public:" && ls -la /app/dist/public && \
    echo "\nContents of /app/server/dist:" && ls -la /app/server/dist

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built files from build stage
COPY --from=build /app/dist/public ./dist/public
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/shared/dist ./shared/dist

# Debug: List contents of directories
RUN echo "Contents of /app:" && ls -la /app && \
    echo "\nContents of /app/dist:" && ls -la /app/dist && \
    echo "\nContents of /app/dist/public:" && ls -la /app/dist/public && \
    echo "\nContents of /app/server/dist:" && ls -la /app/server/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the server
CMD ["node", "--trace-warnings", "server/dist/index.js"] 