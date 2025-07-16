import * as fs from 'fs';
import * as path from 'path';
import type { ExtendedMetadata } from '../types/metadata';

const contentDirectory = path.join(process.cwd(), 'src/content');

/**
 * Reads and parses the metadata.json file for a given content item.
 * @param contentType The content type directory
 * @param directorySlug The directory name for the specific content item
 * @returns The raw metadata object or null if not found/failed.
 */
export async function getContentMetadataByDirectorySlug(contentType: string, directorySlug: string): Promise<ExtendedMetadata | null> {
  const metadataJsonPath = path.join(contentDirectory, contentType, directorySlug, 'metadata.json');
  
  if (!fs.existsSync(metadataJsonPath)) {
    console.error(`Metadata file not found: ${metadataJsonPath}`);
    return null;
  }

  try {
    const fileContent = fs.readFileSync(metadataJsonPath, 'utf-8');
    const metadata = JSON.parse(fileContent) as ExtendedMetadata;
    return metadata;
  } catch (error: any) {
    console.error(`Error reading or parsing metadata for ${contentType}/${directorySlug}:`, error);
    return null;
  }
} 

export function getMetadata(filePath: string) {
  const fullPath = path.resolve(process.cwd(), filePath);
  const jsonContent = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(jsonContent);
} 