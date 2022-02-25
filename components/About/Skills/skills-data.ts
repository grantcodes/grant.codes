import { SkillProps } from './types'

interface SkillsDataSection {
  name: string
  skills: SkillProps[]
}

const skills: SkillsDataSection[] = [
  {
    name: 'HTML',
    skills: [
      {
        name: 'Semantic HTML5',
        love: 100,
        knowledge: 96,
        subSkills: [
          {
            name: 'Accessibility',
            love: 100,
            knowledge: 76,
          },
        ],
      },
    ],
  },
  {
    name: 'CSS',
    skills: [
      {
        name: 'CSS',
        love: 100,
        knowledge: 98,
        subSkills: [
          {
            name: 'SCSS',
            href: 'https://sass-lang.com/',
            knowledge: 96,
            love: 90,
          },
          {
            name: 'CSS Modules',
            href: 'https://github.com/css-modules/css-modules',
            knowledge: 76,
            love: 72,
          },
          {
            name: 'Styled Components',
            href: 'https://styled-components.com/',
            knowledge: 70,
            love: 20,
          },
        ],
      },
    ],
  },
  {
    name: 'JavaScript',
    skills: [
      {
        name: 'React',
        href: 'https://reactjs.org/',
        knowledge: 80,
        love: 80,
        subSkills: [
          {
            name: 'Next.js',
            href: 'https://nextjs.org/',
            knowledge: 86,
            love: 97,
          },
          {
            name: 'React Hooks',
            href: 'https://reactjs.org/docs/hooks-overview.html',
            knowledge: 75,
            love: 84,
          },
          {
            name: 'GraphQL',
            href: 'https://graphql.org/',
            knowledge: 55,
            love: 66,
          },
        ],
      },
      {
        name: 'Node.js',
        href: 'https://nodejs.org/',
        knowledge: 64,
        love: 62,
        subSkills: [
          {
            name: 'Express',
            href: 'http://expressjs.com/',
            knowledge: 72,
            love: 85,
          },
          {
            name: 'nunjucks',
            href: 'https://mozilla.github.io/nunjucks/',
            knowledge: 87,
            love: 62,
          },
        ],
      },
      {
        name: 'Misc JS & tools',
        className: 'hide-print',
        subSkills: [
          {
            name: 'TypeScript',
            href: 'https://www.typescriptlang.org/',
            knowledge: 40,
            love: 83,
          },
          {
            name: 'Webpack',
            href: 'https://webpack.js.org/',
            knowledge: 72,
            love: 85,
          },
          {
            name: 'P5.js',
            href: 'https://p5js.org/',
            knowledge: 20,
            love: 76,
          },
          {
            href: 'https://vuejs.org/',
            name: 'Vue.js',
            knowledge: 1,
            love: 63,
          },
          {
            href: 'https://svelt.org',
            name: 'Svelt',
            knowledge: 1,
            love: 67,
          },
        ],
      },
    ],
  },

  {
    name: 'WordPress',
    skills: [
      {
        name: 'WordPress',
        href: 'https://wordpress.org/',
        knowledge: 88,
        love: 68,
        subSkills: [
          {
            name: 'WordPress Theme Development',
            href: '',
            knowledge: 95,
            love: 89,
          },
          {
            name: 'WordPress Plugin Development',
            href: '',
            knowledge: 95,
            love: 89,
          },
          {
            name: 'Gutenberg Block Development',
            href: '',
            knowledge: 95,
            love: 89,
          },
          {
            name: 'Rest API Development',
            href: '',
            knowledge: 95,
            love: 89,
          },
          {
            name: 'Timber',
            href: 'https://timber.io/',
            knowledge: 95,
            love: 89,
          },
        ],
      },
    ],
  },

  {
    name: 'Other Tools',
    skills: [
      {
        name: 'Static Site Generators',
        love: 94,
        subSkills: [
          {
            name: 'Gastby',
            href: 'https://www.gatsbyjs.org/',
            knowledge: 52,
            love: 61,
          },
          {
            name: 'Eleventy',
            href: 'https://www.11ty.io/',
            knowledge: 65,
            love: 88,
          },
          {
            name: 'Next.js',
            href: 'https://nextjs.org/',
            knowledge: 81,
            love: 94,
          },
          {
            name: 'Netlify',
            href: 'https://www.netlify.com/',
            knowledge: 60,
            love: 87,
          },
        ],
      },
      {
        name: "Other Stuff I'd be Happy to Work With",
        className: 'hide-print',
        subSkills: [
          { href: 'https://getkirby.com/', name: 'Kirby' },
          { href: 'https://craftcms.com/', name: 'Craft CMS' },
          {
            href: 'https://facebook.github.io/react-native/',
            name: 'React Native',
          },
          { name: 'Headless CMS' },
          { href: 'https://shopify.com', name: 'Shopify' },
          { href: 'https://ghost.org', name: 'Ghost' },
          { href: 'https://strapi.io', name: 'Strapi' },
        ],
      },
    ],
  },
]

export default skills
