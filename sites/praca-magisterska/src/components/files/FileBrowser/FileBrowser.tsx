import { Button, Card, Separator, Text } from "@radix-ui/themes";
import UploadFilesDialog from "#/components/files/FileBrowser/Dialogs/UploadFilesDialog";
import File from "#/components/files/FileBrowser/File";
import { useFileBrowserContext } from "#/codeBehind/components/Files/useFileBrowserContext";

interface FileBrowserProps {
	folderId: string | null;
}

export default function FileBrowser({ folderId }: FileBrowserProps) {
	const ctx = useFileBrowserContext(folderId);

	return (
		<Card>
			<div className={"flex flex-col gap-1 h-133"}>
				<div className={"flex flex-row justify-between items-center"}>
					<Text size={"5"}>Files</Text>

					{folderId ? (
						<div className="flex flex-row gap-4">
							<Text size={"5"}>
								Computed: {ctx.computedCount}/{ctx.filesCount}
							</Text>
							<Button disabled={ctx.isComputing} variant="outline" onClick={ctx.computeFiles}>Compute all</Button>
						</div>
					) : (
						<></>
					)}

					{folderId ? (
						<UploadFilesDialog
							onClose={ctx.handleUploadComplete}
							folderId={folderId}
						/>
					) : (
						<></>
					)}
				</div>

				<Separator size={"4"} />
				{!folderId ? (
					<Text size={"4"}>Select folder to show files</Text>
				) : ctx.loading ? (
					<Text>Loading...</Text>
				) : (
					<div className="w-full grow p-1 overflow-y-scroll">
						<div className="flex flex-col gap-1.5">
							{ctx.files.map((file, index) => {
								return (
									<File
										key={index}
										onDelete={ctx.deleteFile}
										name={file.FileName}
										id={file.$id}
										isComputed={
											file.data_file_id !== null &&
											file.data_file_id !== undefined &&
											file.data_file_id !== ""
										}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
