import Callout from './Callout.astro';
import CodeTabs from './CodeTabs.astro';
import Playground from './Playground.astro';
import QA from './QA.astro';

// Components available inside every MDX file without an import.
export const mdxComponents = { Callout, CodeTabs, Playground, QA };
