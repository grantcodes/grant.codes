import { useState, useEffect } from 'react'
import classnames from 'classnames'
import { NextSeo } from 'next-seo'
import Link from 'components/Link'
import Websites from 'components/Websites'
import Profile from 'components/About/Profile'
import Elsewhere from 'components/About/Elsewhere'
import Event from 'components/About/Event'
import getLastLocation from 'lib/get/last-location'
import useIsPrint from 'lib/hooks/use-is-print'
import styles from 'css/pages/about.module.scss'

const Details = (props) => {
  const isPrint = useIsPrint()

  return (
    <details
      className={styles.details}
      {...props}
      open={isPrint ? true : null}
    />
  )
}

const About = () => {
  const [lastLocation, setLastLocation] = useState(null)

  useEffect(() => {
    getLastLocation()
      .then(setLastLocation)
      .catch((err) => setLastLocation(false))
  }, [])

  return (
    <div className={styles.wrapper}>
      <NextSeo title="About me" />
      <div className="h-resume">
        <div className="h-card p-contact">
          <section className={styles.section}>
            <Profile location={lastLocation} />
          </section>
          <section className={classnames(styles.section, 'hide-print')}>
            <h3 className={styles.section__title}>Find Me Somewhere Else</h3>
            <Elsewhere location={lastLocation} />
          </section>
        </div>

        <section className={styles.section}>
          <h3 className={styles.section__title}>Skills</h3>
          <ul className={styles.ul}>
            <li>
              <Details>
                <summary className="p-skill">JavaScript</summary>
                <ul>
                  <li>
                    <a href="https://reactjs.org/" className="p-skill">
                      React
                    </a>
                    <ul>
                      <li className="p-skill">
                        <a href="https://styled-components.com/">
                          Styled components
                        </a>
                      </li>
                      <li className="p-skill">
                        <a href="https://reactjs.org/docs/hooks-overview.html">
                          React hooks
                        </a>
                      </li>
                      <li className="p-skill">
                        <a href="https://www.apollographql.com/">
                          Apollo GraphQL
                        </a>
                      </li>
                      <li className="p-skill">SSR</li>
                    </ul>
                  </li>
                  <li>
                    <span className="p-skill">
                      <a href="https://nodejs.org/">Node</a>
                    </span>
                    <ul>
                      <li className="p-skill">
                        <a href="http://expressjs.com/">Express</a>
                      </li>
                      <li className="p-skill">
                        <a href="https://mozilla.github.io/nunjucks/">
                          Nunjucks
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="p-skill">
                    <a href="https://webpack.js.org/">Webpack</a>
                  </li>
                  <li className="p-skill">
                    <a href="https://p5js.org/">p5.js</a>
                  </li>
                </ul>
              </Details>
            </li>

            <li>
              <Details>
                <summary>
                  <a href="https://wordpress.org/">WordPress</a>
                </summary>
                <ul>
                  <li className="p-skill">WordPress Theme Development</li>
                  <li className="p-skill">WordPress Plugin Development</li>
                  <li className="p-skill">Gutenberg Block Development</li>
                  <li className="p-skill">Rest API Development</li>
                  <li className="p-skill">
                    <a href="https://timber.github.io/docs/">Timber</a>
                  </li>
                </ul>
              </Details>
            </li>

            <li>
              <Details>
                <summary className="p-skill">CSS</summary>
                <ul>
                  <li className="p-skill">
                    <a href="https://sass-lang.com/">Sass</a>
                  </li>
                </ul>
              </Details>
            </li>

            <li>
              <Details>
                <summary className="p-skill">HTML</summary>
              </Details>
            </li>

            <li>
              <Details>
                <summary className="p-skill">Static Site Generators</summary>
                <ul>
                  <li className="p-skill">
                    <a href="https://www.gatsbyjs.org/">Gastby</a>
                  </li>
                  <li className="p-skill">
                    <a href="https://www.11ty.io/">Eleventy</a>
                  </li>
                  <li className="p-skill">
                    <a href="https://nextjs.org/">Next.js</a>
                  </li>
                  <li className="p-skill">
                    <a href="https://www.netlify.com/">Netlify</a>
                  </li>
                </ul>
              </Details>
            </li>

            <li>
              <Details>
                <summary>Other Stuff I'd be Happy to Work With</summary>
                <ul>
                  <li>
                    <a href="https://getkirby.com/">Kirby</a>
                  </li>
                  <li>
                    <a href="https://craftcms.com/">Craft CMS</a>
                  </li>
                  <li>
                    <a href="https://facebook.github.io/react-native/">
                      React Native
                    </a>
                  </li>
                  <li>Headless CMS</li>
                  <li>
                    <a href="https://shopify.com">Shopify</a>
                  </li>
                  <li>
                    <a href="https://ghost.org">Ghost</a>
                  </li>
                  <li>
                    <a href="https://strapi.io">Strapi</a>
                  </li>
                </ul>
              </Details>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.section__title}>Work</h3>

          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Event
              as="li"
              className="p-experience h-event"
              start="2013-05-01"
              end={false}
              place="grant.codes"
              title="Freelance Web Developer"
            >
              <p>
                As a freelance web developer I have worked with a number of
                clients on a variety of different projects. Mainly WordPress and
                React based websites. I have not died of starvation so I
                consider myself to be a successful freelancer!
              </p>
            </Event>

            <Event
              as="li"
              className="p-experience h-event"
              start="2015-06-01"
              end="2016-04-01"
              place="Code Club DCA Dundee"
              title="Volunteer Tutor"
            >
              <p>
                Helped young kids learn scratch and other basic programming
                skills as part of code club at the Dundee Arts Cinema
              </p>
            </Event>

            <Event
              as="li"
              className="p-experience h-event"
              start="2012-08-01"
              end="2013-12-01"
              place="Hit Reach"
              title="Junior / Senior Web Developer"
            >
              <p>
                Initially hired as a junior developer and promoted to senior
                developer I was in charge of regularly building various
                WordPress, static and custom sites as well as managing a small
                developer team and relations with clients.
              </p>
            </Event>

            <Event
              as="li"
              className="p-experience h-event"
              start="2011-09-01"
              end="2012-05-01"
              place="The Social Learning Space"
              title="Web Developer"
            >
              <p>
                I created many applications to assist college students
                transitioning to university.
              </p>
              <p>
                Also occasionally helped to teach some technical university
                modules
              </p>
            </Event>

            <Event
              as="li"
              className="p-experience h-event"
              start="2011-06-01"
              end="2011-08-01"
              place="University of Abertay, Dundee"
              title="Web Developer"
            >
              <p>
                Developed “FIT” which allowed clients to input various financial
                data and receive advice on improving profitability.
              </p>
            </Event>
          </ol>
        </section>
        <section className={styles.section}>
          <h3 className={styles.section__title}>Education</h3>

          <Event
            className="p-education h-event"
            start="2008-09-01"
            end="2012-07-01"
            place="Abertay University, Dundee"
            title="Web Design & Development BSc (Hons)"
            links={['https://www.abertay.ac.uk']}
          >
            <p>Graduated with first class honours</p>
          </Event>
        </section>

        <section
          className={classnames(styles.section, 'hide-print')}
          style={{ maxWidth: '34rem' }}
        >
          <h3 className={styles.section__title}>Projects</h3>
          <Websites hideTitle />
        </section>

        <section className={styles.section}>
          <h3 className={styles.section__title}>Other Bits & Pieces</h3>
          <h4>Some stuff I enjoy</h4>
          <ul className={styles.ul}>
            <li>
              <Details>
                <summary>Travel</summary>
                <p>
                  I did the digital nomad thing for a couple of years, and hope
                  to go back to being somewhat nomadic in the future
                </p>
                <p>
                  I <Link to="/2017/06/13/theflyingscotsvan">built</Link> and
                  lived in a van while I did a road trip from Canada to{' '}
                  <Link to="https://grant.codes/2018/07/31/5b60a42fb83b374d5277e370">
                    Mexico
                  </Link>{' '}
                  and back again
                </p>
              </Details>
            </li>

            <li>
              <Details>
                <summary>Cooking</summary>
                <p>I enjoy cooking (and eating) new things.</p>
                <p>
                  I even made my own{' '}
                  <a href="https://recipes.grant.codes/">recipe website</a>
                </p>
              </Details>
            </li>

            <li>
              <Details>
                <summary>Making & DIY</summary>
                <p>
                  I founded{' '}
                  <a href="https://dundeemakerspace.co.uk">Dundee MakerSpace</a>{' '}
                  and I'm now a member of{' '}
                  <a href="http://makespacemadrid.org/">Makespace Madrid</a>,
                  and I've visited a few others on my travels.
                </p>
                <p>
                  In particular I enjoy making{' '}
                  <Link to="/2016/04/14/570f7196b3340f7375caa5de">
                    small electronics
                  </Link>
                  , home automation, laser cutting and random low quality
                  artwork
                </p>
              </Details>
            </li>

            <li>
              <Details>
                <summary>Indieweb</summary>
                <p>
                  I am a supporter of the{' '}
                  <a href="https://indieweb.org">Indieweb</a> movement and make
                  a <a href="https://postr.dev">bunch</a>{' '}
                  <a href="https://alltogethernow.io">of</a>{' '}
                  <a href="https://postrchild.com">tools</a> in that space.
                </p>
              </Details>
            </li>

            <li>
              <Details>
                <summary>Movies & TV</summary>
                <p>A lot of the usual suspects!</p>
                <p>
                  You can see exactly what I have been watching{' '}
                  <a href="https://grant.codes/watches">here</a>
                </p>
              </Details>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default About
