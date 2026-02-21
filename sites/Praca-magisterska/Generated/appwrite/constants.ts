/**
 * Appwrite Configuration Constants
 *
 * This file contains configuration for the generated SDK.
 * You may modify these values as needed.
 */

import { DatabaseId } from "./types";

export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
export const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
export const DATABASE = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as DatabaseId;
export const BUCKET = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;
