import dotenv from "dotenv";

if (process.argv[2] != "MON" && process.argv[2] != "MEM") {
  console.log("Porfavor especificar el entorno: - MOM para mongodb | - MEM para memory");
  process.exit();
}

dotenv.config({
  path: process.argv[2] === "MON" ? "./.env.mongodb" : "./.env.memory",
});

export const entorno = {
  modo: process.argv[2],
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  callbackUrl: process.env.CALLBACKURL,
  persistence: process.env.PERSISTENCE,
};
