import { Models } from "@/Generated/appwrite/types";
import { DATABASE } from "@/Generated/appwrite/constants";
import { databases } from "@/Generated/appwrite/databases";

const database = databases.use(DATABASE).use("models");

export async function GetModels(): Promise<Models[]> {
    const response = await database.list(
        {
            queries: (q) =>  [q.select(['$id', 'name', 'feature_length', 'artifact_file_id', 'genre_names'])]
        }
    );

    console.log(response);
    return response.rows;
}