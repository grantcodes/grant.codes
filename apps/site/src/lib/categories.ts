export interface CategoryInfo {
  name: string
  slug: string
}

// Simple inline slugify — replaces the `slugify` dependency.
// Handles the characters used in the manual category list.
const simpleSlugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// NOTE: Some sort of bug in the micropub endpoint causes crashes when
// categories are queried a bunch, so we hardcode them (same as the legacy app).
const MANUAL_CATEGORIES = [
  '10',
  '100DaysOfCode',
  '100days',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  'Apartment Searching',
  'Apartment Searching/CDMX',
  'CDMX',
  'CMSs',
  'Design',
  'Free SEO Stuff',
  'Freebies',
  'Freebies/Stock Photos',
  'GSJDundee',
  'GSJam',
  'Games',
  'IndieWebSummit',
  'JavaScript',
  'Languages',
  'MakeShare',
  'Money',
  'News',
  'PKN',
  'PKN_DND',
  'PanamaPapers',
  'Shopping',
  'Stock Photos',
  'Stuff',
  'Television',
  'Travel',
  'Web Examples',
  'Web Guides',
  'Website',
  'Website/CMSs',
  'Website/Free SEO Stuff',
  'WordPress',
  'Work',
  'Work/mivintagelabel.com',
  'Work/mobbed.io',
  'Work/todomap.xyz',
  '["100DaysOfCode"]',
  'ahh',
  'brand',
  'branding',
  'chatbot',
  'delete',
  'deleted',
  'gallery',
  'gallery--2016-barcelona',
  'gallery--2016-las-palmas',
  'gallery--2017-roadtrip-oregon',
  'gallery--2017-roadtrip-washington',
  'gallery--bratislava',
  'gallery--brno-2016',
  'gallery--budapest-2016',
  'gallery--dresden-2016',
  'gallery--dundee-2017',
  'gallery--graz-2016',
  'gallery--liverpool-2016',
  'gallery--skiing-2017',
  'gallery--sumo-and-sayuri',
  'gallery--theflyingscotsvan',
  'gallery--vienna-2016',
  'gallery--vienna-2016-appartment',
  'gallery-photo',
  'gallery-photo--2016-barcelona',
  'gallery-photo--2016-las-palmas',
  'gallery-photo--2017-al-and-rachel-wedding',
  'gallery-photo--2017-roadtrip-oregon',
  'gallery-photo--2017-roadtrip-washington',
  'gallery-photo--bratislava',
  'gallery-photo--brno-2016',
  'gallery-photo--budapest-2016',
  'gallery-photo--dresden-2016',
  'gallery-photo--dundee-2017',
  'gallery-photo--graz-2016',
  'gallery-photo--liverpool-2016',
  'gallery-photo--skiing-2017',
  'gallery-photo--sumo-and-sayuri',
  'gallery-photo--theflyingscotsvan',
  'gallery-photo--vienna-2016',
  'gallery-photo--vienna-2016-appartment',
  'gsjam',
  'gsjdundee',
  'igniteliv',
  'indieweb',
  'journal',
  'makeshare',
  'mivintagelabel.com',
  'mobbed.io',
  'movie',
  'note',
  'private',
  'show',
  'test',
  'todomap.xyz',
  'vanlife',
  'watch',
  'wcedin',
  'wceu',
]

let categoriesCache: CategoryInfo[] | null = null

const getCategories = async (): Promise<CategoryInfo[]> => {
  if (categoriesCache) {
    return categoriesCache
  }

  categoriesCache = MANUAL_CATEGORIES.map((category: string) => ({
    name: category,
    slug: simpleSlugify(category),
  }))

  return categoriesCache
}

export default getCategories
