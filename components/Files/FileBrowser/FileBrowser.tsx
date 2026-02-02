import {Card, Separator, Text} from "@radix-ui/themes";
import {Models} from "appwrite";
import {useEffect, useState} from "react";
import UploadFilesDialog from "@/components/Files/FileBrowser/Dialogs/UploadFilesDialog";
import File from "@/components/Files/FileBrowser/File";
import {DeleteFile, GetFiles} from "@/lib/Database/Files";


interface FileBrowserProps {
    folderId: string | null;
}

export default function FileBrowser({folderId}: FileBrowserProps) {
    const [files, setFiles] = useState<Models.DefaultRow[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            if (folderId) {
                const result = await GetFiles(folderId)
                setFiles(result);
            }
        } catch (error) {
            console.log(error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!folderId) {
            setFiles([]);
            return;
        }
        fetchFiles();
    }, [folderId]);

    const handleUploadComplete = () => {
        fetchFiles();
    }

    const deleteFile = async (id: string) => {
        try {
            await DeleteFile(id);
            const newFiles = files.filter((f) => f.$id !== id);
            setFiles(newFiles);
        }
        catch (error) {

        }
    }

    return (
        <Card>
            <div className={"flex flex-col min-w-100 gap-1 max-w-4xl"}>
                <div className={"flex flex-row justify-between items-center"}>
                    <Text size={"5"}>Files</Text>
                    {
                        folderId ? (
                            <UploadFilesDialog onClose={handleUploadComplete} folderId={folderId}/>
                        ) : <></>
                    }
                </div>

                <Separator size={"4"}/>
                {
                    !folderId ? (
                        <Text size={"4"}>Select folder to show files</Text>
                    ) : loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <div>
                            <div className="flex flex-col gap-1.5">
                                {
                                    files.map((file, index) => {
                                        return (
                                            <File key={index} onDelete={deleteFile} name={file["FileName"]} id={file.$id}/>
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