FROM node:18

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev
RUN docker compose up -d --build

ENV PORT=80

EXPOSE 80

COPY . .
ENV ENV=prod
CMD ["npm", "run", "start"]
