import {FolderUpdateEvent} from "#/enums/FolderUpdateEvent";
import {useAuth} from "#/components/auth/AuthContext";
import {CreateFolder, DeleteFolder, UpdateFolder} from "#/lib/database/services/FolderService";
import type { Genres } from "#/generated/appwrite/types";

export interface FolderBrowserProps {
    folders: Genres[] | null;
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
            onFolderSelect(FolderUpdateEvent.Delete, null);
        }
    }

    async function createFolder(name: string | null){
        if (name == null || name == "") {
            console.error("Name is required");
            return;
        }

        const result = await CreateFolder(name, currentUserInfo?.$id ?? "");
        onFolderSelect(FolderUpdateEvent.Select, result.$id);
    }

    async function editFolder(name: string){
        if (name == "" || selectedFolder == null) {
            console.error("Name is required when editing folder");
            return;
        }

        await UpdateFolder(selectedFolder, name);
        folders = folders?.filter(f => f.$id != selectedFolder) ?? null;
        onFolderSelect(FolderUpdateEvent.Update, selectedFolder)
    }

    function getSelectedFolderName() {
        const res = folders?.find(row => row.$id == selectedFolder);
        return res ? res.ReadableName : "";
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