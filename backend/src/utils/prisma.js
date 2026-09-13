const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT || 3306),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  ssl: {
  ca: require("fs").readFileSync(
    require("path").join(__dirname, "../../isrg-root-x1.pem"),
    "utf8"
  )
}
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;