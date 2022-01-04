# syntax=docker/dockerfile:1

FROM node:14.9.0
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
RUN npm run build
COPY . .

# FROM node:14.9.0-alpine
# WORKDIR /app
# COPY --from=builder /app ./

CMD [ "npm", "run", "start:prod" ]