const sentenceVariations = {
  category: [
    "{tool1} falls under the {category1} category, {description1}. {tool2} is categorized as {category2}, {description2}.",
    "In terms of categorization, {tool1} is classified as {category1}, which {description1}. On the other hand, {tool2} belongs to the {category2} category, {description2}.",
    "{tool1} and {tool2} are both classified as {category1}, which {description1}.",
    "While {tool1} is categorized as {category1}, {description1}, {tool2} falls under the {category2} category, {description2}.",
    "The {category1} category, which includes {tool1}, {description1}. Similarly, {tool2} is part of the {category2} category, {description2}."
  ],
  pricing: [
    "{tool1} offers a {pricingModel1} pricing model with tiers ranging from {lowestPrice1} to {highestPrice1}, while {tool2} provides a {pricingModel2} model with options from {lowestPrice2} to {highestPrice2}.",
    "When it comes to pricing, {tool1} and {tool2} take different approaches. {tool1} uses a {pricingModel1} model, with prices from {lowestPrice1} to {highestPrice1}, whereas {tool2} opts for a {pricingModel2} structure, ranging from {lowestPrice2} to {highestPrice2}.",
    "Budget-conscious developers might prefer {tool1}'s {pricingModel1} model starting at {lowestPrice1}, while those seeking more features could lean towards {tool2}'s {pricingModel2} model, which goes up to {highestPrice2}.",
    "{tool1} and {tool2} cater to different budget ranges, with {tool1}'s {pricingModel1} model spanning from {lowestPrice1} to {highestPrice1}, and {tool2}'s {pricingModel2} model covering {lowestPrice2} to {highestPrice2}.",
    "The pricing structures of {tool1} and {tool2} reflect their target markets, with {tool1} offering a {pricingModel1} model ({lowestPrice1} - {highestPrice1}) and {tool2} providing a {pricingModel2} approach ({lowestPrice2} - {highestPrice2})."
  ],
  uniqueFeatures: [
    "What sets {tool1} apart is its {uniqueFeature1}, while {tool2} distinguishes itself with its {uniqueFeature2}, offering developers distinct advantages in their respective areas.",
    "{tool1}'s standout feature is its {uniqueFeature1}, which addresses a crucial need in development. On the other hand, {tool2}'s {uniqueFeature2} provides a novel solution to common coding challenges.",
    "Developers are drawn to {tool1} for its innovative {uniqueFeature1}, while {tool2}'s {uniqueFeature2} has been making waves in the development community.",
    "The {uniqueFeature1} of {tool1} has been a game-changer for many developers, whereas {tool2}'s {uniqueFeature2} offers a fresh perspective on coding assistance.",
    "In the competitive landscape of AI-assisted development tools, {tool1}'s {uniqueFeature1} and {tool2}'s {uniqueFeature2} stand out as unique offerings that cater to specific developer needs."
  ]
};

module.exports = {
  generateComparison: function(tool1, tool2) {
    const getRandomSentence = (key) => 
      sentenceVariations[key][Math.floor(Math.random() * sentenceVariations[key].length)];

    const getLowestHighestPrice = (tool) => {
      const prices = (tool.pricing?.tiers || []).map(tier => parseFloat(tier.price?.replace(/[^0-9.-]+/g, "") || '0'))
        .filter(price => !isNaN(price));
      return {
        lowest: prices.length ? Math.min(...prices) : 0,
        highest: prices.length ? Math.max(...prices) : 0
      };
    };

    let proseParagraphs = [];

    // Category
    const categoryParagraph = getRandomSentence('category')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{category1}/g, tool1.category || 'AI-assisted development')
      .replace(/{category2}/g, tool2.category || 'AI-assisted development')
      .replace(/{description1}/g, tool1.description || 'which assists developers')
      .replace(/{description2}/g, tool2.description || 'which assists developers');
    proseParagraphs.push(categoryParagraph);

    proseParagraphs.push(''); // Add an empty string for a newline

    // Pricing
    const price1 = getLowestHighestPrice(tool1);
    const price2 = getLowestHighestPrice(tool2);
    const pricingParagraph = getRandomSentence('pricing')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{pricingModel1}/g, tool1.pricing?.model || 'flexible')
      .replace(/{pricingModel2}/g, tool2.pricing?.model || 'flexible')
      .replace(/{lowestPrice1}/g, `$${price1.lowest}`)
      .replace(/{highestPrice1}/g, `$${price1.highest}`)
      .replace(/{lowestPrice2}/g, `$${price2.lowest}`)
      .replace(/{highestPrice2}/g, `$${price2.highest}`);
    proseParagraphs.push(pricingParagraph);

    proseParagraphs.push(''); // Add an empty string for a newline

    // Unique Features
    const uniqueFeature1 = tool1.market_position?.unique_selling_points?.[0] || 'unique features';
    const uniqueFeature2 = tool2.market_position?.unique_selling_points?.[0] || 'unique features';
    const uniqueFeaturesParagraph = getRandomSentence('uniqueFeatures')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{uniqueFeature1}/g, uniqueFeature1)
      .replace(/{uniqueFeature2}/g, uniqueFeature2);
    proseParagraphs.push(uniqueFeaturesParagraph);

    return proseParagraphs;
  }
};