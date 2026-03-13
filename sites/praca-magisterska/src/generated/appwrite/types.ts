import { type Models } from 'appwrite';

export type GenresCreate = {
    "ReadableName": string;
    "Slug": string;
    "files"?: ((FilesCreate & { $id?: string; $permissions?: string[] }) | string)[];
    "transformation_ongoing"?: boolean;
}

export type Genres = Models.Row & {
    "ReadableName": string;
    "Slug": string;
    "files"?: Files[];
    "transformation_ongoing"?: boolean;
}

export type FilesCreate = {
    "genre"?: ((GenresCreate & { $id?: string; $permissions?: string[] }) | string);
    "FileId": string;
    "FileName": string;
    "data_file_id"?: string | null;
}

export type Files = Models.Row & {
    "genre"?: Genres;
    "FileId": string;
    "FileName": string;
    "data_file_id"?: string | null;
}

export type ModelsCreate = {
    "name": string;
}

export type Models = Models.Row & {
    "name": string;
}

declare const __roleStringBrand: unique symbol;
export type RoleString = string & { readonly [__roleStringBrand]: never };

export type RoleBuilder = {
  any: () => RoleString;
  user: (userId: string, status?: string) => RoleString;
  users: (status?: string) => RoleString;
  guests: () => RoleString;
  team: (teamId: string, role?: string) => RoleString;
  member: (memberId: string) => RoleString;
  label: (label: string) => RoleString;
}

export type PermissionBuilder = {
  read: (role: RoleString) => string;
  write: (role: RoleString) => string;
  create: (role: RoleString) => string;
  update: (role: RoleString) => string;
  delete: (role: RoleString) => string;
}

export type PermissionCallback = (permission: PermissionBuilder, role: RoleBuilder) => string[];

export type QueryValue = string | number | boolean;

export type ExtractQueryValue<T> = T extends (infer U)[]
  ? U extends QueryValue ? U : never
  : T extends QueryValue | null
    ? NonNullable<T>
    : T extends any
      ? T extends object
        ? string // Relation attributes store document ID (string)
        : never
      : never;

export type QueryableKeys<T> = {
  [K in keyof T]: ExtractQueryValue<T[K]> extends never ? never : K;
}[keyof T];

export type QueryBuilder<T> = {
  equal: <K extends keyof T & QueryableKeys<T>>(field: K, value: ExtractQueryValue<T[K]>) => string;
  notEqual: <K extends keyof T & QueryableKeys<T>>(field: K, value: ExtractQueryValue<T[K]>) => string;
  lessThan: <K extends keyof T & QueryableKeys<T>>(field: K, value: ExtractQueryValue<T[K]>) => string;
  lessThanEqual: <K extends keyof T & QueryableKeys<T>>(field: K, value: ExtractQueryValue<T[K]>) => string;
  greaterThan: <K extends keyof T & QueryableKeys<T>>(field: K, value: ExtractQueryValue<T[K]>) => string;
  greaterThanEqual: <K extends keyof T & QueryableKeys<T>>(field: K, value: ExtractQueryValue<T[K]>) => string;
  contains: <K extends keyof T & QueryableKeys<T>>(field: K, value: ExtractQueryValue<T[K]>) => string;
  search: <K extends keyof T & QueryableKeys<T>>(field: K, value: string) => string;
  isNull: <K extends keyof T & QueryableKeys<T>>(field: K) => string;
  isNotNull: <K extends keyof T & QueryableKeys<T>>(field: K) => string;
  startsWith: <K extends keyof T & QueryableKeys<T>>(field: K, value: string) => string;
  endsWith: <K extends keyof T & QueryableKeys<T>>(field: K, value: string) => string;
  between: <K extends keyof T & QueryableKeys<T>>(field: K, start: ExtractQueryValue<T[K]>, end: ExtractQueryValue<T[K]>) => string;
  select: <K extends keyof T>(fields: K[]) => string;
  orderAsc: <K extends keyof T>(field: K) => string;
  orderDesc: <K extends keyof T>(field: K) => string;
  limit: (value: number) => string;
  offset: (value: number) => string;
  cursorAfter: (documentId: string) => string;
  cursorBefore: (documentId: string) => string;
  or: (...queries: string[]) => string;
  and: (...queries: string[]) => string;
}

export type DatabaseId = "698b1344001fada58b06";

