import React from 'react';
import { getEmoji } from '@/lib/emojiMapping';

const CapabilitiesBlade = ({ supportsLocalModel, supportsOfflineUse }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Capabilities</h2>
      <div className="space-y-2">
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

export default CapabilitiesBlade;