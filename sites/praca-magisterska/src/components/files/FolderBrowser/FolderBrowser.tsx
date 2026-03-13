import FolderButton from "#/components/files/FolderBrowser/FolderButton";
import {Button, Card, Separator, Text} from "@radix-ui/themes";
import CreateFolderDialog from "#/components/files/FolderBrowser/Dialogs/CreateFolderDialog";
import EditFolderDialog from "#/components/files/FolderBrowser/Dialogs/EditFolderDialog";
import useFolderBrowserContext, {type FolderBrowserProps} from "#/codeBehind/components/Files/useFolderBrowserContext";


export default function FolderBrowser(props : FolderBrowserProps) {
    const ctx = useFolderBrowserContext(props)

    return (
        <Card>
            <div className={"flex flex-col justify-between gap-3"}>
                <div className={"flex flex-col h-120 text-nowrap gap-1.5 overflow-y-scroll"}>
                    <Text size={"4"}>Folders</Text>
                    <Separator size={"4"}/>
                    {
                        ctx.folders ? (
                            ctx.folders.map((folder, index) => (
                                <FolderButton key={index}
                                              label={folder.ReadableName}
                                              selected={ctx.isSelectedFolder(folder.$id)}
                                              onFolderClick={() => ctx.onFolderSelect(folder.$id)}

                                />
                            ))
                        ) : <></>
                    }
                </div>

                <Separator size={"4"}/>

                <div className={"flex flex-row justify-around gap-3"}>
                    <CreateFolderDialog onAction={ctx.createFolder} />

                    <EditFolderDialog disabled={ctx.selectedFolder == null}
                                      onAction={ctx.editFolder}
                                      folderName={ctx.getSelectedFolderName()} />


                    <Button variant={"solid"}
                            color={"red"}
                            disabled={ctx.selectedFolder === null}
                            onClick={ctx.deleteFolder}
                    >[-]</Button>
                </div>
            </div>
        </Card>
    );
}