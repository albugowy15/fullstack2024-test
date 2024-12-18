export const envSchema = {
  type: "object",
  required: ["DATABASE_URL", "REDIS_URL"],
  properties: {
    DATABASE_URL: {
      type: "string",
    },
    REDIS_URL: {
      type: "string",
    },
  },
};
