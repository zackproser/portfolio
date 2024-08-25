// Remove the import statement
// const { Tool } = require('../types/Tool');

const sentenceVariations = {
  intro: [
    "In this comprehensive comparison, we'll explore the key features and differences between {tool1} and {tool2}, two popular AI-assisted developer tools that are revolutionizing the way we code.",
    "Today, we're diving deep into a detailed analysis of {tool1} and {tool2}, two prominent players in the AI-assisted development space that are changing the landscape of software engineering.",
    "Let's take a closer look at {tool1} and {tool2}, two powerful AI-driven tools that are reshaping the future of coding and software development.",
    "In this article, we'll compare and contrast {tool1} and {tool2}, two cutting-edge AI-powered developer tools that are making waves in the tech industry.",
    "Join us as we examine the strengths and weaknesses of {tool1} and {tool2}, two innovative AI-assisted coding tools that are transforming the developer experience."
  ],
  purpose: [
    "{tool1} is designed to {purpose1}, while {tool2} focuses on {purpose2}, offering developers unique approaches to enhancing their workflow.",
    "While {tool1} excels at {purpose1}, {tool2} is known for its strength in {purpose2}, catering to different aspects of the development process.",
    "The primary goal of {tool1} is {purpose1}, whereas {tool2} aims to {purpose2}, providing developers with complementary tools to boost their productivity.",
    "{tool1} specializes in {purpose1}, offering a targeted solution for developers, while {tool2} takes a broader approach by {purpose2}.",
    "Developers turn to {tool1} when they need to {purpose1}, but opt for {tool2} when their focus is on {purpose2}, showcasing the diverse needs in modern software development."
  ],
  marketPosition: [
    "In terms of market share, {tool1} holds {marketShare1} of the market, while {tool2} commands {marketShare2}, reflecting their respective positions in the industry.",
    "{tool1} and {tool2} are competing for dominance in the AI-assisted development tools market, with {marketShare1} and {marketShare2} market shares respectively.",
    "The AI-powered developer tools landscape is currently led by {tool1} with {marketShare1} market share, closely followed by {tool2} with {marketShare2}.",
    "With {marketShare1} of the market, {tool1} is a major player in the AI-assisted coding tools space, while {tool2} is rapidly growing with its {marketShare2} market share.",
    "{tool1} and {tool2} are neck-and-neck in the race for market dominance, holding {marketShare1} and {marketShare2} of the market share respectively."
  ],
  pricing: [
    "{tool1} offers a {pricingModel1} pricing model with tiers ranging from {lowestPrice1} to {highestPrice1}, while {tool2} provides a {pricingModel2} model with options from {lowestPrice2} to {highestPrice2}.",
    "When it comes to pricing, {tool1} and {tool2} take different approaches. {tool1} uses a {pricingModel1} model, with prices from {lowestPrice1} to {highestPrice1}, whereas {tool2} opts for a {pricingModel2} structure, ranging from {lowestPrice2} to {highestPrice2}.",
    "Budget-conscious developers might prefer {tool1}'s {pricingModel1} model starting at {lowestPrice1}, while those seeking more features could lean towards {tool2}'s {pricingModel2} model, which goes up to {highestPrice2}.",
    "{tool1} and {tool2} cater to different budget ranges, with {tool1}'s {pricingModel1} model spanning from {lowestPrice1} to {highestPrice1}, and {tool2}'s {pricingModel2} model covering {lowestPrice2} to {highestPrice2}.",
    "The pricing structures of {tool1} and {tool2} reflect their target markets, with {tool1} offering a {pricingModel1} model ({lowestPrice1} - {highestPrice1}) and {tool2} providing a {pricingModel2} approach ({lowestPrice2} - {highestPrice2})."
  ],
  languageSupport: [
    "In terms of language support, {tool1} covers {languageCount1} languages including {topLanguages1}, while {tool2} supports {languageCount2} languages such as {topLanguages2}.",
    "Developers working with multiple languages will find that {tool1} supports {languageCount1} languages, notably {topLanguages1}, whereas {tool2} covers {languageCount2} languages, including {topLanguages2}.",
    "{tool1} and {tool2} both offer extensive language support, with {tool1} covering {languageCount1} languages (e.g., {topLanguages1}) and {tool2} supporting {languageCount2} languages (including {topLanguages2}).",
    "The language versatility of these tools is impressive, with {tool1} supporting {languageCount1} languages like {topLanguages1}, and {tool2} offering support for {languageCount2} languages, such as {topLanguages2}.",
    "For polyglot developers, both tools offer broad language support: {tool1} covers {languageCount1} languages including {topLanguages1}, while {tool2} supports {languageCount2} languages such as {topLanguages2}."
  ],
  uniqueFeatures: [
    "What sets {tool1} apart is its {uniqueFeature1}, while {tool2} distinguishes itself with its {uniqueFeature2}, offering developers distinct advantages in their respective areas.",
    "{tool1}'s standout feature is its {uniqueFeature1}, which addresses a crucial need in development. On the other hand, {tool2}'s {uniqueFeature2} provides a novel solution to common coding challenges.",
    "Developers are drawn to {tool1} for its innovative {uniqueFeature1}, while {tool2}'s {uniqueFeature2} has been making waves in the development community.",
    "The {uniqueFeature1} of {tool1} has been a game-changer for many developers, whereas {tool2}'s {uniqueFeature2} offers a fresh perspective on coding assistance.",
    "In the competitive landscape of AI-assisted development tools, {tool1}'s {uniqueFeature1} and {tool2}'s {uniqueFeature2} stand out as unique offerings that cater to specific developer needs."
  ],
  communityAndSupport: [
    "{tool1} boasts a vibrant community with {communitySize1} active users and offers support through {supportChannels1}, while {tool2} has a growing user base of {communitySize2} and provides assistance via {supportChannels2}.",
    "When it comes to community and support, {tool1} shines with its {communitySize1}-strong user base and {supportChannels1} support channels. {tool2}, meanwhile, is building a solid foundation with {communitySize2} users and support through {supportChannels2}.",
    "Developers seeking a strong community might lean towards {tool1} with its {communitySize1} active users and support via {supportChannels1}, while those preferring a more intimate community could opt for {tool2} with its {communitySize2} users and {supportChannels2} support options.",
    "The community aspect is strong in both tools, with {tool1} fostering a large ecosystem of {communitySize1} users and offering {supportChannels1} for support, and {tool2} nurturing a dedicated base of {communitySize2} users with support through {supportChannels2}.",
    "{tool1} and {tool2} both prioritize user support and community building, evident in {tool1}'s {communitySize1}-strong user base with {supportChannels1} support, and {tool2}'s growing community of {communitySize2} users supported through {supportChannels2}."
  ],
  conclusion: [
    "In conclusion, both {tool1} and {tool2} offer unique strengths to developers. Your choice between them will likely depend on your specific needs, preferred languages, and development workflow.",
    "Ultimately, the decision between {tool1} and {tool2} comes down to your individual requirements. Both tools have their merits and can significantly enhance your coding experience in different ways.",
    "Whether you choose {tool1} or {tool2}, you'll be equipping yourself with a powerful AI-assisted development tool. Consider your project needs, team size, and budget to make the best decision for your situation.",
    "As we've seen, {tool1} and {tool2} each bring valuable features to the table. Your optimal choice will depend on factors like your development focus, team structure, and the specific challenges you're looking to address.",
    "In the end, both {tool1} and {tool2} are robust options in the AI-assisted development tool space. Carefully weigh their features, pricing, and community support to determine which aligns best with your development goals and practices."
  ]
};

