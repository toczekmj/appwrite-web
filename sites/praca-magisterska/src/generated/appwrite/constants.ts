/**
 * Appwrite Configuration Constants
 *
 * This file contains configuration for the generated SDK.
 * You may modify these values as needed.
 */

import type { DatabaseId } from "./types";

export const PROJECT_ID = import.meta.env.VITE_PUBLIC_APPWRITE_PROJECT_ID as string;
export const ENDPOINT = import.meta.env.VITE_PUBLIC_APPWRITE_ENDPOINT as string;
export const DATABASE = import.meta.env.VITE_PUBLIC_APPWRITE_DATABASE_ID as DatabaseId;
export const BUCKET = import.meta.env.VITE_PUBLIC_APPWRITE_BUCKET_ID as string;

/**
 * Last path key is used to store information about the last path the user was on.
 * It is used to recall the last path the user was on when they switch to a different parent tab.
 */
export const NAV_LAST_SUBROUTE = 'lastDashboardPath';
