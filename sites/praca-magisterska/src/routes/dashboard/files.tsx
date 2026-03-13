import { useFoldersQuery } from '#/codeBehind/components/Files/useFoldersQuery'
import FileBrowserWindow from '#/components/files/FileBrowserWindow'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/files')({
  component: RouteComponent,
})

function RouteComponent() {
  const {data: folders, isLoading, isError, errorMessage} = useFoldersQuery();

  return (
    <div className="flex grow flex-col">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {errorMessage}</div>}
      {folders && <FileBrowserWindow folders={folders} />}
    </div>
  )
}
