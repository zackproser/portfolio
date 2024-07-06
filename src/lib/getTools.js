const data = require('../../schema/data/ai-assisted-developer-tools.json');

export function getTools() {
    return data.tools;
}

export function getCategories() {
    return data.categories;
}

export function getToolByName(name) {
    return data.tools.find(tool => tool.name.toLowerCase() === name.toLowerCase())
}