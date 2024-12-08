FROM node:20

# FRONT
WORKDIR /app/ttos

COPY ttos/package*.json ./
RUN npm install
COPY ttos/ .

# BACK
WORKDIR /app/api

COPY api/package*.json ./
RUN npm install
COPY api/ .

# BASE
WORKDIR /app
COPY build-then-run.sh .
RUN chmod 777 build-then-run.sh

EXPOSE 5173 5000

CMD ["sh", "build-then-run.sh"]