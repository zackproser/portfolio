import React from 'react';

const PricingDetails = ({ pricing }) => {
  if (!pricing || Object.keys(pricing).length === 0) {
    return <div className="text-center p-4 text-gray-300">😴 No pricing information provided.</div>;
  }

  const { model, tiers, discounts, payment_methods, freeTier } = pricing;

  // Determine if there's a free tier in the pricing tiers
  const hasFreeOption = tiers && tiers.some(tier => 
    tier.name.toLowerCase().includes('free') || tier.price.toLowerCase().includes('free')
  );

  // Determine the price range for display
  const getPriceRange = () => {
    if (!tiers || tiers.length === 0) return 'Price not available';
    
    const priceNumbers = tiers
      .filter(tier => !tier.price.toLowerCase().includes('free') && !tier.price.toLowerCase().includes('custom'))
      .map(tier => {
        const priceMatch = tier.price.match(/\$(\d+(\.\d+)?)/);
        return priceMatch ? parseFloat(priceMatch[1]) : null;
      })
      .filter(price => price !== null);
    
    if (priceNumbers.length === 0) return hasFreeOption ? 'Free - Custom' : 'Custom pricing';
    
    const minPrice = Math.min(...priceNumbers);
    const maxPrice = Math.max(...priceNumbers);
    
    if (minPrice === maxPrice) return `$${minPrice}/mo`;
    return hasFreeOption ? `Free - $${maxPrice}/mo` : `$${minPrice} - $${maxPrice}/mo`;
  };

  return (
    <div className="mt-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Investment Options</span>
        <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-xs px-2 py-1 rounded-full">
          {getPriceRange()}
        </span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left side - pricing info */}
        <div className="md:col-span-4 p-5 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Pricing Model</div>
            <div className="font-medium text-gray-800 dark:text-gray-200 capitalize">{model}</div>
          </div>
          
          {hasFreeOption && (
            <div className="mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300">Free Tier Available</span>
            </div>
          )}
          
          {discounts && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Discounts</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{discounts}</div>
            </div>
          )}
          
          {payment_methods && payment_methods.length > 0 && (
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Payment Methods</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {payment_methods.map((method, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right side - pricing tiers */}
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiers && tiers.map((tier, index) => {
              const isPopular = tier.name.toLowerCase().includes('pro');
              const isFree = tier.name.toLowerCase().includes('free') || tier.price.toLowerCase().includes('free');
              const isEnterprise = tier.name.toLowerCase().includes('enterprise') || tier.price.toLowerCase().includes('custom');
              
              return (
                <div 
                  key={index} 
                  className={`relative p-5 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border 
                    ${isPopular ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {tier.price}
                    </div>
                  </div>
                  
                  {isFree && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                      Great for trying out the platform
                    </div>
                  )}
                  
                  {isPopular && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                      Perfect for professionals and teams
                    </div>
                  )}
                  
                  {isEnterprise && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                      For organizations with custom requirements
                    </div>
                  )}
                  
                  <div className="mt-5">
                    <button 
                      className={`w-full py-2 rounded-lg text-center font-medium ${
                        isPopular 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                      }`}
                    >
                      {isFree ? 'Start Free' : isEnterprise ? 'Contact Sales' : 'Choose Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Prices shown are for reference only. Pricing may vary based on usage volume, contract length, and enterprise requirements. Contact the vendor for detailed pricing information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingDetails;