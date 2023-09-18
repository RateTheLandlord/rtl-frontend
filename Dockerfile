FROM node:alpine

ENV PORT 3000

ENV NEXT_PUBLIC_CAPTCHA_SITE_KEY NEXT_PUBLIC_CAPTCHA_SITE_KEY

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

EXPOSE 3000

# Run npm dev, as we would via the command line
CMD [ "npm", "run", "start" ]