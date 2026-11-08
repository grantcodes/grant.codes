import { SkillProps } from './types'

interface SkillsDataSection {
  name: string
  className?: string
  skills: SkillProps[]
}

const skills: SkillsDataSection[] = [
  {
    name: 'HTML',
    skills: [
      {
        name: 'HTML5',
        love: 100,
        knowledge: 96,
        subSkills: [
          {
            name: 'Semantic HTML',
            love: 100,
            knowledge: 96,
          },
          {
            name: 'Accessibility',
            love: 100,
            knowledge: 79,
          },
          {
            name: 'ARIA',
            href: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA',
            knowledge: 70,
            love: 100,
          },
          {
            name: 'Performance',
            href: 'https://web.dev/vitals/',
            knowledge: 86,
            love: 89,
          },
          {
            name: 'SEO',
            href: 'https://moz.com/beginners-guide-to-seo',
            knowledge: 70,
            love: 50,
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
            name: 'Design Systems',
            href: 'https://www.designsystems.com/',
            knowledge: 75,
            love: 94,
          },
          {
            name: 'Logical Properties',
            href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties',
            knowledge: 90,
            love: 94,
          },
          {
            name: 'SCSS',
            href: 'https://sass-lang.com/',
            knowledge: 96,
            love: 84,
          },
          {
            name: 'CSS Modules',
            href: 'https://github.com/css-modules/css-modules',
            knowledge: 76,
            love: 84,
          },
          {
            name: 'Tailwind',
            href: 'https://tailwindcss.com/',
            knowledge: 50,
            love: 50,
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
            love: 92,
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
        subSkills: [
          {
            name: 'TypeScript',
            href: 'https://www.typescriptlang.org/',
            knowledge: 84,
            love: 95,
          },
          {
            name: 'Web Components',
            href: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Components',
            knowledge: 70,
            love: 92,
          },
          {
            name: 'Storybook',
            href: 'https://storybook.js.org/',
            knowledge: 76,
            love: 80,
          },
          {
            name: 'Svelt',
            href: 'https://svelte.dev/',
            knowledge: 40,
            love: 70,
          },
          {
            href: 'https://vuejs.org/',
            name: 'Vue.js',
            knowledge: 1,
            love: 63,
          },
          {
            name: 'P5.js',
            href: 'https://p5js.org/',
            knowledge: 20,
            love: 76,
          },
          {
            name: 'Vite',
            href: 'https://vitejs.dev/',
            knowledge: 40,
            love: 73,
          },
          {
            name: 'Webpack',
            href: 'https://webpack.js.org/',
            knowledge: 72,
            love: 50,
          },
        ],
      },
    ],
  },

  {
    name: 'WordPress',
    className: 'hide-print',
    skills: [
      {
        name: 'WordPress',
        href: 'https://wordpress.org/',
        className: 'hide-print',
        knowledge: 88,
        love: 68,
        subSkills: [
          {
            name: 'Theme Development',
            href: '',
            knowledge: 95,
            love: 89,
          },
          {
            name: 'Plugin Development',
            href: '',
            knowledge: 82,
            love: 72,
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
        name: 'Common Tools',
        subSkills: [
          {
            name: 'GitHub',
            href: 'https://github.com',
            knowledge: 90,
            love: 88,
          },
          {
            name: 'Figma',
            href: 'https://www.figma.com/',
            knowledge: 53,
            love: 76,
          },
          {
            name: 'Docker',
            href: 'https://www.docker.com/',
            knowledge: 60,
            love: 78,
          },
          {
            name: 'Analytics',
            knowledge: 70,
            love: 21,
          },
          {
            name: 'HubSpot',
            href: 'https://www.hubspot.com/',
            knowledge: 68,
            love: 34,
          },
        ],
      },
      {
        name: 'Static Site Generators',
        love: 94,
        subSkills: [
          {
            name: 'Next.js',
            href: 'https://nextjs.org/',
            knowledge: 81,
            love: 94,
            id: 'next-ssg',
          },
          {
            name: 'Astro',
            href: 'https://astro.build/',
            knowledge: 80,
            love: 90,
          },
          {
            name: 'Eleventy',
            href: 'https://www.11ty.io/',
            knowledge: 65,
            love: 88,
          },
          {
            name: 'Netlify',
            href: 'https://www.netlify.com/',
            knowledge: 60,
            love: 80,
          },
          {
            name: 'Hugo',
            href: 'https://gohugo.io/',
            knowledge: 50,
            love: 63,
          },
          {
            name: 'Jekyll',
            href: 'https://jekyllrb.com/',
            knowledge: 63,
            love: 43,
          },
          {
            name: 'Gastby',
            href: 'https://www.gatsbyjs.org/',
            knowledge: 52,
            love: 40,
          },
        ],
      },

      {
        name: "Other Stuff I'd be Happy to Work With",
        className: 'hide-print',
        subSkills: [
          { href: 'https://craftcms.com/', name: 'Craft CMS' },
          {
            href: 'https://facebook.github.io/react-native/',
            name: 'React Native',
          },
          { name: 'Headless CMS' },
          { href: 'https://strapi.io', name: 'Strapi' },
          { href: 'https://ghost.org', name: 'Ghost' },
          { href: 'https://shopify.com', name: 'Shopify' },
        ],
      },
    ],
  },
]

export default skills
