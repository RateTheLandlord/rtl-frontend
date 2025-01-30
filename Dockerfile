# Use the official Bun image
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base

ARG PORT=3000 # Default value if no PORT is provided
ENV PORT=$PORT

# Set working directory
WORKDIR /usr/src/app

# Create app directory
RUN mkdir -p /app

# Set /app as the working directory
WORKDIR /app

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package.json and package-lock.json
COPY package*.json /app/

# Install dependencies
RUN bun install

# Copy the rest of the app files into /app
COPY . /app

# Set environment variables

# Build the Next.js app
RUN bun run build

# Expose the app port
EXPOSE ${PORT}

# Start the app
CMD ["bun", "run", "start"]
