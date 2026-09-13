import "dotenv/config";

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

const databaseUrl =
  `mysql://${encodeURIComponent("username")}:${encodeURIComponent("password")}@${host}:${port}/${database}?sslaccept=strict`;

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
};