const data = require('../../schema/data/ai-assisted-developer-tools.json');

export function getTools() {
    return data.tools;
}

export function getCategories() {
    return data.categories;
}

export function getToolByName(name) {
  const normalizedName = name.toLowerCase().replace(/-/g, ' ');
  const tool = data.tools.find(tool => tool.slug === normalizedName || tool.name.toLowerCase() === normalizedName);
  return tool
}