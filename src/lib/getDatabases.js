const databases = require('../../schema/data/vectordatabases.json');

export function getDatabases() {
  return databases;
}

export function getDatabase(name) {
  return databases.find(db => db.name.toLowerCase() === name.toLowerCase());
}
