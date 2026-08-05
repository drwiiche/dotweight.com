export function injectPseoMetadata(params: {
  title: string;
  description: string;
  breadcrumbs: { name: string; item: string }[];
  faqs?: { question: string; answer: string }[];
  datasetName?: string;
  datasetDescription?: string;
}) {
  // Update document title
  document.title = `${params.title} | AxleGuard DOT Calculator`;

  // Update or create meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', params.description);

  // Clean existing pSEO JSON-LD scripts
  const existingScripts = document.querySelectorAll('script[data-pseo="true"]');
  existingScripts.forEach((s) => s.remove());

  // 1. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: params.breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: b.item,
    })),
  };

  // 2. TechArticle Schema
  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: params.title,
    description: params.description,
    articleBody: `${params.title}. ${params.description}`,
    author: {
      '@type': 'Organization',
      name: 'AxleGuard DOT Compliance System',
      url: 'https://axleguard.org',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AxleGuard Bridge Formula Engine',
    },
    inLanguage: 'en-US',
  };

  // 3. Dataset Schema (if applicable)
  let datasetSchema: object | null = null;
  if (params.datasetName && params.datasetDescription) {
    datasetSchema = {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: params.datasetName,
      description: params.datasetDescription,
      creator: {
        '@type': 'Organization',
        name: 'Federal Highway Administration / AxleGuard Engine',
      },
      keywords: ['DOT Weight Limits', 'Bridge Formula B', 'Axle Weight Calculator', 'Truck Compliance Table'],
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    };
  }

  // 4. FAQPage Schema (if applicable)
  let faqSchema: object | null = null;
  if (params.faqs && params.faqs.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
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

  // Inject scripts into document.head
  const schemas: Record<string, unknown>[] = [breadcrumbSchema, techArticleSchema];
  if (datasetSchema) schemas.push(datasetSchema as Record<string, unknown>);
  if (faqSchema) schemas.push(faqSchema as Record<string, unknown>);

  schemas.forEach((sc) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-pseo', 'true');
    script.textContent = JSON.stringify(sc);
    document.head.appendChild(script);
  });
}
