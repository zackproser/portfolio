import { Database } from '@/types/database';
import { databases } from '../data/databases';
import { dbLogger as logger } from '@/utils/logger'; // Import centralized logger

export const getDatabases = (): Database[] => {
  logger.info('Starting database retrieval and validation...');
  // Track seen IDs to filter out duplicates
  const seenIds = new Set<string>();
  const uniqueDatabases: Database[] = [];
  
  // First pass - validate and fix any missing IDs
  const validatedDatabases = databases.map((db, index) => {
    // Check if this database has a valid ID
    if (!db.id) {
      logger.warn(`Database at index ${index} (${db.name}) has no ID, generating one from name.`);
      return {
        ...db,
        id: db.name.toLowerCase().replace(/\s+/g, '-')
      };
    }
    return db;
  });
  
  // Second pass - deduplicate and log
  validatedDatabases.forEach((db, index) => {
    // Ensure ID is a string and is trimmed
    const id = typeof db.id === 'string' ? db.id.trim() : String(db.id).trim();
    
    // If ID is empty after trimming, generate a new one
    const finalId = id || db.name.toLowerCase().replace(/\s+/g, '-');
    
    // Create a database object with a guaranteed valid ID
    const validatedDb = {
      ...db,
      id: finalId
    };
    
    logger.debug(`Processing database[${index}]: ${validatedDb.name} (ID: ${validatedDb.id})`);
    
    if (seenIds.has(validatedDb.id)) {
      logger.warn(`Duplicate database entry skipped: ${validatedDb.name} with ID ${validatedDb.id}`);
    } else {
      seenIds.add(validatedDb.id);
      uniqueDatabases.push(validatedDb);
    }
  });
  
  logger.info(`Original databases count: ${databases.length}`);
  logger.info(`Validated databases count: ${validatedDatabases.length}`);
  logger.info(`Unique databases count: ${uniqueDatabases.length}`);
  logger.debug(`Unique database names: ${uniqueDatabases.map(db => db.name).join(', ')}`);
  
  return uniqueDatabases;
};

export const getDatabaseByName = (name: string): Database | undefined => {
  // Use the filtered list to ensure we don't get duplicates
  return getDatabases().find(db => db.name.toLowerCase() === name.toLowerCase());
};

// Get categories for database comparison
export const getCategories = () => {
  return {
    company: {
      description: "Company Information",
      importance: "Provides background on the company behind the database"
    },
    features: {
      description: "Core Features",
      importance: "Essential functionalities offered by the database"
    },
    performance: {
      description: "Performance Metrics",
      importance: "How well the database performs under various conditions"
    },
    security: {
      description: "Security Features",
      importance: "Security measures and capabilities"
    },
    algorithms: {
      description: "Supported Algorithms",
      importance: "Vector search algorithms implemented"
    },
    searchCapabilities: {
      description: "Search Capabilities",
      importance: "Types of search operations supported"
    },
    aiCapabilities: {
      description: "AI Features",
      importance: "AI and machine learning integration capabilities"
    }
  };
};

// Get features for database comparison
export const getFeatures = () => {
  return {
    cloudNative: {
      description: "Designed to run in cloud environments"
    },
    serverless: {
      description: "Can be deployed without managing servers"
    },
    hybridSearch: {
      description: "Combines vector search with keyword or filter-based search"
    },
    metadataFiltering: {
      description: "Ability to filter search results by metadata"
    },
    batchOperations: {
      description: "Support for processing multiple items in a single operation"
    }
  };
}; 