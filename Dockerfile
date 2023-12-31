FROM node:18

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev


ENV PORT=80

EXPOSE 80

COPY . .

#CMD ["npm", "run", "start"]
CMD ./deploy.sh
