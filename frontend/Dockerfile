# Build frontend dist
FROM node:21 
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve dist
RUN npm install --global http-server
EXPOSE 8080
CMD ["http-server", "./dist"]
