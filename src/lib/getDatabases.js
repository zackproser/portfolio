const data = require('../../schema/data/vectordatabases.json');

export function getDatabases() {
  return data.databases;
}

export function getCategories() {
  return data.categories;
}

export function getFeatures() {
  return data.features;
}


export function getDatabase(name) {
  return data.databases.find(db => db.name.toLowerCase() === name.toLowerCase());
}
