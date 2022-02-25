import { useState, useEffect } from 'react'
import classnames from 'classnames'
import { NextSeo } from 'next-seo'
import Link from 'components/Link'
import Websites from 'components/Websites'
import { Section, SubSection } from 'components/About/Section'
import Profile from 'components/About/Profile'
import Online from 'components/About/Online'
import InPerson from 'components/About/InPerson'
import Event from 'components/About/Event'
import Skills from 'components/About/Skills'
import getLastLocation from 'lib/get/last-location'
import useIsPrint from 'lib/hooks/use-is-print'
import styles from 'css/pages/about.module.scss'

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
          <Profile location={lastLocation} />

          <Section title="Find Me">
            <SubSection title="Online" className="hide-print">
              <Online />
            </SubSection>
            <SubSection title="In Person">
              <InPerson location={lastLocation} />
            </SubSection>
          </Section>
        </div>

        <Skills />

        <Section title="Work">
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
              React based websites. I have not died of starvation so I consider
              myself to be a successful freelancer!
            </p>
          </Event>

          <Event
            as="li"
            className="p-experience h-event"
            start="2019-10-21"
            end={false}
            place="Kinsta"
            title="Web Developer"
            links={['https://kinsta.com/']}
          >
            <p>
              At Kinsta I am tasked with developing and maintaining the
              WordPress website. So far there has been lots of work towards
              modernizing templates and giving non developers more control of
              the website content, including gradually implementing Gutenberg
              blocks across the site.
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
              Helped young kids learn scratch and other basic programming skills
              as part of code club at the Dundee Arts Cinema
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
              developer I was in charge of regularly building various WordPress,
              static and custom sites as well as managing a small developer team
              and relations with clients.
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
        </Section>

        <Section title="Education">
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
        </Section>

        <Section title="Projects" className="hide-print">
          <SubSection>
            <Websites hideTitle />
          </SubSection>
        </Section>

        <Section title="Interests">
          <SubSection title="Travel">
            <p>
              I did the digital nomad thing for a couple of years, and hope to
              go back to being somewhat nomadic in the future
            </p>
            <p>
              I <Link to="/2017/06/13/theflyingscotsvan">built</Link> and lived
              in a van while I did a road trip from Canada to{' '}
              <Link to="https://grant.codes/2018/07/31/5b60a42fb83b374d5277e370">
                Mexico
              </Link>{' '}
              and back again
            </p>
          </SubSection>

          <SubSection title="Cooking">
            <p>I enjoy cooking (and eating) new things.</p>
            <p>
              I even made my own{' '}
              <a href="https://recipes.grant.codes/">recipe website</a>
            </p>
          </SubSection>

          <SubSection title="Making & DIY">
            <p>
              I founded{' '}
              <a href="https://dundeemakerspace.co.uk">Dundee MakerSpace</a>,
              former member of{' '}
              <a href="http://makespacemadrid.org/">Makespace Madrid</a>, and
              I've visited a few others on my travels.
            </p>
            <p>
              In particular I enjoy making{' '}
              <Link to="/2016/04/14/570f7196b3340f7375caa5de">
                small electronics
              </Link>
              , home automation, laser cutting and random low quality artwork
            </p>
          </SubSection>

          <SubSection title="Indieweb">
            <p>
              I am a supporter of the{' '}
              <a href="https://indieweb.org">Indieweb</a> movement and make a{' '}
              <a href="https://postr.dev">bunch</a>{' '}
              <a href="https://alltogethernow.io">of</a>{' '}
              <a href="https://postrchild.com">tools</a> in that space.
            </p>
          </SubSection>

          <SubSection title="Movies & TV">
            <p>A lot of the usual suspects!</p>
            <p>
              You can see exactly what I have been watching{' '}
              <a href="https://grant.codes/watches">here</a>
            </p>
          </SubSection>
        </Section>
      </div>
    </div>
  )
}

About.containerClass = 'right-aligned right-aligned--wide-content'

export default About
