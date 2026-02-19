import {Models} from "appwrite";
import {FolderUpdateEvent} from "@/Enums/FolderUpdateEvent";
import {useAuth} from "@/components/Auth/AuthContext";
import {FolderColumns} from "@/lib/Database/Enums/FolderColumns";
import {CreateFolder, DeleteFolder, UpdateFolder} from "@/lib/Database/Services/FolderService";

export interface FolderBrowserProps {
    folders: Models.DefaultRow[] | null;
    selectedFolder: string | null;
    onFolderSelect: (event: FolderUpdateEvent, folderId: string | null) => void;
}

function useFolderBrowserContext({selectedFolder, onFolderSelect, folders} : FolderBrowserProps) {
    const {currentUserInfo} = useAuth();

    const isSelectedFolder = (id: string) => {
        return selectedFolder === id;
    }

    async function deleteFolder() {
        // TODO: for some reason the order in which we execute
        // DeleteFolder() and onFolderSelect() matters
        // and this whole logic isn't the greatest - as this events are passed 
        // up to the page component.
        // I should probably refactor this later.
        if (selectedFolder) {
            await DeleteFolder(selectedFolder);
            folders = folders?.filter(row => row[FolderColumns.ID] != selectedFolder) ?? null;
            onFolderSelect(FolderUpdateEvent.Delete, null);
        }
    }

    async function createFolder(name: string | null){
        if (name == null || name == "") {
            console.error("Name is required");
            return;
        }

        const result = await CreateFolder(name, currentUserInfo?.$id ?? "");
        folders?.push(result);
        onFolderSelect(FolderUpdateEvent.Select, result[FolderColumns.ID]);
    }

    async function editFolder(name: string){
        if (name == "" || selectedFolder == null) {
            console.error("Name is required when editing folder");
            return;
        }

        const result = await UpdateFolder(selectedFolder, name);
        console.log(result);
        folders = folders?.filter(f => f.$id != selectedFolder) ?? null;
        folders?.push(result);
        onFolderSelect(FolderUpdateEvent.Update, selectedFolder)
    }

    function getSelectedFolderName() {
        const res = folders?.find(row => row.$id == selectedFolder);
        return res ? res[FolderColumns.ReadableName] : "";
    }

    return {
        isSelectedFolder,
        createFolder,
        editFolder,
        getSelectedFolderName,
        deleteFolder,
        onFolderSelect,
        folders,
        selectedFolder,
    }
}

export default useFolderBrowserContext;