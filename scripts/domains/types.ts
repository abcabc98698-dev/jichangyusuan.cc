export interface DomainSpec {
  answerFirst: string;
  concept: string;
  tableTitle: string;
  tableHeaders: string[];
  tableRows: string[][];
  algorithm: string;
  workedExample: string;
  boundaryRule: string;
  pitfalls: Array<{ title: string; desc: string }>;
  faqs: Array<{ q: string; a: string; ref: string }>;
}

export type DomainSpecBuilder = (secondaryId: string, art: { title: string; url: string; clusterId: string }) => DomainSpec;
