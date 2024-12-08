FROM node:20 AS build-frontend
WORKDIR /app/ttos
COPY ttos/package*.json ./
RUN npm install
COPY ttos/ .
RUN npm run build

FROM node:20
WORKDIR /app/api

COPY api/package*.json ./
RUN npm install
COPY api/ .

COPY --from=build-frontend /app/ttos/dist ./public

ENV PORT=5000
EXPOSE 5000 5173

CMD ["sh", "-c", "npm run start & npx serve public -l 5173"]