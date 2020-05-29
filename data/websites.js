export default [
  {
    slug: 'together',
    title: 'Together',
    description: 'Together is a social reader built for the indieweb',
    thumbnail: '/img/work/together-logo.jpg',
    // TODO: Add screenshot to public folder
    // screenshot:  '/media/2019/07/08/timeline.jpg',
    url: 'https://alltogethernow.io',
    content: `
        <p>
          <a href="https://alltogethernow.io">Together</a> is a social reader.
          It lets you read and interact with content from all over the web
          within one flexible space.
        </p>
        <p>
          Originally thought up at
          <a href="https://indieweb.org/2017">IndieWeb Summit 2017</a> with
          <a href="https://cleverdevil.io/">Jonathan LaCour</a> Together has
          evolved into a fully functioning web app.
        </p>
        <p>
          On the technical side of things there are 2 main parts to Together:
        </p>
        <ol>
          <li>
            <h5>Together Server</h5>
            <p>
              The Together Server is a GraphQL server that acts as a middleware
              to <a href="https://indieweb.org/Microsub">Microsub</a> (read &
              subscribe) and
              <a href="https://indieweb.org/Micropub">Micropub</a> (publish)
            </p>
          </li>
          <li>
            <h5>Together Web</h5>
            <p>
              The web client is a react app that connects to the server and
              provides a flexible interface to read and interact with a variety
              of different content.
            </p>
          </li>
          <p>
            You can read more about Together in
            <a href="/2019/07/08/together">my blog post about the v3 launch</a>.
            Or checkout
            <a href="https://github.com/alltogethernow">
              the source code on Github
            </a>
            (contributions welcome!)
          </p>
        </ol>`,
  },

  {
    slug: 'postrchild',
    title: 'PostrChild',
    description:
      'PostrChild is a suite of tools to publish content to your own website via micropub',
    thumbnail: '/img/work/postrchild-logo.png',
    // screenshot:"/img/work/postrchild-screenshot.jpg",
    url: 'https://postrchild.com',
    content: `
        <p>
          <a href="https://postrchild.com">PostrChild</a> is a suite of tools to
          publish content to your own website via
          <a href="https://indieweb.org/Micropub">micropub</a>.
        </p>
        <p>
          There is a chat bot, a web app for posting galleries and a browser
          extension that allows you write content inline on your own website
          without (much) extra work.
        </p>`,
  },

  {
    slug: 'todomap',
    title: 'TodoMap.xyz',
    description:
      'TodoMap.xyz is a React app to create and manage lists of places you want to visit',
    thumbnail: '/img/work/todomap-logo.png',
    screenshot: '/img/work/todomap-screenshot.jpg',
    url: 'https://todomap.xyz',
    content: `
        <p>
          <a href="https://todomap.xyz">TodoMap.xyz</a> is an app to help you
          manage lists of places you want to visit. You can list musuems you
          want to visit in a city, new restaurants to check out at home or
          whatever else you want!
        </p>
        <p>
          I started <a href="https://todomap.xyz">TodoMap.xyz</a> to scratch my
          own itch. No other platform really worked for me when travelling. I
          also used it as an excuse to test out some new technologies.
        </p>
        <p>
          Since then I have developed it into a fully functional react
          progressive web app with firebase serving the data.
        </p>`,
  },

  {
    slug: 'todotax',
    title: 'todo.tax',
    description: 'todo.tax is a simple todo list with a sadistic twist',
    thumbnail: '/img/work/todotax-logo.jpg',
    screenshot: '/img/work/todotax-screenshot.jpg',
    url: 'https://todo.tax',
    content: `
        <p>
          <a href="https://todotax.grant.codes">todo.tax</a> is a todo list app,
          but instead of entering a priority for each todo, you enter a monetary
          value. Then if you don't complete your task within 24 hours you are
          charged with profits going to charity
        </p>
        <p>It is a pretty simple react app using firebase as the backend.</p>`,
  },

  {
    slug: 'mobbedio',
    title: 'mobbed.io',
    description:
      'mobbed.io is a platform to discover the best mobile app developers in the world',
    thumbnail: '/img/work/mobbedio-logo.png',
    screenshot: '/img/work/mobbed-screenshot.png',
    url: 'https://mobbed.io',
    content: `
        <p>
          With a co-founder I set up <a href="https://mobbed.io">mobbed.io</a>
          as the go to destination to find the worlds best app developers across
          modern platforms such as mobile, VR, bots etc.
        </p>
        <p>
          It is a highly customised WordPress setup with advanced frontend
          editing features to allow developers to submit and manage their own
          companies.
        </p>`,
  },

  {
    slug: 'klueles',
    title: 'Klueles',
    description: 'Klueles is a WordPress & WooCommerce vintage fashion store',
    thumbnail: '/img/work/klueles-logo.jpg',
    screenshot: '/img/work/klueles.jpg',
    url: 'https://klueles.com',
    content: `
        <p>
          Klueles is an e-commerce site running on WordPress and WooCommerce
          with a lot of custom design and functionality.
        </p>
        <p>
          The site was designed by the wonderful
          <a href="http://www.emilyforgot.co.uk/">Emily Alston</a>.
        </p>`,
  },

  {
    slug: 'all-4-games',
    title: 'All 4 Games',
    description:
      'As part of a project for Fleet Collective I created all the scrolling animations for the site.',
    thumbnail: '/img/work/4-logo.png',
    screenshot: '/img/work/all4games.jpg',
    url: 'http://www.all4games.co.uk/about.html',
    content: `
        <p>
          As part of a project for
          <a href="http://fleetcollective.com">Fleet Collective</a> I created
          all the scrolling animations for the site.
        </p>`,
  },

  {
    slug: 'nursery-names',
    title: 'Nursery Names Sign Builder',
    description:
      'A little JavaScript app that lets people build their own bedroom door sign using drag and drop letters.',
    thumbnail: '/img/work/nursery-names-logo.png',
    screenshot: '/img/work/sign-builder.jpg',
    url: 'http://nurserynames.co.uk/pages/build-your-name',
    content: `
        <p>
          A little JavaScript app that lets people build their own bedroom door
          sign using drag and drop letters.
        </p>`,
  },
]
