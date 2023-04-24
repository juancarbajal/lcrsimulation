FROM node:17-slim
WORKDIR /node
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "build/index.js"]
# ENTRYPOINT ["node", "build/index.js"]
EXPOSE 3000
