import { MyClient } from "../../db/schema";
import { AppInstance } from "../../types";
import { sendInvalidResponse, sendSuccessResponse } from "../../utils/respone";

export async function clientRoutes(app: AppInstance) {
  app.get("/v1/clients", async (request, reply) => {
    const clients = await app.db
      .selectFrom("my_client")
      .where("deleted_at", "is", null)
      .selectAll("my_client")
      .execute();
    return reply.status(200).send(sendSuccessResponse(clients));
  });
  app.get("/v1/clients/:slug", async (request, reply) => {
    const param = request.params as { slug: string };
    const cached = await app.redis.get(param.slug);
    if (cached != null) {
      console.log("from cache");
      const cachedData = JSON.parse(cached);
      return reply.status(200).send(sendSuccessResponse(cachedData));
    }
    const client = await app.db
      .selectFrom("my_client")
      .where("my_client.slug", "=", param.slug)
      .where("deleted_at", "=", null)
      .executeTakeFirst();
    if (!client) {
      return reply.status(404).send(sendInvalidResponse("Not found"));
    }
    return reply.status(200).send(sendSuccessResponse(client));
  });
  app.post("/v1/clients", async (request, reply) => {
    const body = request.body as Omit<
      MyClient,
      "id" | "created_at" | "updated_at" | "deleted_at"
    >;
    const checkSlug = await app.db
      .selectFrom("my_client")
      .where("my_client.slug", "=", body.slug)
      .selectAll("my_client")
      .execute();
    if (checkSlug.length != 0) {
      return reply.status(400).send("Duplicate slug");
    }
    const insertedClient = await app.db
      .insertInto("my_client")
      .values({
        ...body,
        created_at: new Date(),
      })
      .returningAll()
      .execute();
    if (insertedClient) {
      await app.redis.set(body.slug, JSON.stringify(insertedClient));
    }
    return reply.status(200).send(sendSuccessResponse());
  });
  app.delete("/v1/clients/:slug", async (request, reply) => {
    const param = request.params as { slug: string };
    await app.db
      .updateTable("my_client")
      .where("my_client.slug", "=", param.slug)
      .set("deleted_at", new Date())
      .execute();
    await app.redis.del(param.slug);
    return reply.status(200).send(sendSuccessResponse());
  });
  app.put("/v1/clients/:slug", async (request, reply) => {
    const body = request.body as Omit<
      MyClient,
      "id" | "created_at" | "updated_at" | "deleted_at"
    >;
    const param = request.params as { slug: string };
    const checkSlug = await app.db
      .selectFrom("my_client")
      .where("my_client.slug", "=", body.slug)
      .selectAll("my_client")
      .execute();
    if (checkSlug.length != 0) {
      return reply.status(400).send("Duplicate slug");
    }
    const updatedClient = await app.db
      .updateTable("my_client")
      .where("slug", "=", param.slug)
      .set({
        ...body,
        updated_at: new Date(),
      })
      .returningAll()
      .execute();
    await app.redis.del(param.slug);
    if (updatedClient != null) {
      await app.redis.set(body.slug, JSON.stringify(updatedClient));
    }
    return reply.status(200).send(sendSuccessResponse());
  });
}
