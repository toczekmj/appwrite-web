export function createFileSlug(filename: string, userId: string): string {
    // Extract file extension
    const lastDotIndex = filename.lastIndexOf('.');
    const name = lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename;
    const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';

    // Create slug from filename
    const slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except -
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end

    // Salt with userId (take first 8 chars of userId for brevity)
    const salt = userId.slice(0, 8);

    // Combine: slug-salt-timestamp.extension
    const timestamp = Date.now();
    return `${slug}-${salt}-${timestamp}${extension}`;
}