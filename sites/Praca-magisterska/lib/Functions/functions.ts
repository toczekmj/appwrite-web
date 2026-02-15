import {functions, tablesDb} from "../appwrite";


export {
    ExecuteFft,
    ExecuteFftInBackground
}

async function ExecuteFft(genre: string, session: string) {
    return await functions.createExecution({
        functionId: "fft",
        body: `{"file": "${genre}", "jwt": "${session}", "background": "false"}`,
        async: false
    });
}


async function ExecuteFftInBackground(fileId: string, userId: string) {
    console.log("Executing FFT in background with fileId:", fileId, "and userId:", userId);
    const response = await functions.createExecution({
        functionId: "FFT",
        body: `{"file_id": "${fileId}", "user_id": "${userId}"}`,
        async: true
    })
    return response.responseBody;
}


