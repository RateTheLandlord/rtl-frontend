FROM node:alpine

ENV PORT 3000

# where our Next.js app will live
RUN mkdir -p /app

# Set /app as the working directory
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

ENV NEXT_PUBLIC_ENVIRONMENT ${NEXT_PUBLIC_ENVIRONMENT}
ENV API_URL ${API_URL}
ENV ORIGIN_URL ${ORIGIN_URL}

RUN echo NEXT_PUBLIC_ENVIRONMENT API_URL ORIGIN_URL
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

EXPOSE 3000

# Run npm dev, as we would via the command line
CMD [ "npm", "run", "start" ]