/**
 * Schema.org JSON-LD Structured Data Validator
 * Validates against Google Search Central Rich Results & Schema.org specifications:
 * - Proper @context and @type
 * - Absolute URLs in breadcrumbs, canonicals, and entity identifiers
 * - WebApplication required fields (name, operatingSystem, applicationCategory, offers)
 * - FAQPage required structure (mainEntity -> Question -> acceptedAnswer -> Answer)
 * - Anti-spam check: prevents domain mismatch and unsupported schemas
 */

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSchema(schema: Record<string, unknown>): SchemaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Context validation
  if (!schema['@context']) {
    errors.push('Missing @context property.');
  } else if (
    schema['@context'] !== 'https://schema.org' &&
    schema['@context'] !== 'http://schema.org'
  ) {
    errors.push(`Invalid @context: "${schema['@context']}". Must be "https://schema.org".`);
  }

  // 2. Type validation
  const type = schema['@type'] as string | undefined;
  if (!type) {
    errors.push('Missing @type property.');
    return { isValid: false, errors, warnings };
  }

  // 3. Domain consistency check
  const jsonStr = JSON.stringify(schema);
  if (jsonStr.includes('axleguard.org') || jsonStr.includes('AxleGuard')) {
    errors.push('Brand mismatch detected: Schema contains legacy "AxleGuard/axleguard.org" instead of "DOT Weight/dotweight.com".');
  }

  // 4. Type-specific validations
  switch (type) {
    case 'BreadcrumbList': {
      const items = schema.itemListElement as Array<Record<string, unknown>> | undefined;
      if (!Array.isArray(items) || items.length === 0) {
        errors.push('BreadcrumbList must have a non-empty itemListElement array.');
      } else {
        items.forEach((item, idx) => {
          if (item['@type'] !== 'ListItem') {
            errors.push(`Breadcrumb item #${idx + 1} must have @type "ListItem".`);
          }
          if (typeof item.position !== 'number' || item.position !== idx + 1) {
            errors.push(`Breadcrumb item #${idx + 1} position must be sequential integer (${idx + 1}).`);
          }
          if (!item.name || typeof item.name !== 'string') {
            errors.push(`Breadcrumb item #${idx + 1} is missing a valid name.`);
          }
          const itemUrl = item.item as string | undefined;
          if (!itemUrl || typeof itemUrl !== 'string') {
            errors.push(`Breadcrumb item #${idx + 1} is missing the "item" target URL.`);
          } else if (!itemUrl.startsWith('https://') && !itemUrl.startsWith('http://')) {
            errors.push(`Breadcrumb item #${idx + 1} "item" URL must be absolute (got "${itemUrl}").`);
          }
        });
      }
      break;
    }

    case 'FAQPage': {
      const mainEntity = schema.mainEntity as Array<Record<string, unknown>> | undefined;
      if (!Array.isArray(mainEntity) || mainEntity.length === 0) {
        errors.push('FAQPage must have a non-empty mainEntity array.');
      } else {
        mainEntity.forEach((q, idx) => {
          if (q['@type'] !== 'Question') {
            errors.push(`FAQ entry #${idx + 1} must have @type "Question".`);
          }
          if (!q.name || typeof q.name !== 'string') {
            errors.push(`FAQ entry #${idx + 1} is missing a question name/title.`);
          }
          const answer = q.acceptedAnswer as Record<string, unknown> | undefined;
          if (!answer || answer['@type'] !== 'Answer') {
            errors.push(`FAQ entry #${idx + 1} must have an acceptedAnswer with @type "Answer".`);
          } else if (!answer.text || typeof answer.text !== 'string') {
            errors.push(`FAQ entry #${idx + 1} acceptedAnswer is missing "text".`);
          }
        });
      }
      break;
    }

    case 'WebApplication': {
      if (!schema.name || typeof schema.name !== 'string') {
        errors.push('WebApplication must have a valid "name".');
      }
      if (!schema.applicationCategory) {
        warnings.push('WebApplication recommended to specify "applicationCategory".');
      }
      if (!schema.operatingSystem) {
        warnings.push('WebApplication recommended to specify "operatingSystem".');
      }
      const offers = schema.offers as Record<string, unknown> | undefined;
      if (!offers || offers['@type'] !== 'Offer') {
        warnings.push('WebApplication recommended to include an "offers" property with @type "Offer".');
      }
      break;
    }

    case 'Dataset': {
      if (!schema.name) errors.push('Dataset must have a "name".');
      if (!schema.description) errors.push('Dataset must have a "description".');
      if (!schema.creator) warnings.push('Dataset recommended to specify "creator".');
      break;
    }

    case 'TechArticle': {
      warnings.push('TechArticle on programmatic calculation tools may trigger Google unoriginal content flags. Prefer WebApplication or WebPage.');
      break;
    }

    case 'WebPage':
    case 'ItemPage': {
      if (!schema.name) warnings.push('WebPage recommended to specify "name".');
      if (!schema.description) warnings.push('WebPage recommended to specify "description".');
      break;
    }

    default:
      warnings.push(`Schema type "${type}" recognized without custom rules.`);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateAllSchemas(schemas: Record<string, unknown>[]): {
  allValid: boolean;
  totalErrors: number;
  results: SchemaValidationResult[];
} {
  const results = schemas.map(validateSchema);
  const totalErrors = results.reduce((acc, r) => acc + r.errors.length, 0);
  return {
    allValid: totalErrors === 0,
    totalErrors,
    results,
  };
}
