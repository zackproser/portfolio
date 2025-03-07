// Database interface for vector database comparisons
export interface Database {
  id: string;
  name: string;
  logoId: string;
  description: string;
  deployment?: {
    local?: boolean;
    cloud?: boolean;
    on_premises?: boolean;
  };
  scalability?: {
    horizontal?: boolean;
    vertical?: boolean;
    distributed?: boolean;
  };
  data_management?: {
    import?: boolean;
    update_deletion?: boolean;
    backup_restore?: boolean;
  };
  vector_similarity_search?: {
    distance_metrics?: string[];
    ann_algorithms?: string[];
    filtering?: boolean;
    post_processing?: boolean;
  };
  integration_api?: {
    sdks?: string[];
    rest_api?: boolean;
    graphql_api?: boolean;
    grpc_api?: boolean;
  };
  security?: {
    authentication?: boolean;
    encryption?: boolean;
    access_control?: boolean;
  };
  community_ecosystem?: {
    open_source?: boolean;
    community_support?: boolean;
    integration_frameworks?: string[];
  };
  pricing?: {
    free_tier?: boolean;
    pay_as_you_go?: boolean;
    enterprise_plans?: boolean;
  };
  additional_features?: {
    metadata_support?: boolean;
    batch_processing?: boolean;
    monitoring_logging?: boolean;
  };
  specific_details?: {
    unique_feature?: string;
    performance_metric?: string;
  };
  business_info: {
    company_name?: string;
    founded?: number;
    headquarters?: string;
    total_funding?: string;
    latest_valuation: string;
    funding_rounds: Array<{ date: string; amount: string; series: string }>;
    key_people: Array<{ name: string; position: string }>;
    employee_count: string;
    [key: string]: any;
  };
  company: {
    name: string;
    founded: number;
    funding: string;
    employees: number;
  };
  features: {
    [key: string]: boolean | string;
  };
  performance: {
    latency: string;
    throughput: string;
    scalability: string;
    queryLatencyMs: number;
    indexingSpeedVectorsPerSec: number;
    memoryUsageMb: number;
    scalabilityScore: number;
    accuracyScore: number;
    [key: string]: number | string;
  };
  security: {
    [key: string]: boolean | string;
  };
  algorithms: {
    [key: string]: boolean | string;
  };
  searchCapabilities: {
    [key: string]: boolean | string;
  };
  aiCapabilities: {
    features: {
      [key: string]: boolean | string;
    };
    scores: {
      llmIntegration: number;
      embeddingGeneration: number;
      ragSupport: number;
      fineTuning: number;
      modelHosting: number;
    };
    supportedModels: {
      [key: string]: boolean | string;
    };
    ragFeatures: string[];
    ragLimitations: string[];
  };
  [category: string]: { [feature: string]: any } | any;
} 