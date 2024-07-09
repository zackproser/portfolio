import React from 'react';
import { getEmoji } from '@/lib/emojiMapping';

const BusinessInfoBlade = ({ category, description, creator, supportsLocalModel, supportsOfflineUse }) => {
  return (
    <div className="mb-6">
      <div className="space-y-2">
        <div>
          <strong>{getEmoji('category')} Category:</strong> {category}
        </div>
        <div>
          <strong>{getEmoji('description')} Description:</strong> {description}
        </div>
        <div>
          <strong>{getEmoji('creator')} Creator:</strong> {creator}
        </div>
        <div>
          <strong>{getEmoji('supports_local_model')} Supports Local Model:</strong> {supportsLocalModel ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>{getEmoji('supports_offline_use')} Supports Offline Use:</strong> {supportsOfflineUse ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoBlade;