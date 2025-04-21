// The Tool type definition below is now handled by Prisma

export interface Category {
  id: string;
  name: string;
}

export interface ToolComparison {
  id: string;
  name: string;
  value: string | boolean | number | null;
} 