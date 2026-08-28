# Dependencies
FROM oven/bun:1 AS deps

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile


# Build
FROM oven/bun:1 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .


ARG NEXT_PUBLIC_CAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_GMAPS_TOKEN
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_ORIGIN_URL
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_POSTHOG_KEY

ENV NEXT_PUBLIC_CAPTCHA_SITE_KEY=$NEXT_PUBLIC_CAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_GMAPS_TOKEN=$NEXT_PUBLIC_GMAPS_TOKEN
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_ORIGIN_URL=$NEXT_PUBLIC_ORIGIN_URL
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build


# Production
FROM oven/bun:1 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["bun", "server.js"]