export type DatabaseTableMap = {
  "698b1344001fada58b06": {
    "genres": {
      create: (data: {
        "ReadableName": string;
        "Slug": string;
        "files"?: ((FilesCreate & { $id?: string; $permissions?: string[] }) | string)[];
        "transformation_ongoing"?: boolean;
      }, options?: { rowId?: string; permissions?: (permission: { read: (role: RoleString) => string; write: (role: RoleString) => string; create: (role: RoleString) => string; update: (role: RoleString) => string; delete: (role: RoleString) => string }, role: { any: () => RoleString; user: (userId: string, status?: string) => RoleString; users: (status?: string) => RoleString; guests: () => RoleString; team: (teamId: string, role?: string) => RoleString; member: (memberId: string) => RoleString; label: (label: string) => RoleString }) => string[]; transactionId?: string }) => Promise<Genres>;
      get: (id: string) => Promise<Genres>;
      update: (id: string, data: Partial<{
        "ReadableName": string;
        "Slug": string;
        "files"?: ((FilesCreate & { $id?: string; $permissions?: string[] }) | string)[];
        "transformation_ongoing"?: boolean;
      }>, options?: { permissions?: (permission: { read: (role: RoleString) => string; write: (role: RoleString) => string; create: (role: RoleString) => string; update: (role: RoleString) => string; delete: (role: RoleString) => string }, role: { any: () => RoleString; user: (userId: string, status?: string) => RoleString; users: (status?: string) => RoleString; guests: () => RoleString; team: (teamId: string, role?: string) => RoleString; member: (memberId: string) => RoleString; label: (label: string) => RoleString }) => string[]; transactionId?: string }) => Promise<Genres>;
      delete: (id: string, options?: { transactionId?: string }) => Promise<void>;
      list: (options?: { queries?: (q: { equal: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: ExtractQueryValue<Genres[K]>) => string; notEqual: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: ExtractQueryValue<Genres[K]>) => string; lessThan: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: ExtractQueryValue<Genres[K]>) => string; lessThanEqual: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: ExtractQueryValue<Genres[K]>) => string; greaterThan: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: ExtractQueryValue<Genres[K]>) => string; greaterThanEqual: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: ExtractQueryValue<Genres[K]>) => string; contains: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: ExtractQueryValue<Genres[K]>) => string; search: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: string) => string; isNull: <K extends keyof Genres & QueryableKeys<Genres>>(field: K) => string; isNotNull: <K extends keyof Genres & QueryableKeys<Genres>>(field: K) => string; startsWith: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: string) => string; endsWith: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, value: string) => string; between: <K extends keyof Genres & QueryableKeys<Genres>>(field: K, start: ExtractQueryValue<Genres[K]>, end: ExtractQueryValue<Genres[K]>) => string; select: <K extends keyof Genres>(fields: K[]) => string; orderAsc: <K extends keyof Genres>(field: K) => string; orderDesc: <K extends keyof Genres>(field: K) => string; limit: (value: number) => string; offset: (value: number) => string; cursorAfter: (documentId: string) => string; cursorBefore: (documentId: string) => string; or: (...queries: string[]) => string; and: (...queries: string[]) => string }) => string[] }) => Promise<{ total: number; rows: Genres[] }>;
    };
    "files": {
      create: (data: {
        "genre"?: ((GenresCreate & { $id?: string; $permissions?: string[] }) | string);
        "FileId": string;
        "FileName": string;
        "data_file_id"?: string | null;
      }, options?: { rowId?: string; permissions?: (permission: { read: (role: RoleString) => string; write: (role: RoleString) => string; create: (role: RoleString) => string; update: (role: RoleString) => string; delete: (role: RoleString) => string }, role: { any: () => RoleString; user: (userId: string, status?: string) => RoleString; users: (status?: string) => RoleString; guests: () => RoleString; team: (teamId: string, role?: string) => RoleString; member: (memberId: string) => RoleString; label: (label: string) => RoleString }) => string[]; transactionId?: string }) => Promise<Files>;
      get: (id: string) => Promise<Files>;
      update: (id: string, data: Partial<{
        "genre"?: ((GenresCreate & { $id?: string; $permissions?: string[] }) | string);
        "FileId": string;
        "FileName": string;
        "data_file_id"?: string | null;
      }>, options?: { permissions?: (permission: { read: (role: RoleString) => string; write: (role: RoleString) => string; create: (role: RoleString) => string; update: (role: RoleString) => string; delete: (role: RoleString) => string }, role: { any: () => RoleString; user: (userId: string, status?: string) => RoleString; users: (status?: string) => RoleString; guests: () => RoleString; team: (teamId: string, role?: string) => RoleString; member: (memberId: string) => RoleString; label: (label: string) => RoleString }) => string[]; transactionId?: string }) => Promise<Files>;
      delete: (id: string, options?: { transactionId?: string }) => Promise<void>;
      list: (options?: { queries?: (q: { equal: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: ExtractQueryValue<Files[K]>) => string; notEqual: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: ExtractQueryValue<Files[K]>) => string; lessThan: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: ExtractQueryValue<Files[K]>) => string; lessThanEqual: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: ExtractQueryValue<Files[K]>) => string; greaterThan: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: ExtractQueryValue<Files[K]>) => string; greaterThanEqual: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: ExtractQueryValue<Files[K]>) => string; contains: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: ExtractQueryValue<Files[K]>) => string; search: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: string) => string; isNull: <K extends keyof Files & QueryableKeys<Files>>(field: K) => string; isNotNull: <K extends keyof Files & QueryableKeys<Files>>(field: K) => string; startsWith: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: string) => string; endsWith: <K extends keyof Files & QueryableKeys<Files>>(field: K, value: string) => string; between: <K extends keyof Files & QueryableKeys<Files>>(field: K, start: ExtractQueryValue<Files[K]>, end: ExtractQueryValue<Files[K]>) => string; select: <K extends keyof Files>(fields: K[]) => string; orderAsc: <K extends keyof Files>(field: K) => string; orderDesc: <K extends keyof Files>(field: K) => string; limit: (value: number) => string; offset: (value: number) => string; cursorAfter: (documentId: string) => string; cursorBefore: (documentId: string) => string; or: (...queries: string[]) => string; and: (...queries: string[]) => string }) => string[] }) => Promise<{ total: number; rows: Files[] }>;
    };
    "models": {
      create: (data: {
        "name": string;
      }, options?: { rowId?: string; permissions?: (permission: { read: (role: RoleString) => string; write: (role: RoleString) => string; create: (role: RoleString) => string; update: (role: RoleString) => string; delete: (role: RoleString) => string }, role: { any: () => RoleString; user: (userId: string, status?: string) => RoleString; users: (status?: string) => RoleString; guests: () => RoleString; team: (teamId: string, role?: string) => RoleString; member: (memberId: string) => RoleString; label: (label: string) => RoleString }) => string[]; transactionId?: string }) => Promise<Models>;
      get: (id: string) => Promise<Models>;
      update: (id: string, data: Partial<{
        "name": string;
      }>, options?: { permissions?: (permission: { read: (role: RoleString) => string; write: (role: RoleString) => string; create: (role: RoleString) => string; update: (role: RoleString) => string; delete: (role: RoleString) => string }, role: { any: () => RoleString; user: (userId: string, status?: string) => RoleString; users: (status?: string) => RoleString; guests: () => RoleString; team: (teamId: string, role?: string) => RoleString; member: (memberId: string) => RoleString; label: (label: string) => RoleString }) => string[]; transactionId?: string }) => Promise<Models>;
      delete: (id: string, options?: { transactionId?: string }) => Promise<void>;
      list: (options?: { queries?: (q: { equal: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: ExtractQueryValue<Models[K]>) => string; notEqual: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: ExtractQueryValue<Models[K]>) => string; lessThan: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: ExtractQueryValue<Models[K]>) => string; lessThanEqual: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: ExtractQueryValue<Models[K]>) => string; greaterThan: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: ExtractQueryValue<Models[K]>) => string; greaterThanEqual: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: ExtractQueryValue<Models[K]>) => string; contains: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: ExtractQueryValue<Models[K]>) => string; search: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: string) => string; isNull: <K extends keyof Models & QueryableKeys<Models>>(field: K) => string; isNotNull: <K extends keyof Models & QueryableKeys<Models>>(field: K) => string; startsWith: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: string) => string; endsWith: <K extends keyof Models & QueryableKeys<Models>>(field: K, value: string) => string; between: <K extends keyof Models & QueryableKeys<Models>>(field: K, start: ExtractQueryValue<Models[K]>, end: ExtractQueryValue<Models[K]>) => string; select: <K extends keyof Models>(fields: K[]) => string; orderAsc: <K extends keyof Models>(field: K) => string; orderDesc: <K extends keyof Models>(field: K) => string; limit: (value: number) => string; offset: (value: number) => string; cursorAfter: (documentId: string) => string; cursorBefore: (documentId: string) => string; or: (...queries: string[]) => string; and: (...queries: string[]) => string }) => string[] }) => Promise<{ total: number; rows: Models[] }>;
    }
  }
};

export type DatabaseHandle<D extends DatabaseId> = {
  use: <T extends keyof DatabaseTableMap[D] & string>(tableId: T) => DatabaseTableMap[D][T];

};

export type DatabaseTables = {
  use: <D extends DatabaseId>(databaseId: D) => DatabaseHandle<D>;

};
