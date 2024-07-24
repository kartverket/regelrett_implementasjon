FROM node:22-alpine

COPY frontend/beCompliant/package.json .
RUN npm install
COPY frontend/beCompliant/. .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run" , "dev"]