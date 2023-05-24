declare module 'astro:content' {
	interface Render {
		'.mdoc': Promise<{
			Content(props: Record<string, any>): import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"posts": {
"aws-cdk-with-go-hello-world.md": {
	id: "aws-cdk-with-go-hello-world.md";
  slug: "aws-cdk-with-go-hello-world";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"beginner-s-guide-to-custom-svelte-stores.md": {
	id: "beginner-s-guide-to-custom-svelte-stores.md";
  slug: "beginner-s-guide-to-custom-svelte-stores";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"building-a-graphql-server-on-deno-deploy.md": {
	id: "building-a-graphql-server-on-deno-deploy.md";
  slug: "building-a-graphql-server-on-deno-deploy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"building-notarize-a-simple-note-taking-experience.md": {
	id: "building-notarize-a-simple-note-taking-experience.md";
  slug: "building-notarize-a-simple-note-taking-experience";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"cobol-in-what-a-60-year-old-language-taught-me-about-javascript.md": {
	id: "cobol-in-what-a-60-year-old-language-taught-me-about-javascript.md";
  slug: "cobol-in-what-a-60-year-old-language-taught-me-about-javascript";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"css-only-view-transitions.md": {
	id: "css-only-view-transitions.md";
  slug: "css-only-view-transitions";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"getting-started-with-svelte-and-or-kit-.md": {
	id: "getting-started-with-svelte-and-or-kit-.md";
  slug: "getting-started-with-svelte-and-or-kit-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-i-added-themes-to-my-website-using-tailwind.md": {
	id: "how-i-added-themes-to-my-website-using-tailwind.md";
  slug: "how-i-added-themes-to-my-website-using-tailwind";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-i-boosted-my-lighthouse-score-by-15-points-in-5-minutes.md": {
	id: "how-i-boosted-my-lighthouse-score-by-15-points-in-5-minutes.md";
  slug: "how-i-boosted-my-lighthouse-score-by-15-points-in-5-minutes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"i-love-everything-about-web-components-except-writing-them.md": {
	id: "i-love-everything-about-web-components-except-writing-them.md";
  slug: "i-love-everything-about-web-components-except-writing-them";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"it-might-be-time-to-stop-checking-your-site-s-bundle-size.md": {
	id: "it-might-be-time-to-stop-checking-your-site-s-bundle-size.md";
  slug: "it-might-be-time-to-stop-checking-your-site-s-bundle-size";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"javascript-dev-does-rust-statements-expressions-and-return-values.md": {
	id: "javascript-dev-does-rust-statements-expressions-and-return-values.md";
  slug: "javascript-dev-does-rust-statements-expressions-and-return-values";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"quick-css-transition-explainer.md": {
	id: "quick-css-transition-explainer.md";
  slug: "quick-css-transition-explainer";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"rebuilding-my-personal-site-with-next-js-and-tailwindcss.md": {
	id: "rebuilding-my-personal-site-with-next-js-and-tailwindcss.md";
  slug: "rebuilding-my-personal-site-with-next-js-and-tailwindcss";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"recreating-the-macos-mail-user-interface.md": {
	id: "recreating-the-macos-mail-user-interface.md";
  slug: "recreating-the-macos-mail-user-interface";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"rust-javascript.md": {
	id: "rust-javascript.md";
  slug: "rust-javascript";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"series-on-learning-traditional-web-dev-as-a-recent-entrant-spas-ssr-etc.md": {
	id: "series-on-learning-traditional-web-dev-as-a-recent-entrant-spas-ssr-etc.md";
  slug: "series-on-learning-traditional-web-dev-as-a-recent-entrant-spas-ssr-etc";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"server-side-rendering-svelte-from-scratch.md": {
	id: "server-side-rendering-svelte-from-scratch.md";
  slug: "server-side-rendering-svelte-from-scratch";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"tailwind-as-an-educational-tool.md": {
	id: "tailwind-as-an-educational-tool.md";
  slug: "tailwind-as-an-educational-tool";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"using-supabase-as-a-backend.md": {
	id: "using-supabase-as-a-backend.md";
  slug: "using-supabase-as-a-backend";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"yet-another-portfolio-redesign.md": {
	id: "yet-another-portfolio-redesign.md";
  slug: "yet-another-portfolio-redesign";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"projects": {
"noice-memos": {
	id: "noice-memos";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
"notarize": {
	id: "notarize";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
"prisma-with-austin-crim": {
	id: "prisma-with-austin-crim";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
"remix-router-svelte": {
	id: "remix-router-svelte";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
"rust-javascript-screencast": {
	id: "rust-javascript-screencast";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
"svelte-summit-2022": {
	id: "svelte-summit-2022";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
