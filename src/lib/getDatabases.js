// Import databases from TypeScript file
import { databases } from '../data/databases';

export function getDatabases() {
  return databases;
}

export function getCategories() {
  // Since we no longer have the categories from JSON, 
  // we'll need to derive them from the database structure
  // or provide a static definition
  return {
    deployment: {
      description: "Describes how the database can be deployed and managed.",
      importance: "The deployment options affect scalability, maintenance, and cost of running the database."
    },
    scalability: {
      description: "Indicates how well the database can handle increasing amounts of data and traffic.",
      importance: "Scalability is crucial for growing applications and large-scale data processing."
    },
    // Add other categories as needed
  };
}

export function getFeatures() {
  // Since we no longer have the features from JSON,
  // we'll need to derive them from the database structure
  // or provide a static definition
  return {
    local: {
      description: "Ability to run the database on local infrastructure.",
      importance: "Local deployment can be crucial for data privacy and reducing latency."
    },
    cloud: {
      description: "Availability of the database as a managed cloud service.",
      importance: "Cloud deployment often offers easier scaling and maintenance."
    },
    // Add other features as needed
  };
}

export function getDatabaseByName(name) {
  return databases.find(db => db.name.toLowerCase() === name.toLowerCase());
}

export function getDatabase(name) {
  return databases.find(db => db.name.toLowerCase() === name.toLowerCase());
}
