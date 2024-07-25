FROM node:22-alpine
WORKDIR /app

ENV VITE_CACHE_DIR=/tmp/vite_cache
ENV VITE_BUILD_OUT_DIR=/tmp/dist

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run" , "dev"]