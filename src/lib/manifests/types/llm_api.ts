// LLM API facts shape for developer comparisons
export type USDPer1K = number;

export interface LlmApiFacts {
  vendor: "openai" | "anthropic" | "cohere" | "google" | "mistral" | "other";
  auth: { 
    scheme: "bearer" | "api_key" | "oauth2"; 
    header: string; 
    base_url: string 
  };
  models: Array<{
    name: string;                            // "gpt-4o", "claude-3-7-sonnet"
    modality: Array<"text" | "image" | "audio" | "video" | "embeddings">;
    context_tokens_max?: number;             // integer tokens; omit if not published
    supports: {
      streaming: boolean;
      tools_function_calling: boolean;
      json_mode: boolean;
      system_prompt: boolean;
      batch?: boolean;
      parallel_tool_calls?: boolean;
    };
    pricing: {
      input_per_1k?: USDPer1K;
      output_per_1k?: USDPer1K;
      embeddings_per_1k?: USDPer1K;
      notes?: string;
    };
    rate_limits?: {
      rpm?: number | null;
      tpm?: number | null;
      burst?: number | null;
      notes?: string;
    };
    availability: "ga" | "beta" | "preview" | "eap" | "deprecated";
  }>;
  sdks: { 
    official: Array<"python" | "javascript" | "go" | "java" | "csharp" | "ruby" | "other">; 
    community?: string[] 
  };
  terms?: { 
    allowed_prod_use: boolean; 
    pii_restrictions?: string; 
    data_retention_days?: number | null 
  };
}

// JSON Schema for validation
export const llmApiFactsSchema = {
  type: "object",
  properties: {
    vendor: {
      type: "string",
      enum: ["openai", "anthropic", "cohere", "google", "mistral", "other"]
    },
    auth: {
      type: "object",
      properties: {
        scheme: { type: "string", enum: ["bearer", "api_key", "oauth2"] },
        header: { type: "string" },
        base_url: { type: "string" }
      },
      required: ["scheme", "header", "base_url"],
      additionalProperties: false
    },
    models: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          modality: {
            type: "array",
            items: { type: "string", enum: ["text", "image", "audio", "video", "embeddings"] }
          },
          context_tokens_max: { type: "integer", minimum: 1 },
          supports: {
            type: "object",
            properties: {
              streaming: { type: "boolean" },
              tools_function_calling: { type: "boolean" },
              json_mode: { type: "boolean" },
              system_prompt: { type: "boolean" },
              batch: { type: "boolean" },
              parallel_tool_calls: { type: "boolean" }
            },
            required: ["streaming", "tools_function_calling", "json_mode", "system_prompt"],
            additionalProperties: false
          },
          pricing: {
            type: "object",
            properties: {
              input_per_1k: { type: "number", minimum: 0 },
              output_per_1k: { type: "number", minimum: 0 },
              embeddings_per_1k: { type: "number", minimum: 0 },
              notes: { type: "string" }
            },
            additionalProperties: false
          },
          rate_limits: {
            type: "object",
            properties: {
              rpm: { type: ["number", "null"], minimum: 0 },
              tpm: { type: ["number", "null"], minimum: 0 },
              burst: { type: ["number", "null"], minimum: 0 },
              notes: { type: "string" }
            },
            additionalProperties: false
          },
          availability: {
            type: "string",
            enum: ["ga", "beta", "preview", "eap", "deprecated"]
          }
        },
        required: ["name", "modality", "supports", "pricing", "availability"],
        additionalProperties: false
      }
    },
    sdks: {
      type: "object",
      properties: {
        official: {
          type: "array",
          items: { type: "string", enum: ["python", "javascript", "go", "java", "csharp", "ruby", "other"] }
        },
        community: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["official"],
      additionalProperties: false
    },
    terms: {
      type: "object",
      properties: {
        allowed_prod_use: { type: "boolean" },
        pii_restrictions: { type: "string" },
        data_retention_days: { type: ["number", "null"], minimum: 0 }
      },
      required: ["allowed_prod_use"],
      additionalProperties: false
    }
  },
  required: ["vendor", "auth", "models", "sdks"],
  additionalProperties: false
};
