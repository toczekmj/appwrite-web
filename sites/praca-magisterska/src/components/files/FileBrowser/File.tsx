import {Avatar, Button, Checkbox, Text} from "@radix-ui/themes";
import {AudioLines, X} from "lucide-react";


interface FileProps {
    name: string,
    id: string,
    onDelete: (id: string) => void,
    isComputed?: boolean
}

export default function File({name, id, onDelete, isComputed}: FileProps) {
    return (
        <div className={"flex flex-row outline-1 outline-gray-400 rounded-sm p-2 gap-5 justify-between items-center flex-wrap wrap-anywhere"}>
            <Avatar fallback={
                <AudioLines/>
            }/>

            <Text size={"3"}>{name}</Text>

            {
                <Checkbox disabled={true} checked={isComputed} />
            }
            <Button size={"2"} color={"red"} onClick={() => onDelete(id)}>
                <X/>
            </Button>

        </div>
    );
}