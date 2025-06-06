const sentenceVariations = {
  category: [
    "{tool1} falls under the {category1} category. {description1} {tool2} belongs to the {category2} category. {description2}",
    "{tool1} is a {category1}. {description1} {tool2} is in the {category2} category: {description2}",
    "{tool1} is part of the {category1} family: {description1} {tool2} is a {category2} {description2}",
    "Both {tool1} and {tool2} are in the {category1} category. {description1}"
  ],
  pricing: [
    "{tool1} uses a {pricingModel1} pricing model, ranging from {lowestPrice1} to {highestPrice1}. {tool2} employs a {pricingModel2} model, with prices from {lowestPrice2} to {highestPrice2}.",
    "{tool1}'s {pricingModel1} pricing ranges from {lowestPrice1} to {highestPrice1}. {tool2}'s {pricingModel2} pricing spans from {lowestPrice2} to {highestPrice2}.",
    "{tool1} offers a {pricingModel1} model starting at {lowestPrice1}, up to {highestPrice1}. {tool2} provides a {pricingModel2} model, from {lowestPrice2} to {highestPrice2}.",
    "The {pricingModel1} pricing for {tool1} ranges from {lowestPrice1} to {highestPrice1}. {tool2}'s {pricingModel2} pricing goes from {lowestPrice2} to {highestPrice2}.",
    "{tool1} implements a {pricingModel1} model ({lowestPrice1} - {highestPrice1}). {tool2} uses a {pricingModel2} approach ({lowestPrice2} - {highestPrice2})."
  ],
  uniqueFeatures: [
    "{tool1} offers {uniqueFeatures1}. {tool2} provides {uniqueFeatures2}.",
    "{tool1}'s key features include {uniqueFeatures1}. {tool2} focuses on {uniqueFeatures2}.",
    "{tool1} specializes in {uniqueFeatures1}, while {tool2} excels in {uniqueFeatures2}.",
    "The main features of {tool1} are {uniqueFeatures1}. {tool2}'s primary offerings are {uniqueFeatures2}.",
    "{tool1} emphasizes {uniqueFeatures1} in its feature set. {tool2} highlights {uniqueFeatures2} as its core functionalities."
  ],
  sharedFeature: "Both {tool1} and {tool2} offer {sharedFeature} as a key feature.",
  useCases: [
    "{tool1} is particularly well-suited for {useCases1}, while {tool2} is ideal for {useCases2}.",
    "Developers typically choose {tool1} for {useCases1}. On the other hand, {tool2} is preferred for {useCases2}.",
    "If you're looking to {useCases1}, {tool1} is an excellent choice. For {useCases2}, {tool2} would be more suitable.",
    "{tool1} shines when used for {useCases1}, whereas {tool2} performs best for {useCases2}."
  ],
  performance: [
    "In terms of performance, {tool1} {performance1}, while {tool2} {performance2}.",
    "{tool1}'s performance is characterized by {performance1}. Meanwhile, {tool2} {performance2}.",
    "Performance-wise, {tool1} {performance1}. {tool2}, however, {performance2}."
  ]
};

