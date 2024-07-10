const emojiMap = {
  // Deployment
  local: '💻',
  cloud: '☁️',
  on_premises: '🏢',
  founding_year: '🏛️',
  funding: '💰',

  // Scalability
  horizontal: '↔️',
  vertical: '↕️',
  distributed: '🌐',

  user_reviews: '👥',

  // Support
  support_channels: '📞',
  documentation_quality: '📚',
  community_support: '🌐',

  // Usage Stats
  number_of_users: '👥',
  number_of_integrations: '🔗',
  github_stars: '⭐',

  // Performance
  latency: '⏱️',
  uptime: '📈',
  scalability: '📊',

  // Market Position
  market_share: '📊',
  competitors: '🏢',
  unique_selling_points: '💡',

  // Innovation
  recent_updates: '🆕',
  future_roadmap: '🛣️',

  // Case Studies
  case_studies: '📖',

  // Multimedia
  demo_videos: '🎥',
  blog_posts: '📝',

  // Internationalization
  language_support: '🌐',
  localization: '🌍',

  usage_stats: '📊',
  performance: '🚀',
  market_position: '📈',
  innovation: '💡',
  multimedia: '🎬',
  internationalization: '🌍',
  works_in_browser: '🌐',
  supports_autotranscribe: '🗣️',
  edit_via_transcription: '✍️',

  support: '🛠️',
  support_channels: '📞',
  documentation_quality: '📚',
  community_support: '🌐',
  average_rating: '⭐',
  number_of_reviews: '📝',
  // Data Management
  import: '📥',
  update_deletion: '🔄',
  backup_restore: '💾',
  // Usage Stats
  number_of_users: '👥',
  number_of_integrations: '🔗',
  github_stars: '⭐',
  // Market Position
  market_share: '📊',
  competitors: '🏢',
  unique_selling_points: '💡',

  // Vector Similarity Search
  distance_metrics: '📏',
  ann_algorithms: '🔍',
  filtering: '🧹',
  post_processing: '🔧',

  // Integration API
  sdks: '🧰',
  rest_api: '🌐',
  graphql_api: '📊',
  grpc_api: '⚡',

  // Security
  authentication: '🔐',
  encryption: '🔒',
  access_control: '🚦',
  soc2_compliance: '📜',
  gdpr_compliance: '🇪🇺',
  encrypted_at_rest: '💤',
  encrypted_in_transit: '🚚',
  multitenancy: '👥',

  // Community & Ecosystem
  open_source: '📖',
  community_support: '🤝',
  integration_frameworks: '🔗',

  // Pricing
  free_tier: '🆓',
  pay_as_you_go: '💸',
  enterprise_plans: '🏢',

  // Additional Features
  metadata_support: '📋',
  batch_processing: '📦',
  monitoring_logging: '📊',

  // Business Info
  company_name: '🏛️',
  founded: '🎂',
  headquarters: '🏠',
  total_funding: '💰',
  latest_valuation: '📈',
  funding_rounds: '💼',
  key_people: '👥',
  employee_count: '👨‍👩‍👧‍👦',
  revenue: '💵',
  market_share: '🥧',
  industry: '🏭',
  competitors: '🥊',
  partnerships: '🤝',
  acquisitions: '🛒',
  investors: '🦈',
  stock_symbol: '📊',

  // Specific Details
  unique_feature: '🌟',
  performance_metric: '⚡',

  // Categories
  deployment: '🚀',
  scalability: '📈',
  data_management: '📊',
  vector_similarity_search: '🔍',
  integration_api: '🔌',
  security: '🔒',
  community_ecosystem: '🌐',
  pricing: '💰',
  additional_features: '➕',
  business_information: '🏢',

  // Chat Interface
  chat_interface: '💬',

  // Creator
  creator: '👤',

  // Language Support
  language_support: '🌐',

  // Supports Local Model
  supports_local_model: '🏠',

  // Supports Offline Use
  supports_offline_use: '📴',

  // Review Link
  review_link: '🔗',

  // Homepage Link
  homepage_link: '🏠',

  // Other
  description: '📝',
  importance: '❗',
  name: '📛',
  logoId: '🖼️',
  categories: '📁',
  features: '🔧',
  databases: '🗄️',
  specific_details: '🔬',
  business_info: '💼',

  // Original yes/no and true/false entries
  'yes': '✅',
  'no': '❌',
  'true': '✅',
  'false': '❌',
};

export function getEmoji(key) {
  return emojiMap[key.toLowerCase()] || '';
}
