import {Client, Account, Functions, TablesDB, Storage} from "appwrite"

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const functions = new Functions(client);
export const tablesDb = new TablesDB(client);
export const storage = new Storage(client);


export { ID } from "appwrite"; 