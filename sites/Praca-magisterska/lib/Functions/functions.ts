import {functions} from "../appwrite";
import {Models} from "appwrite";


export {
    ExecuteFft,
}

async function ExecuteFft(genre: string, session: string | undefined) {
    return await functions.createExecution({
        functionId: "fft",
        body: `{"genre": "${genre}", "session": "${session}"}`,
        async: false
    });
}
