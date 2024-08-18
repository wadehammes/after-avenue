import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import type { WorkCategory } from "src/contentful/parseWorkCategories";
import { parseContentfulWorkCategory } from "src/contentful/parseWorkCategories";
import type { TypeWorkSkeleton } from "src/contentful/types";

type WorkEntry = Entry<TypeWorkSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>;

// Our simplified version of a Page.
// We don't need all the data that Contentful gives us.
export interface Work {
	featuredOnHomePage: boolean;
	updatedAt: string;
	workEditors?: [];
	workCategories: (WorkCategory | null)[];
	workClient: string;
	workDescription: Document | undefined | null;
	workShortClip: ContentfulAsset | null;
	workSlug: string;
	workSocialImage: ContentfulAsset | null;
	workTitle: string;
	workVideoUrl: string;
}

// A function to transform a Contentful page
// into our own Page object.
export function parseContentfulWork(workEntry?: WorkEntry): Work | null {
	if (!workEntry) {
		return null;
	}

	return {
		featuredOnHomePage: workEntry.fields?.featuredOnHomePage ?? false,
		updatedAt: workEntry.sys.updatedAt,
		workCategories:
			workEntry?.fields?.workCategories?.map((category) =>
				category ? parseContentfulWorkCategory(category) : null,
			) ?? [],
		workClient: workEntry.fields?.workClient ?? "",
		workDescription: workEntry.fields.workDescription,
		workShortClip: parseContentfulAsset(workEntry.fields.workShortClip),
		workSlug: workEntry.fields.workSlug,
		workSocialImage: parseContentfulAsset(workEntry.fields.workSocialImage),
		workTitle: workEntry.fields.workTitle,
		workVideoUrl: workEntry.fields?.workVideoUrl ?? "",
	};
}

// A function to fetch all pages.
// Optionally uses the Contentful content preview.
interface FetchAllWorkOptions {
	preview: boolean;
}

export async function fetchAllWork({
	preview,
}: FetchAllWorkOptions): Promise<Work[]> {
	const contentful = contentfulClient({ preview });

	const workResult =
		await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
			// biome-ignore lint/style/useNamingConvention: Contentful standards
			content_type: "work",
			include: 10,
			limit: 1000,
		});

	return workResult.items.map(
		(pageEntry) => parseContentfulWork(pageEntry) as Work,
	);
}

export async function fetchAllFeaturedWork({
	preview,
}: FetchAllWorkOptions): Promise<Work[]> {
	const contentful = contentfulClient({ preview });

	const workResult =
		await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
			// biome-ignore lint/style/useNamingConvention: Contentful standards
			content_type: "work",
			include: 10,
			"fields.featuredOnHomePage": true,
			limit: 1000,
		});

	return workResult.items.map(
		(pageEntry) => parseContentfulWork(pageEntry) as Work,
	);
}

// A function to fetch a single page by its slug.
// Optionally uses the Contentful content preview.
interface FetchSingleWorkOptions {
	slug: string;
	preview: boolean;
}

export async function fetchWork({
	slug,
	preview,
}: FetchSingleWorkOptions): Promise<Work | null> {
	const contentful = contentfulClient({ preview });

	const pagesResult =
		await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
			// biome-ignore lint/style/useNamingConvention: Contentful standards
			content_type: "work",
			"fields.workSlug": slug,
			include: 10,
		});

	return parseContentfulWork(pagesResult.items[0]);
}
