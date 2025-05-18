const data = require('../../schema/data/ai-assisted-developer-tools.json');

export function getTools() {
    return data.tools;
}

export function getCategories() {
    return data.categories;
}

export function getToolByName(name) {
  const normalizedName = name.toLowerCase().replace(/-/g, ' ');
  const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const tool = data.tools.find(tool => slugify(tool.name) === slugify(normalizedName));
  return tool
}