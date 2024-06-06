FROM node:22-alpine
WORKDIR /frontend/be-compliant
COPY . .
EXPOSE 3000
RUN npm install --legacy-peer-deps
CMD ["npm", "start"]