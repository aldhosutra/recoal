import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className={clsx('hero hero--primary', styles.heroBanner)}>
			<div className="container">
				<Heading as="h1" className="hero__title">
					{siteConfig.title}
				</Heading>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<div className={styles.buttons}>
					<Link className="button button--secondary button--lg" to="/docs/intro">
						Getting Started
					</Link>
				</div>
			</div>
		</header>
	);
}

export default function Home(): ReactNode {
	// const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={`recoal - JavaScript/TypeScript Request Coalescing and Caching`}
			description="A lightweight and efficient JavaScript/TypeScript library for request coalescing — merge concurrent identical async calls into a single request to reduce load and improve performance."
		>
			<HomepageHeader />
			<main>
				<HomepageFeatures />
			</main>
		</Layout>
	);
}
