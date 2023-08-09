FROM node:alpine

ENV PORT 3000

# where our Next.js app will live
RUN mkdir -p /app

# Set /app as the working directory
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

# Copy package.json and package-lock.json
# to the /app working directory
COPY package*.json  /app/
COPY .env /app/
COPY node_modules /app/node_modules

# Copy the rest of our Next.js folder into /app
COPY . /app

EXPOSE 3000

# Run npm dev, as we would via the command line
CMD [ "npm", "run", "dev"]