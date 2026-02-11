import {tablesDb} from "@/lib/appwrite";
import {ID, Models, Permission, Role} from "appwrite";

export {
    GetAsync,
    PostAsync,
    DeleteAsync,
    PatchAsync
}

function defaultPermissions(userId: string): string[] {
    return [
        Permission.read(Role.user(userId)),
        Permission.write(Role.user(userId)),
        Permission.delete(Role.user(userId))
    ]
}

async function DeleteAsync(dbId: string, tableId: string, rowId: string, transactionId?: string) {
    return await tablesDb.deleteRow({
        databaseId: dbId,
        rowId: rowId,
        tableId: tableId,
        transactionId: transactionId
    })
}

async function GetAsync(databaseId: string,
                               tableId: string,
                               queries?: string[],
                               transactionId?: string,
                               total?: boolean) {
    return await tablesDb.listRows({
        databaseId: databaseId,
        queries: queries,
        tableId: tableId,
        total: total,
        transactionId: transactionId
    })
}

 
async function PostAsync(
    databaseId: string,
    tableId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Partial<Models.Row> & Record<string, any>,
    userId: string,
    permissions: string[] = defaultPermissions(userId),
    transactionId?: string
) {
    return await tablesDb.createRow({
        data: data,
        databaseId: databaseId,
        permissions: permissions,
        rowId: ID.unique(),
        tableId: tableId,
        transactionId: transactionId
    })
}

async function PatchAsync(
    databaseId: string,
    tableId: string,
    rowId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: (Partial<Models.Row> & Record<string, any>) | undefined,
    permissions?: string[],
    transactionId?: string
) {
    return await tablesDb.updateRow({
        data: data,
        databaseId: databaseId,
        permissions: permissions,
        rowId: rowId,
        tableId: tableId,
        transactionId: transactionId
    })
}