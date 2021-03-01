// types shared between server and client.

export interface LocaleConfig {
  lang: string
  title?: string
  description?: string
  head?: HeadConfig[]
  label?: string
  selectText?: string
}

export interface SiteData<ThemeConfig = any> {
  lang: string
  title: string
  description: string
  base: string
  head: HeadConfig[]
  themeConfig: ThemeConfig
  locales: Record<string, LocaleConfig>
}

export type HeadConfig =
  | [string, Record<string, string>]
  | [string, Record<string, string>, string]

export interface PageData {
  title: string
  frontmatter: Record<string, any>
  headers: Header[]
  relativePath: string
  lastUpdated: number
  next?: { text: string; link: string }
  prev?: { text: string; link: string }
}

export interface Header {
  level: number
  title: string
  slug: string
}
