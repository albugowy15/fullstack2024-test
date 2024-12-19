# ASI Fullstack Test

## Requirements:

To run this project, make sure you already install:

- Node (20 or higher)
- Docker

## How to run

Create `.env` file by copying env content from `.env.example` file

```bash
cp .env.example .env
```

Run redis and postgres docker image

```bash
docker compose up -d db redis
```

Install all library

```bash
npm install
```

Run the fastify server

```bash

npm run dev
```

Done

## Available routes

- GET `/v1/clients`
- GET `/v1/clients/:slug`
- POST `/v1/clients`
- PUT `/v1/clients/:slug`
- DELETE `/v1/clients/:slug`

## ASI Teams
Selamat, kamu bisa ketahap selanjutnya, untuk interview User dan Tim HR (PSC)
