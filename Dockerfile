# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build argument for API mock mode
ARG VITE_API_MOCK=false
ENV VITE_API_MOCK=${VITE_API_MOCK}

# Build application
RUN pnpm build

# Stage 2: Production stage
FROM node:22-alpine

WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy built static files from builder
COPY --from=builder /app/dist ./dist

# Set environment
ENV NODE_ENV=production
ENV PORT=80

# Expose port 80
EXPOSE 80

# Start serve (SPA mode)
CMD ["serve", "-s", "dist", "-l", "80"]
