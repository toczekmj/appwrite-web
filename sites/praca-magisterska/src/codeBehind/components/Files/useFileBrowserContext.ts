import { useEffect, useMemo, useState } from "react";
import { DeleteFile, GetFiles } from "#/lib/database/services/FileService";
import { useAuth } from "#/components/auth/AuthContext";
import { ExecuteFftInBackground } from "#/lib/functions/functions";
import { IsComputationOngoing } from "#/lib/database/services/FolderService";
import type { Files } from "#/generated/appwrite/types";

function useFileBrowserContext(folderId: string | null) {
	const [files, setFiles] = useState<Files[]>([]);
	const [loading, setLoading] = useState(false);
	const { currentUserInfo } = useAuth();

	const computedCount = useMemo(() => {
		return files.reduce((acc, file) =>
			acc + (file.data_file_id !== null && file.data_file_id !== undefined && file.data_file_id !== "" ? 1 : 0), 0);
	}, [files]);

	const filesCount = useMemo(() => files.length, [files]);
	const [isComputing, setIsComputing] = useState<boolean>(false);

	useEffect(() => {
		if (!folderId) {
			setFiles([]);
			return;
		}
		fetchFiles();
	}, [folderId]);

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

	const handleUploadComplete = () => {
		fetchFiles();
	}

	const deleteFile = async (id: string) => {
		const file = files.find(f => f.$id === id)!;
		try {
			const newFiles = files.filter((f) => f.$id !== id);
			setFiles(newFiles);
			await DeleteFile(id);
		}
		catch (error) {
			// TODO: handle this error properly
			setFiles(prev => [...prev, file])
		}
	}

	const computeFiles = async () => {
		if (folderId && currentUserInfo) {
			// optimistic UI: disable button immediately
			setIsComputing(true);
			try {
				const res = await ExecuteFftInBackground(folderId, currentUserInfo.$id);
				console.log(res);
			} catch (err) {
				console.error(err);
				// re-check actual status if background invocation failed
				const ongoing = await IsComputationOngoing(folderId).catch(() => false);
				setIsComputing(ongoing);
			}
		}
	}

	return {
		files,
		setFiles,
		loading,
		setLoading,
		fetchFiles,
		handleUploadComplete,
		deleteFile,
		currentUserInfo,
		computeFiles,
		computedCount,
		filesCount,
		isComputing,
	}
}

export {
	useFileBrowserContext,
}
