# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/tsconfig.json ./
COPY backend/src ./src

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/server.js"]
