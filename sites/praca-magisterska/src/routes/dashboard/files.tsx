import FileBrowserWindow from '#/components/files/FileBrowserWindow'
import { FolderUpdateEvent } from '#/enums/FolderUpdateEvent'
import type { Genres } from '#/generated/appwrite/types'
import { GetFolders } from '#/lib/database/services/FolderService'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/dashboard/files')({
  component: RouteComponent,
})

function RouteComponent() {
  const [folders, setFolders] = useState<Genres[] | null>(null)
  const [event, setEvent] = useState<FolderUpdateEvent | null>(null)

  useEffect(() => {
    if (event !== FolderUpdateEvent.Select) {
      GetFolders().then((v) => setFolders(v))
    }
  }, [event])

  return (
    <div className="flex grow flex-col">
      <FileBrowserWindow folders={folders} onFolderModify={setEvent} />
    </div>
  )
}
