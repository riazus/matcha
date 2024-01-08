# Build stage
FROM node:alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .

# Runtime stage
FROM node:alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
CMD [ "npm", "run", "start" ]