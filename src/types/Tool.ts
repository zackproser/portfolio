export type Tool = {
  name: string;
  slug: string;
  icon: string;
  description: string;
  category: string;
  open_source: boolean | {
    client: boolean;
    backend: boolean;
    model: boolean;
  };
  ide_support: {
    vs_code: boolean;
    jetbrains: boolean;
    neovim: boolean;
    visual_studio: boolean;
    vim: boolean;
    emacs: boolean;
    intellij: boolean;
  };
  pricing: {
    model: string;
    tiers: Array<{
      name: string;
      price: string;
    }>;
  };
  free_tier: boolean;
  chat_interface: boolean;
  creator: string;
  language_support: {
    python: boolean;
    javascript: boolean;
    java: boolean;
    cpp: boolean;
    typescript?: boolean;
    go?: boolean;
    php?: boolean;
    swift?: boolean;
    csharp?: boolean;
  };
  supports_local_model: boolean;
  supports_offline_use: boolean;
  review_link: string | null;
  homepage_link: string;
};
