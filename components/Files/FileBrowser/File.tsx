import {Avatar, Button, Text} from "@radix-ui/themes";
import {AudioLines, X} from "lucide-react";
import {DeleteSingleFileFromFolder} from "@/lib/genresDb";


interface FileProps {
    name: string,
    id: string,
}

export default function File({name, id}: FileProps) {

    async function deleteFile() {
        await DeleteSingleFileFromFolder(id);
    }

    return (
        <div className={"flex flex-row outline-1 outline-gray-400 rounded-sm p-2 gap-5 justify-between items-center flex-wrap wrap-anywhere"}>
            <Avatar fallback={
                <AudioLines/>
            }/>

            <Text size={"3"}>{name}</Text>
            <Button size={"2"} color={"red"} onClick={deleteFile}>
                <X/>
            </Button>

        </div>
    );
}