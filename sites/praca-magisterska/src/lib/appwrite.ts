import { ENDPOINT, PROJECT_ID } from "#/generated/appwrite/constants";
import { Client, Account, Functions, TablesDB, Storage } from "appwrite"

const client = new Client();

client
	.setEndpoint(ENDPOINT)
	.setProject(PROJECT_ID);

export { client };
export const account = new Account(client);
export const functions = new Functions(client);
export const tablesDb = new TablesDB(client);
export const storage = new Storage(client);
