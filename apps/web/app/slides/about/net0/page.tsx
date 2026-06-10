import { Metadata } from 'next'
import Image from 'next/image'

import carbonEstimatesScreenshot from './img/carbon-estimates.webp'

export const metadata: Metadata = {
  title: 'Net0.1',
}

// A brief intro of the project team, relevant background & qualifications, and the inspiration behind the project idea.
// The problem you are working to solve.
// The solution you are building.
// The current status of your project.
// What you’re hoping to accomplish next for your project. What additional milestones & goals you have yet to achieve.
// What additional support you might need, including a) more collaborators (possible skills gaps); b) feedback; c) promotion; d) something else.

export default () => (
  <>
    <section>
      <section>
        <h1>A sustainable web starter kit</h1>
        <p>
          <small>
            <a href="https://grant.codes/slides/about/net0/">
              https://grant.codes/slides/about/net0/
            </a>
          </small>
        </p>
      </section>

      <section>
        <h2>Grant Richmond</h2>
        <p>Frontend web developer</p>
        <a href="https://grant.codes">grant.codes</a>
        <aside className="notes">
          <ul>
            <li>Frontend web developer</li>
            <li>Over ten years of experience, shifting to the climate space</li>
            <li>Of course find everything on my website</li>
          </ul>
        </aside>
      </section>
    </section>

    <section>
      <section>
        <h2>The problem</h2>
      </section>

      <section>
        <h3>Digital products, physical footprints</h3>
        <blockquote
          cite="https://www.sustainablewebmanifesto.com/#citation"
          className="fragment"
        >
          If the Internet was a country, it would be the 4th largest polluter
        </blockquote>
        <aside className="notes">
          <ul>
            <li>
              Though you feel like just looking at a web page on your phone
              can't cause much harm, as we all know, the small things add up
            </li>
            <li>
              There are multiple hops across many servers, all using energy and
              one website can load any number of resources behind the scenes
              (analytics, ads, images, videos, etc.)
            </li>
            <li>
              But perhaps the biggest issue is that these emissions are not
              obvious and very difficult to measure
            </li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Work on what you know</h3>
        <aside className="notes">
          <ul>
            <li>I'm a frontend developer</li>
            <li>There are many issues</li>
            <li>But I chose to focus on my area of expertise</li>
            <li>Hence the sustainable web started</li>
            <li>
              Goals of increasing visibility, and being a good starting point
              for fellow developers
            </li>
          </ul>
        </aside>
      </section>
    </section>

    <section>
      <section>
        <h2>Net0.1</h2>
        <p>A sustainable web starter kit</p>
        <aside className="notes">
          <ul>
            <li>This does exist in a very early stage</li>
            <li>As always, I wish I had more time, but life gets in the way</li>
          </ul>
        </aside>
      </section>

      <section>
        <h2>What?</h2>
        <aside className="notes">
          <ul>
            <li>What is a starter kit?</li>
            <li>For developers</li>
            <li>
              Get up and running fast, with certain decisions already made for
              you
            </li>
            <li>
              Lets jump into some of the features, and reasons you'd use this
            </li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Sustainable choices made for you</h3>
        <aside className="notes">
          <ul>
            <li>I did the research</li>
            <li>
              Researched multiple website frameworks, for their impact and
              usability
            </li>
            <li>CSS frameworks</li>
            <li>Test runners</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Features</h3>
        <ul>
          <li className="fragment">
            Static by default (but dynamic if needed)
          </li>
          <li className="fragment">Built in documentation</li>
          <li className="fragment">i18n / Translation</li>
        </ul>
        <aside className="notes">
          <ul>
            <li>Static sites are much more efficient</li>
            <li>
              It's very common to have documention when building digital
              products, so it's nice to have that built in
            </li>
            <li>Translatable to reach more of the planet</li>
            <li>Also a little demo of my favourite feature</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Detailed CO2 estimation</h3>
        <Image
          src={carbonEstimatesScreenshot}
          alt="Screenshot showing the Net0.1 carbon estimate tool"
          className="fragment"
        />
        <aside className="notes">
          <ul>
            <li>Estimate the impact of each part of your code</li>
            <li>
              Developer tools which appear when you're working on your website
            </li>
            <li>Uses an existing CO2 estimiation library</li>
          </ul>
        </aside>
      </section>

      <section data-background-iframe="https://net0.grant.codes">
        <div
          style={{
            width: 'fit-content',
            padding: '1em',
            margin: 'auto',
            borderRadius: '.5em',
            background: 'rgba(19,23,31,0.9)',
            backdropFilter: 'blur(.2em)',
          }}
        >
          <h3>Available now 🎉</h3>
          <p>
            <a href="https://net0.grant.codes">net0.grant.codes</a>
          </p>
        </div>
      </section>
    </section>

    <section>
      <section>
        <h2>Next steps</h2>
        <ul>
          <li className="fragment">Improved, standalone CO2 estimation</li>
          <li className="fragment">Prettier & more powerful</li>
          <li className="fragment">Fellow feedback</li>
          <li className="fragment">Lets make some websites</li>
        </ul>

        <aside className="notes">
          <ul>
            <li>Co2 estimation is not very accurate</li>
            <li>
              Just a starting point, would love to add more expected features
              like testing, analytics and more templates
            </li>
            <li>
              Welcome any feedback, happy to have technical or non-technical
              contributors
            </li>
            <li>
              There are many capstone projects need websites, lets work together
            </li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Business ideas</h3>
        <ul>
          <li className="fragment">CO2 estimation tool</li>
          <li className="fragment">Sustainable design studio</li>
          <li className="fragment">Website builder for non-technical folk</li>
        </ul>
        <aside className="notes">
          <ul>
            <li>This is my seed to grow a more sustainable web</li>
            <li>
              There are a few business opportunities I'd love to explore
              (perhaps with a cofounder)
            </li>
            <li>
              CO2 tool was a pleasant surprise and maybe the most unique feature
            </li>
          </ul>
        </aside>
      </section>
    </section>

    <section>
      <h2>Cheers</h2>
    </section>
  </>
)
