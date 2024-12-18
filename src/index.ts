import "dotenv/config";
import { bootstrapServer } from "./server";

async function start() {
  const server = await bootstrapServer();
  try {
    await server.listen({ port: 5000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
