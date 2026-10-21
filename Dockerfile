FROM node:20-alpine
WORKDIR /app
COPY package.json index.js glama.json ./
RUN chmod +x index.js
ENTRYPOINT ["node", "index.js"]
