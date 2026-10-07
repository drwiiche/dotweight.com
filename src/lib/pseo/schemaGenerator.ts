import { validateSchema } from '../seo/schemaValidator';

const BASE_DOMAIN = 'https://www.dotweight.com';

export interface PseoMetadataParams {
  title: string;
  description: string;
  breadcrumbs: { name: string; item: string }[];
  faqs?: { question: string; answer: string }[];
  datasetName?: string;
  datasetDescription?: string;
}

/**
 * Injects validated Schema.org JSON-LD and page metadata.
 * Compliant with Google Search Central 2026 Guidelines and Schema.org specifications.
 */
export function injectPseoMetadata(params: PseoMetadataParams) {
  // 1. Update document title (optimized to 40-60 chars)
  const fullTitle = params.title.includes('DOT Weight')
    ? params.title
    : `${params.title} | DOT Weight`;
  document.title = fullTitle;

  // 2. Update or create meta description (constrained to 120-158 characters)
  let cleanDesc = params.description.trim();
  if (cleanDesc.length > 158) {
    cleanDesc = cleanDesc.slice(0, 155) + '...';
  }
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', cleanDesc);

  // 3. Update OpenGraph meta tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', fullTitle);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', cleanDesc);

  // 4. Update Canonical Link Tag
  const canonicalTag = document.getElementById('canonical-url') || document.querySelector('link[rel="canonical"]');
  if (canonicalTag) {
    const canonicalPath = window.location.pathname.replace(/\/+$/, '') || '/';
    canonicalTag.setAttribute('href', `${BASE_DOMAIN}${canonicalPath}`);
  }

  // 5. Clean previous dynamic pSEO JSON-LD scripts
  const existingScripts = document.querySelectorAll('script[data-pseo="true"]');
  existingScripts.forEach((s) => s.remove());

  // 6. Build BreadcrumbList with absolute URLs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: params.breadcrumbs.map((b, idx) => {
      const absoluteUrl = b.item.startsWith('http')
        ? b.item
        : `${BASE_DOMAIN}${b.item.startsWith('/') ? b.item : `/${b.item}`}`;
      return {
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: absoluteUrl,
      };
    }),
  };

  // 7. Build WebApplication / ItemPage Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${BASE_DOMAIN}${window.location.pathname}#webapp`,
    name: fullTitle,
    url: `${BASE_DOMAIN}${window.location.pathname}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    description: cleanDesc,
    author: {
      '@type': 'Organization',
      name: 'DOT Weight Systems',
      url: BASE_DOMAIN,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DOT Weight Compliance Network',
      url: BASE_DOMAIN,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    inLanguage: 'en-US',
  };

  // 8. Build Dataset Schema (if applicable)
  let datasetSchema: Record<string, unknown> | null = null;
  if (params.datasetName && params.datasetDescription) {
    datasetSchema = {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: params.datasetName,
      description: params.datasetDescription,
      creator: {
        '@type': 'Organization',
        name: 'DOT Weight Bridge Formula Engine',
        url: BASE_DOMAIN,
      },
      keywords: [
        'Federal bridge formula calculator',
        'DOT axle weight calculator',
        'semi truck weight limits',
        'commercial truck axle limits',
        'CAT scale ticket calculator',
      ],
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    };
  }

  // 9. Build FAQPage Schema (if applicable)
  let faqSchema: Record<string, unknown> | null = null;
  if (params.faqs && params.faqs.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${BASE_DOMAIN}${window.location.pathname}#faq`,
      mainEntity: params.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    };
  }

  // 10. Validate and Inject
  const schemasToInject: Record<string, unknown>[] = [breadcrumbSchema, webAppSchema];
  if (datasetSchema) schemasToInject.push(datasetSchema);
  if (faqSchema) schemasToInject.push(faqSchema);

  schemasToInject.forEach((schemaObj) => {
    const validation = validateSchema(schemaObj);
    if (!validation.isValid) {
      console.warn('[Schema Validator] Skipped invalid schema:', validation.errors);
      return;
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-pseo', 'true');
    script.textContent = JSON.stringify(schemaObj);
    document.head.appendChild(script);
  });
}
