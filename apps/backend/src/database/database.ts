import { MongoClient } from "../deps.ts";

/**
 * Contains all the necessary methods for interacting with the databse such as
 * opening and closing a connection.
 */
export class Database {
  private client: MongoClient;

  constructor(
    public name: string,
    public url: string,
  ) {
    this.client = {} as MongoClient;
  }

  public async connect() {
    const client = new MongoClient();
    await client.connect(this.url);
    this.client = client;
  }

  public close() {
    this.client.close();
    this.client = {} as MongoClient;
  }

  public getDatabase() {
    return this.client.database(this.name);
  }
}
