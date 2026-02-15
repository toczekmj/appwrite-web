import {functions, tablesDb} from "../appwrite";
import {ID} from "appwrite";


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


async function ExecuteFftInBackground(fileId: string, token: string) {
    console.log("Executing FFT in background with fileId:", fileId, "and token:", token);
    const response = await functions.createExecution({
        functionId: "FFT",
        body: `{"file_id": "${fileId}", "user_id": "${token}"}`,
        async: true
    })
    console.log(response);

    return response.responseBody;
}

async function CreateFftRow(data: number[]) {

}

