// File: components/BuyButton.tsx
import React from 'react';

const BuyButton = () => {
  const handleBuyClick = async () => {
    console.log(`handleBuyClick`)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: 'git-going',
          amount: 5000, // Amount in cents, $50.00
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Stripe checkout
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
      } else {
        console.error('Error:', data.error);
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: An unexpected error occurred');
    }
  };

  return (
    <button
      onClick={handleBuyClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Buy git-going
    </button>
  );
};

export default BuyButton;

