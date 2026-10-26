import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import './custom.css';

// 导入全部 13 大重点组件
import BudgetCalculator from './components/BudgetCalculator.vue';
import MonthlyAnnualComparison from './components/MonthlyAnnualComparison.vue';
import DiscountCalculator from './components/DiscountCalculator.vue';
import TrafficCostCalculator from './components/TrafficCostCalculator.vue';
import RenewalEstimator from './components/RenewalEstimator.vue';
import PriceComparisonTable from './components/PriceComparisonTable.vue';
import SourceBadge from './components/SourceBadge.vue';
import DecisionTree from './components/DecisionTree.vue';
import AnswerFirst from './components/AnswerFirst.vue';
import FAQ from './components/FAQ.vue';
import RelatedTopics from './components/RelatedTopics.vue';
import MainSiteCTA from './components/MainSiteCTA.vue';
import Disclosure from './components/Disclosure.vue';
import SearchModal from './components/SearchModal.vue';
import WorkflowSteps from './components/WorkflowSteps.vue';
import PitfallCard from './components/PitfallCard.vue';

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('BudgetCalculator', BudgetCalculator);
    app.component('MonthlyAnnualComparison', MonthlyAnnualComparison);
    app.component('DiscountCalculator', DiscountCalculator);
    app.component('TrafficCostCalculator', TrafficCostCalculator);
    app.component('RenewalEstimator', RenewalEstimator);
    app.component('PriceComparisonTable', PriceComparisonTable);
    app.component('SourceBadge', SourceBadge);
    app.component('DecisionTree', DecisionTree);
    app.component('AnswerFirst', AnswerFirst);
    app.component('FAQ', FAQ);
    app.component('RelatedTopics', RelatedTopics);
    app.component('MainSiteCTA', MainSiteCTA);
    app.component('Disclosure', Disclosure);
    app.component('SearchModal', SearchModal);
    app.component('WorkflowSteps', WorkflowSteps);
    app.component('PitfallCard', PitfallCard);
  }
} satisfies Theme;
