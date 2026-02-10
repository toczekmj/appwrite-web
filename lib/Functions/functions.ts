import { functions } from "../Database/appwrite";

export {
    ExecuteFft,
}

function ExecuteFft(fileId: string) {
  const promise = functions.createExecution({
    functionId: "fft",
    body: `{"fileId": "${fileId}"}`,
  });

  promise.then(
    function (response) {
      console.log(response); // Success
    },
    function (error) {
      console.log(error); // Failure
    },
  );
}
