import { FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import { Kysely } from "kysely";
import { Database } from "./db/schema";
import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "@redis/client";

declare module "fastify" {
  interface FastifyInstance {
    db: Kysely<Database>;
    redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
    env: {
      DATABASE_URL: string;
      REDIS_URL: string;
    };
  }
}

export type AppInstance = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
>;