module.exports = {
  generateComparison: function(tool1, tool2) {
    const getRandomSentence = (key) => 
      sentenceVariations[key][Math.floor(Math.random() * sentenceVariations[key].length)];

    const getTopLanguages = (tool) => {
      const languages = Object.entries(tool.language_support || {})
        .filter(([_, supported]) => supported)
        .map(([lang, _]) => lang);
      return languages.slice(0, 3).join(', ') || 'various programming languages';
    };

    const getLowestHighestPrice = (tool) => {
      const prices = (tool.pricing?.tiers || []).map(tier => parseFloat(tier.price?.replace(/[^0-9.-]+/g, "") || '0'))
        .filter(price => !isNaN(price));
      return {
        lowest: prices.length ? Math.min(...prices) : 0,
        highest: prices.length ? Math.max(...prices) : 0
      };
    };

    let comparison = '';

    // Introduction
    comparison += getRandomSentence('intro')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2');

    comparison += '\n\n'; // Add line breaks between sections

    // Purpose
    comparison += getRandomSentence('purpose')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{purpose1}/g, tool1.description || 'assist developers')
      .replace(/{purpose2}/g, tool2.description || 'assist developers');

    comparison += '\n\n'; // Add line breaks between sections

    // Market Position
    if (tool1.market_position?.market_share && tool2.market_position?.market_share) {
      comparison += getRandomSentence('marketPosition')
        .replace(/{tool1}/g, tool1.name || 'Tool 1')
        .replace(/{tool2}/g, tool2.name || 'Tool 2')
        .replace(/{marketShare1}/g, tool1.market_position.market_share)
        .replace(/{marketShare2}/g, tool2.market_position.market_share);

      comparison += '\n\n'; // Add line breaks between sections
    }

    // Pricing
    const price1 = getLowestHighestPrice(tool1);
    const price2 = getLowestHighestPrice(tool2);
    comparison += getRandomSentence('pricing')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{pricingModel1}/g, tool1.pricing?.model || 'flexible')
      .replace(/{pricingModel2}/g, tool2.pricing?.model || 'flexible')
      .replace(/{lowestPrice1}/g, `$${price1.lowest}`)
      .replace(/{highestPrice1}/g, `$${price1.highest}`)
      .replace(/{lowestPrice2}/g, `$${price2.lowest}`)
      .replace(/{highestPrice2}/g, `$${price2.highest}`);

    comparison += '\n\n'; // Add line breaks between sections

    // Language Support
    comparison += getRandomSentence('languageSupport')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{languageCount1}/g, Object.values(tool1.language_support || {}).filter(Boolean).length.toString())
      .replace(/{languageCount2}/g, Object.values(tool2.language_support || {}).filter(Boolean).length.toString())
      .replace(/{topLanguages1}/g, getTopLanguages(tool1))
      .replace(/{topLanguages2}/g, getTopLanguages(tool2));

    comparison += '\n\n'; // Add line breaks between sections

    // Unique Features
    const uniqueFeature1 = tool1.market_position?.unique_selling_points?.[0] || 'unique features';
    const uniqueFeature2 = tool2.market_position?.unique_selling_points?.[0] || 'unique features';
    comparison += getRandomSentence('uniqueFeatures')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{uniqueFeature1}/g, uniqueFeature1)
      .replace(/{uniqueFeature2}/g, uniqueFeature2);

    comparison += '\n\n'; // Add line breaks between sections

    // Community and Support
    comparison += getRandomSentence('communityAndSupport')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2')
      .replace(/{communitySize1}/g, (tool1.usage_stats?.number_of_users || 0).toLocaleString())
      .replace(/{communitySize2}/g, (tool2.usage_stats?.number_of_users || 0).toLocaleString())
      .replace(/{supportChannels1}/g, tool1.support?.support_channels?.join(' and ') || 'various channels')
      .replace(/{supportChannels2}/g, tool2.support?.support_channels?.join(' and ') || 'various channels');

    comparison += '\n\n'; // Add line breaks between sections

    // Conclusion
    comparison += getRandomSentence('conclusion')
      .replace(/{tool1}/g, tool1.name || 'Tool 1')
      .replace(/{tool2}/g, tool2.name || 'Tool 2');

    // Conditional rendering for review links
    if (tool1.review_link || tool2.review_link) {
      comparison += '\n\nFor more in-depth analysis:';
      if (tool1.review_link) {
        comparison += `\n- Check out my detailed review of ${tool1.name || 'Tool 1'} [here](${tool1.review_link}).`;
      }
      if (tool2.review_link) {
        comparison += `\n- Read my comprehensive review of ${tool2.name || 'Tool 2'} [here](${tool2.review_link}).`;
      }
    }

    return comparison;
  }
};