import {Card, Separator, Text} from "@radix-ui/themes";
import UploadFilesDialog from "@/components/Files/FileBrowser/Dialogs/UploadFilesDialog";
import File from "@/components/Files/FileBrowser/File";
import {FileColumns} from "@/lib/Database/Enums/FileColumns";
import {useFileBrowserContext} from "@/CodeBehind/Components/Files/useFileBrowserContext";


interface FileBrowserProps {
    folderId: string | null;
}

export default function FileBrowser({folderId}: FileBrowserProps) {
    const ctx = useFileBrowserContext(folderId);

    return (
        <Card>
            <div className={"flex flex-col gap-1 h-133"}>
                <div className={"flex flex-row justify-between items-center"}>
                    <Text size={"5"}>Files</Text>
                    {
                        folderId ? (
                            <UploadFilesDialog onClose={ctx.handleUploadComplete} folderId={folderId}/>
                        ) : <></>
                    }
                </div>

                <Separator size={"4"}/>
                {
                    !folderId ? (
                        <Text size={"4"}>Select folder to show files</Text>
                    ) : ctx.loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <div className="w-full grow p-1 overflow-y-scroll">
                            <div className="flex flex-col gap-1.5">
                                {
                                    ctx.files.map((file, index) => {
                                        return (
                                            <File key={index} onDelete={ctx.deleteFile} name={file[FileColumns.FileName]} id={file.$id}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </Card>
    );
}