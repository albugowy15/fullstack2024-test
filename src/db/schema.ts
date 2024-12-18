import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface MyClientTable {
  id: Generated<number>;
  name: string;
  slug: string;
  is_project: string;
  self_capture: string;
  client_prefix: string;
  client_logo: string;
  address: string | null;
  phone_number: string | null;
  city: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
}
export type MyClient = Selectable<MyClientTable>;
export type NewMyClient = Insertable<MyClientTable>;
export type MyClientUpdate = Updateable<MyClientTable>;

export interface Database {
  my_client: MyClientTable;
}
