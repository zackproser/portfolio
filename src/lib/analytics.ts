export function trackPurchase(purchaseData: {
    transactionId: string
    value: number
    itemName: string
  }) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-1009082087/lDmiCNPQ8ZYZEOe9leED',
        'value': purchaseData.value,
        'currency': 'USD',
        'transaction_id': purchaseData.transactionId,
        'items': [{
          'name': purchaseData.itemName
        }]
      });
    }
  }