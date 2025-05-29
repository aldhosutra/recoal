import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
	title: string;
	Svg: React.ComponentType<React.ComponentProps<'svg'>>;
	description: ReactNode;
};

const FeatureList: FeatureItem[] = [
	{
		title: 'Request Coalescing',
		Svg: require('@site/static/img/undraw_my-files_yynz.svg').default,
		description: (
			<>
				Merge concurrent identical async or sync calls into a single request. Prevents duplicate
				network or computation, reduces load, and improves performance.
			</>
		),
	},
	{
		title: 'Smart Caching & Pruning',
		Svg: require('@site/static/img/undraw_savings_uwjn.svg').default,
		description: (
			<>
				Results are cached for a configurable TTL and expired entries are pruned automatically.
				Manual cache invalidation and pruning are also supported.
			</>
		),
	},
	{
		title: 'TypeScript, ESM & CJS Ready',
		Svg: require('@site/static/img/undraw_thought-process_pavs.svg').default,
		description: (
			<>
				Fully type-safe, works with both ESM and CommonJS, and supports custom key generators,
				concurrency limits, and advanced configuration for any project.
			</>
		),
	},
];

function Feature({ title, Svg, description }: FeatureItem) {
	return (
		<div className={clsx('col col--4')}>
			<div className="text--center">
				<Svg className={styles.featureSvg} role="img" />
			</div>
			<div className="text--center padding-horiz--md">
				<Heading as="h3">{title}</Heading>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures(): ReactNode {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
