import {functions, tablesDb} from "../appwrite";


export {
    ExecuteFftInBackground
}

async function ExecuteFftInBackground(folderId: string, userId: string) {
    console.log("Executing FFT in background with folderId:", folderId, "and userId:", userId);
    const response = await functions.createExecution({
        functionId: "transformallfilesinfolder",
        body: `{"folder_id": "${folderId}", "user_id": "${userId}"}`,
        async: true
    })
    return response.responseBody;
}


