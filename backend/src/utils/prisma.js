const { PrismaClient } = require("@prisma/client");
const { PrismaTiDBCloud } = require("@tidbcloud/prisma-adapter");

const username = process.env.DB_USERNAME || process.env.MYSQLUSER;
const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
const host = process.env.DB_HOST || process.env.MYSQLHOST;
const port = process.env.DB_PORT || process.env.MYSQLPORT || 4000;
const database = process.env.DB_DATABASE || process.env.MYSQLDATABASE;

const databaseUrl =
  `mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${database}?sslaccept=strict`;

const adapter = new PrismaTiDBCloud({
  url: databaseUrl
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;