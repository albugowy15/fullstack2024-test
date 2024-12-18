import fastify, { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { AppInstance } from "./types";
import { AppError } from "./utils/error";
import fastifyEnv from "@fastify/env";
import { envSchema } from "./env";
import cors from "@fastify/cors";
import { DatabaseConnection } from "./db/connection";
import { clientRoutes } from "./modules/client/client.route";
import { createClient } from "@redis/client";

const bootstrapAppPlugin: FastifyPluginAsync = fp(async (fastify, _opts) => {
  const conn = new DatabaseConnection(fastify.env.DATABASE_URL);
  const redisClient = createClient();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();
  fastify.decorate("db", conn.db);
  fastify.decorate("redis", redisClient);
});

export async function bootstrapServer() {
  const app: AppInstance = fastify({ logger: true });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.httpCode).send({
        success: false,
        message: error.message,
        error: error.error,
      });
    } else {
      reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message,
        message: "Unknown Error",
      });
    }
  });
  app.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({
      success: false,
      message: "Not Found",
    });
  });

  app.decorateRequest("auth", null);

  await app.register(fastifyEnv, {
    confKey: "env",
    schema: envSchema,
  });
  app.register(bootstrapAppPlugin);
  await app.register(cors);

  app.register(clientRoutes);

  return app;
}
