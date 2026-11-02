// meimaobing.ts is the fork-local brand layer. Brand names, the document-title
// default, the public repository, and the locale-message rewrite live here so
// upstream files only need a small, stable set of integration points.

export const BRAND_NAME = '没猫饼'
export const BRAND_NAME_EN = 'Meimaobing'
export const DEFAULT_SITE_NAME = BRAND_NAME
export const DEFAULT_DOCUMENT_TITLE = `${BRAND_NAME} - AI API Gateway`
export const BRAND_REPO_URL = 'https://github.com/AidenNovak/TokenRouter'

// BRAND_BY_LANGUAGE maps a base language code to the name shown in that locale.
// Unlisted languages fall back to the original Chinese brand name.
const BRAND_BY_LANGUAGE: Record<string, string> = {
  zh: BRAND_NAME,
  en: BRAND_NAME_EN,
}

// localizeBrandMessages returns a copy of one locale catalog with upstream
// product names replaced by the brand for that language. Catalog loads use it
// before publishing messages, so later language switches receive the same
// treatment without editing each translation file.
export function localizeBrandMessages<T>(messages: T, locale: string): T {
  const language = locale.split('-')[0]
  const name = BRAND_BY_LANGUAGE[language] ?? BRAND_NAME
  return replaceBrand(messages, name) as T
}

// replaceBrand walks message values and rewrites only strings. Object keys stay
// untouched so translation keys remain addressable.
function replaceBrand(value: unknown, name: string): unknown {
  if (typeof value === 'string') {
    return value.replace(/TokenRouter/g, name).replace(/TokenFlux/g, name)
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceBrand(item, name))
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) {
      result[key] = replaceBrand(item, name)
    }
    return result
  }
  return value
}
