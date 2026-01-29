interface FileProps {
    name: string,
    id: string,
}

export default function File({name, id}: FileProps) {

    return (
        // <Button variant={"outline"}>
            <div className={"flex flex-row outline-1 outline-gray-400 rounded-sm p-4"}>
                {id}
                {name}

            </div>
        // </Button>
    );
}