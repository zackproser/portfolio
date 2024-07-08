import React from 'react';

const PricingDetails = ({ pricing }) => {
  if (!pricing || Object.keys(pricing).length === 0) {
    return <div className="text-center p-4">😴 No pricing information provided.</div>;
  }

  const { model, tiers, discounts, payment_methods, freeTier } = pricing;

  return (
    <div className="mt-4 mb-8">
      <h2 className="text-xl font-bold mb-4">💰 Pricing</h2>
      <div className="space-y-4">
        <div className="p-4 bg-blue-100 rounded-lg shadow-lg">
          <strong>📦 Model:</strong> {model}
        </div>
        <div className="p-4 bg-blue-100 rounded-lg shadow-lg">
          <strong>🎁 Free Tier:</strong> {freeTier ? 'Available ✅' : 'Not Available ❌'}
        </div>
        <div className="p-4 bg-blue-100 rounded-lg shadow-lg">
          <strong>💸 Discounts:</strong> {discounts}
        </div>
        <div className="p-4 bg-blue-100 rounded-lg shadow-lg">
          <strong>💳 Payment Methods:</strong> {payment_methods.join(', ')}
        </div>
        <div className="p-4 bg-blue-100 rounded-lg shadow-lg">
          <strong>📊 Tiers:</strong>
          <ul className="list-disc list-inside">
            {tiers.map((tier, index) => (
              <li key={index}>
                {tier.name}: {tier.price}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingDetails;