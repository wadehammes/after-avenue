import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { WorkPage } from "src/components/WorkPage/WorkPage.component";
import { fetchPage } from "src/contentful/getPages";
import { fetchAllWork } from "src/contentful/getWork";
import { WORK_SLUG } from "src/utils/constants";

// Fetch the work page, tell Next.js which metadata
// (e.g. page title) to display.
export async function generateMetadata(): Promise<Metadata> {
	const workPage = await fetchPage({
		slug: WORK_SLUG,
		preview: draftMode().isEnabled,
	});

	if (!workPage) {
		return notFound();
	}

	return {
		title: `${workPage.pageTitle} | After Avenue`,
		robots: "index, follow",
	};
}

// The actual Work component.
async function Work() {
	// Fetch the work page entry by slug,
	// using the content preview if draft mode is enabled:
	const workPage = await fetchPage({
		slug: WORK_SLUG,
		preview: draftMode().isEnabled,
	});

	// Fetch all work entries
	const allWork = await fetchAllWork({ preview: draftMode().isEnabled });

	if (!workPage) {
		// If a work entry can't be found,
		// tell Next.js to render a 404 page.
		return notFound();
	}

	return <WorkPage pageFields={workPage} allWork={allWork} />;
}

export default Work;
