declare module 'tsne-js' {
  export class TSNE {
    constructor(config: {
      dim: number;
      perplexity: number;
      earlyExaggeration: number;
      learningRate: number;
      nIter: number;
    });
    
    init(config: {
      data: number[][];
      type: string;
    }): void;
    
    run(): void;
    
    getOutputScaled(): number[][];
  }
  
  export default TSNE;
} 