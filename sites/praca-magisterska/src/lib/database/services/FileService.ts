import { DeleteFileFromBucket } from "#/lib/bucket/bucket";
import { databases } from "#/generated/appwrite/databases";
import { DATABASE } from "#/generated/appwrite/constants";
import type { ICache } from "#/lib/cache/ICache";
import type { Files } from "#/generated/appwrite/types";
import { defaultFileCache } from "#/lib/cache/InMemoryFileCache";


const database = databases.use(DATABASE).use('files');

export async function GetFile(fileId: string, fileCache: ICache<string, Files> = defaultFileCache) {
	const cachedFile = fileCache.getSingleItem(fileId);

	if (cachedFile) {
		return cachedFile;
	}

	const response = await database.list({
		queries: (q) => [q.equal("$id", fileId)]
	});

	if (response.rows.length > 1) {
		throw new Error("Error - there is more than 1 file with given id");
	}

	fileCache.addSingleItem(response.rows[0]);
	return response.rows[0];
}

export async function GetFiles(folderId: string, fileCache: ICache<string, Files> = defaultFileCache) {
	const cachedFiles = fileCache.get(folderId);
	if (cachedFiles) {
		return cachedFiles;
	}

	const response = await database.list({
		queries: (q) => [q.equal('genre', folderId)]
	});

	fileCache.add(response.rows);
	return response.rows;
}

export async function LinkFile(folderId: string, fileId: string, fileName: string, userId: string, fileCache: ICache<string, Files> = defaultFileCache) {
	const data = {
		"FileId": fileId,
		"FileName": fileName,
		"genre": folderId,
	};

	const createdFile = await database.create(data, {
		permissions: (permission, role) => [
			permission.write(role.user(userId)),
			permission.read(role.user(userId)),
			permission.update(role.user(userId)),
			permission.delete(role.user(userId))
		]
	})

	fileCache.addSingleItem(createdFile);
	return createdFile;
}

export async function DeleteFile(fileId: string, fileCache: ICache<string, Files> = defaultFileCache) {
	const file = await GetFile(fileId, fileCache);
	const hasCsvData = file.data_file_id;
	const hasFile = file.FileId;

	if (hasCsvData) {
		await DeleteFileFromBucket(file.data_file_id!)
	}

	if (hasFile) {
		await DeleteFileFromBucket(file.FileId)
	}

	await database.delete(fileId);
	fileCache.delete(fileId);
}
