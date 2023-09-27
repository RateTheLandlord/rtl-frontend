FROM node:alpine

ARG NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}
ENV NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}

ARG API_URL=${API_URL}
ENV API_URL=${API_URL}

ARG NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

ARG ORIGIN_URL=${ORIGIN_URL}
ENV ORIGIN_URL=${ORIGIN_URL}}

ARG PORT=${PORT}
ENV PORT=${PORT}

# where our Next.js app will live
RUN mkdir -p /app

# Set /app as the working directory
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

# Copy package.json and package-lock.json
# to the /app working directory
COPY package*.json  /app/

# Install dependencies in /app
RUN npm ci

# Copy the rest of our Next.js folder into /app
COPY . /app

ENV NODE_ENV=production

# Build app
RUN npm run build

EXPOSE ${PORT}

# Run npm dev, as we would via the command line
CMD [ "npm", "run", "start" ]