import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import Cursor from "pg-cursor";
import { types } from "pg";
import { Database } from "./schema";

types.setTypeParser(types.builtins.NUMERIC, (value) => {
  return parseFloat(value);
});

types.setTypeParser(types.builtins.INT8, (value) => {
  return parseInt(value, 10);
});

export class DatabaseConnection {
  readonly db: Kysely<Database>;

  constructor(private readonly connectionString: string) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionString: this.connectionString,
        max: 10,
      }),
      cursor: Cursor,
    });
    this.db = new Kysely<Database>({
      dialect,
    });
  }
}
