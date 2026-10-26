export interface WorkflowStepItem {
  name: string;
  description: string;
  action?: string;
}

export interface PitfallItem {
  title: string;
  desc: string;
  level?: string;
  action?: string;
}

export interface FAQItemSpec {
  q: string;
  a: string;
  ref: string;
}

export interface DomainSpec {
  answerFirst: string;
  concept: string;
  tableTitle: string;
  tableHeaders: string[];
  tableRows: string[][];
  algorithm: string;
  workflowSteps?: WorkflowStepItem[];
  workedExample: string;
  boundaryRule: string;
  pitfalls: PitfallItem[];
  faqs: FAQItemSpec[];
}

export type DomainSpecBuilder = (secondaryId: string, art: { title: string; url: string; clusterId: string }) => DomainSpec;
