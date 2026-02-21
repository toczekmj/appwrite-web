#!/usr/bin/env node
/**
 * Patches Appwrite generated types to make relation attributes queryable.
 * Run after `appwrite generate` to fix QueryableKeys for relation fields (e.g. genre).
 *
 * The fix: Extends ExtractQueryValue so object types (relations) are treated as
 * queryable with string values (document ID), since that's what's stored in the DB.
 */

const fs = require('fs');
const path = require('path');

const TYPES_PATH = path.join(__dirname, '../Generated/appwrite/types.ts');

// The pattern we replace - original has no relation support (single-line ternary)
const OLD_PATTERN = /: T extends QueryValue \| null \? NonNullable<T> : never;/;
const NEW_LINES = `: T extends QueryValue | null
    ? NonNullable<T>
    : T extends any
      ? T extends object
        ? string // Relation attributes store document ID (string)
        : never
      : never;`;

function main() {
  const fullPath = path.resolve(TYPES_PATH);
  if (!fs.existsSync(fullPath)) {
    console.error('patch-appwrite-types: types.ts not found at', fullPath);
    process.exit(1);
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  if (content.includes('T extends any') && content.includes('T extends object')) {
    console.log('patch-appwrite-types: types.ts already patched, skipping');
    return;
  }

  if (!OLD_PATTERN.test(content)) {
    console.error('patch-appwrite-types: Could not find ExtractQueryValue pattern to patch.');
    console.error('The Appwrite generator may have changed. Manual patch may be needed.');
    process.exit(1);
  }

  content = content.replace(OLD_PATTERN, NEW_LINES);
  fs.writeFileSync(fullPath, content);
  console.log('patch-appwrite-types: Successfully patched types.ts');
}

main();