module.exports = {
  generateComparison: function(tool1, tool2, categories) {
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

    const getCategoryDescription = (categoryName) => {
      const category = categories.find(cat => cat.name === categoryName);
      return category ? category.description : '';
    };
    
    // Helper to extract use cases from tool data
    const getUseCases = (tool) => {
      if (tool.market_position?.use_cases && Array.isArray(tool.market_position.use_cases)) {
        return tool.market_position.use_cases.join(', ');
      }
      
      // Generate some based on features if not explicitly defined
      const useCases = [];
      
      if (tool.features?.beginner_friendly) {
        useCases.push('beginners learning to code');
      }
      
      if (tool.features?.enterprise_ready) {
        useCases.push('large enterprise development teams');
      }
      
      if (tool.features?.code_completion) {
        useCases.push('rapid code development');
      }
      
      if (tool.features?.code_refactoring) {
        useCases.push('refactoring existing codebases');
      }
      
      if (tool.open_source?.client || tool.open_source?.backend) {
        useCases.push('open source development');
      }
      
      return useCases.length ? useCases.join(', ') : 'various development tasks';
    };
    
    // Helper to extract performance characteristics
    const getPerformanceDetails = (tool) => {
      if (tool.performance_metrics?.description) {
        return tool.performance_metrics.description;
      }
      
      // Generate based on available metrics
      const descriptions = [];
      
      if (tool.performance_metrics?.latency < 100) {
        descriptions.push('offers low-latency responses');
      } else if (tool.performance_metrics?.latency > 300) {
        descriptions.push('may have higher latency');
      }
      
      if (tool.features?.offline_capabilities) {
        descriptions.push('can work offline');
      }
      
      if (tool.pricing?.free_tier) {
        descriptions.push('performs well even in its free tier');
      }
      
      return descriptions.length ? descriptions.join(' and ') : 'offers standard performance for most use cases';
    };

    let proseParagraphs = [];

    // Category
    let categoryParagraph;
    if (tool1.category === tool2.category) {
      categoryParagraph = sentenceVariations.category[3]
        .replace(/{tool1}/g, tool1.name || 'Tool 1')
        .replace(/{tool2}/g, tool2.name || 'Tool 2')
        .replace(/{category1}/g, tool1.category || 'AI-assisted development')
        .replace(/{description1}/g, getCategoryDescription(tool1.category) || 'which assists developers');
    } else {
      categoryParagraph = getRandomSentence('category')
        .replace(/{tool1}/g, tool1.name || 'Tool 1')
        .replace(/{tool2}/g, tool2.name || 'Tool 2')
        .replace(/{category1}/g, tool1.category || 'AI-assisted development')
        .replace(/{category2}/g, tool2.category || 'AI-assisted development')
        .replace(/{description1}/g, getCategoryDescription(tool1.category) || 'which assists developers')
        .replace(/{description2}/g, getCategoryDescription(tool2.category) || 'which assists developers');
    }
    proseParagraphs.push(categoryParagraph);

    // Pricing (now included but commented out in the original code)
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
    proseParagraphs.push(pricingParagraph); // Now included in output

    // Unique Features
    const uniqueFeatures1 = tool1.market_position?.unique_selling_points || ['unique features'];
    const uniqueFeatures2 = tool2.market_position?.unique_selling_points || ['unique features'];

    // Find shared features
    const sharedFeatures = uniqueFeatures1.filter(feature => uniqueFeatures2.includes(feature));

    // Remove shared features from individual lists
    const exclusiveFeatures1 = uniqueFeatures1.filter(feature => !sharedFeatures.includes(feature));
    const exclusiveFeatures2 = uniqueFeatures2.filter(feature => !sharedFeatures.includes(feature));

    // Generate sentences for shared features
    sharedFeatures.forEach(feature => {
      const sharedFeatureSentence = sentenceVariations.sharedFeature
        .replace(/{tool1}/g, tool1.name || 'Tool 1')
        .replace(/{tool2}/g, tool2.name || 'Tool 2')
        .replace(/{sharedFeature}/g, feature);
      proseParagraphs.push(sharedFeatureSentence);
    });

    // Generate sentence for exclusive features
    if (exclusiveFeatures1.length > 0 || exclusiveFeatures2.length > 0) {
      const uniqueFeaturesParagraph = getRandomSentence('uniqueFeatures')
        .replace(/{tool1}/g, tool1.name || 'Tool 1')
        .replace(/{tool2}/g, tool2.name || 'Tool 2')
        .replace(/{uniqueFeatures1}/g, exclusiveFeatures1.join(', ') || 'standard features')
        .replace(/{uniqueFeatures2}/g, exclusiveFeatures2.join(', ') || 'standard features');
      proseParagraphs.push(uniqueFeaturesParagraph);
    }
    
    // Add use cases paragraph
    const useCaseParagraph = getRandomSentence('useCases')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{useCases1}/g, getUseCases(tool1))
      .replace(/{useCases2}/g, getUseCases(tool2));
    proseParagraphs.push(useCaseParagraph);
    
    // Add performance paragraph
    const performanceParagraph = getRandomSentence('performance')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{performance1}/g, getPerformanceDetails(tool1))
      .replace(/{performance2}/g, getPerformanceDetails(tool2));
    proseParagraphs.push(performanceParagraph);

    // Add newlines between paragraphs
    return proseParagraphs.flatMap(paragraph => [paragraph, "\n\n"]).slice(0, -1);
  }
};