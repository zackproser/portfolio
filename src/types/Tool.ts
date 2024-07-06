export type Tool = {
    title: string;
    slug: string;
    description: string;
    category: string;
    pricing: string;
    freeTier: boolean;
    chatInterface: boolean;
    supportsLocalModel: boolean;
    supportsOfflineUse: boolean;
    ideSupport: {
      vsCode: boolean;
      jetbrains: boolean;
      neovim: boolean;
      visualStudio: boolean;
      vim: boolean;
      emacs: boolean;
      intellij: boolean;
    };
    languageSupport: {
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
    homepageUrl: string;
    reviewUrl: string;
  };