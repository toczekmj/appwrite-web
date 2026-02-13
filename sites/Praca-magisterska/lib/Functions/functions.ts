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
    const response = await functions.createExecution({
        functionId: "FFT",
        body: JSON.stringify({ file: fileId, jwt: token, background: false }),
        async: false
    })

    console.log("done")
    console.log(response.responseStatusCode);

    if (response.responseStatusCode === 201) {
        const data = JSON.parse(response.responseBody);
        const new_id = ID.unique();
        console.log(new_id)
        const r1 = await tablesDb.createRow({
            data: {
                "data": data
            },
            rowId: new_id,
            tableId: "transform_data",
            databaseId: "698b1344001fada58b06"
        });

        console.log(r1);

        const r2 = await tablesDb.updateRow({
            data: {
                "is_transformed": true,
                "transformData": new_id
            },
            rowId: fileId,
            tableId: "files",
            databaseId: "698b1344001fada58b06"
        })

        console.log(r2);



    }

    return response.responseBody;
}

async function CreateFftRow(data: number[]) {

}

