import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { WorkEntryPage } from "src/components/WorkEntryPage/WorkEntryPage.component";
import type { Work } from "src/contentful/getWork";
import { fetchAllWork, fetchWork } from "src/contentful/getWork";
import { outputSitemap } from "src/lib/generateSitemap";
import type { SitemapItem } from "src/lib/generateSitemap";
import {
	EXCLUDED_PAGE_SLUGS_FROM_BUILD,
	TEST_PAGE_SLUG,
} from "src/utils/constants";

interface WorkParams {
	slug: string;
}

interface WorkProps {
	params: WorkParams;
}

// Tell Next.js about all our work entries so
// they can be statically generated at build time.
export async function generateStaticParams(): Promise<WorkParams[]> {
	const workEntries = await fetchAllWork({ preview: false });

	if (workEntries) {
		// Generate Sitemap
		const routes: SitemapItem[] = workEntries
			.map((page: Work) => {
				if (page.workSlug.includes(TEST_PAGE_SLUG)) {
					return {
						route: "",
						modTime: "",
					};
				}

				return {
					route: `/work/${page.workSlug}`,
					modTime: page.updatedAt,
				};
			})
			.filter((item: SitemapItem) => item.route.length);

		outputSitemap(routes, "work");
	}

	return workEntries
		.filter((work) => !EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(work.workSlug))
		.map((work) => ({ slug: work.workSlug }));
}

// For each work entry, tell Next.js which metadata
// (e.g. work title) to display.
export async function generateMetadata({
	params,
}: WorkProps): Promise<Metadata> {
	const workEntry = await fetchWork({
		slug: params.slug,
		preview: draftMode().isEnabled,
	});

	if (!workEntry) {
		return notFound();
	}

	return {
		title: `${workEntry.workTitle} | After Avenue`,
		robots: "index, follow",
	};
}

// The actual WorkEntry component.
async function WorkEntry({ params }: WorkProps) {
	// Fetch a single work entry by slug,
	// using the content preview if draft mode is enabled:
	const workEntry = await fetchWork({
		slug: params.slug,
		preview: draftMode().isEnabled,
	});

	if (!workEntry) {
		// If a work entry can't be found,
		// tell Next.js to render a 404 page.
		return notFound();
	}

	return <WorkEntryPage workEntry={workEntry} />;
}

export default WorkEntry;