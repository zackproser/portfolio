import data from '../../schema/data/ai-assisted-developer-tools.json' assert { type: 'json' };

export function getTools() {
    return data.tools;
}

export function getCategories() {
    return data.categories;
}

export function getToolByName(name: string) {
  const normalizedName = name.toLowerCase().replace(/-/g, ' ');
  const tool = data.tools.find((tool: any) => tool.slug === normalizedName || tool.name.toLowerCase() === normalizedName);
  return tool;
} 