import cx from 'classnames'
import Link from 'components/Link'
import Websites from 'components/Websites'
import { Section, SubSection } from 'components/About/Section'
import Profile from 'components/About/Profile'
import InPerson from './components/AboutInPerson'
import Online from 'components/About/Online'
import Event from 'components/About/Event'
import Skills from 'components/About/Skills'
import PrintPageBreak from 'components/PrintPageBreak'
import styles from 'css/pages/about.module.scss'

const About = () => {
  return (
    <div className={styles.wrapper}>
      <div className="h-resume">
        <div className="h-card p-contact">
          <Profile />

          <Section title="Find Me" titleClassName="hide-print">
            <SubSection title="Online" titleClassName="invisible-print">
              <Online />
            </SubSection>
            <InPerson />
          </Section>
        </div>

        <Section title="Work History">
          <Event
            className={cx(styles.printCard, 'p-experience h-event')}
            start={new Date('2025-03-01')}
            place="Exnaton"
            title="Frontend Developer"
            links={['https://www.exnaton.com/en']}
          >
            <p>My climate journey begins!</p>
          </Event>

          <Event
            className={cx(styles.printCard, 'p-experience h-event')}
            start={new Date('2019-10-21')}
            end={new Date('2025-02-27')}
            place="Kinsta"
            title="Frontend Web Developer"
            links={['https://kinsta.com/']}
          >
            <p>
              At Kinsta I have been a major contributor to the high traffic
              marketing website, seeing the marketing team grow from 1 to over
              30 people
            </p>
            <p>
              Responsibilities included modernizing the technology stack,
              performing accessibility audits, performance improvements,
              enabling non developers to easily create beautiful marketing
              content, and much more
            </p>
          </Event>

          <Event
            className={cx(styles.printCard, 'p-experience h-event')}
            start={new Date('2013-05-01')}
            end={new Date('2024-05-01')}
            place="grant.codes"
            title="Freelance Web Developer"
          >
            <p>
              As a freelance web developer I have worked with a number of
              clients on a variety of different projects. Mainly WordPress and
              React based websites for small to medium size businesses
            </p>
          </Event>

          <Event
            className="p-experience h-event hide-print"
            start={new Date('2015-06-01')}
            end={new Date('2016-04-01')}
            place="Code Club DCA Dundee"
            title="Volunteer Tutor"
          >
            <p>
              Helped kids learn scratch and other basic programming skills as
              part of code club at the Dundee Arts Cinema
            </p>
          </Event>

          <Event
            className={cx(styles.printCard, 'p-experience h-event')}
            start={new Date('2012-08-01')}
            end={new Date('2013-12-01')}
            place="Hit Reach"
            title="Senior Web Developer"
          >
            <p>
              Initially hired as a junior developer and promoted to senior
              developer I was in charge of regularly building various WordPress,
              static and custom sites as well as managing a small developer team
              and relations with clients
            </p>
          </Event>

          <Event
            className="p-experience h-event hide-print"
            start={new Date('2011-09-01')}
            end={new Date('2012-05-01')}
            place="The Social Learning Space"
            title="Web Developer"
          >
            <p>
              I created many applications to assist college students
              transitioning to university
            </p>
            <p>
              Also occasionally helped to teach some technical university
              modules
            </p>
          </Event>

          <Event
            className="p-experience h-event hide-print"
            start={new Date('2011-06-01')}
            end={new Date('2011-08-01')}
            place="University of Abertay, Dundee"
            title="Web Developer"
          >
            <p>
              Developed “FIT” which allowed clients to input various financial
              data and receive advice on improving profitability
            </p>
          </Event>
        </Section>

        <Section title="Education">
          <Event
            className={cx(styles.printCard, 'p-education h-event')}
            start={new Date('2024-03-11')}
            end={new Date('2024-05-31')}
            place="Climatebase"
            title="Fellowship Cohort 5"
            links={['https://climatebase.org/fellowship']}
          >
            <p>
              I was selected to join Cohort 5 of the Climatebase Fellowship, a
              climate career accelerator to learn about the problems our planet
              is facing, what we can do about it and how I can contribute
            </p>
          </Event>
          <Event
            className={cx(styles.printCard, 'p-education h-event')}
            start={new Date('2008-09-01')}
            end={new Date('2012-07-01')}
            place="Abertay University, Dundee"
            title="Web Design & Development BSc (Hons)"
            links={['https://www.abertay.ac.uk']}
          >
            <p>Graduated with first class honours</p>
          </Event>
        </Section>

        <PrintPageBreak />

        <Skills />

        <Section title="Projects" className="hide-print">
          <SubSection>
            <Websites limit={6} />
          </SubSection>
        </Section>

        <Section title="Interests">
          <SubSection title="Travel" className={styles.printCard}>
            <p>
              I sold all my stuff and went traveling for a couple of years while
              working remotely
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

          <SubSection title="Making & DIY" className={styles.printCard}>
            <p>
              I founded{' '}
              <a href="https://dundeemakerspace.co.uk">Dundee MakerSpace</a>,
              former member of{' '}
              <a href="http://makespacemadrid.org/">Makespace Madrid</a>, and
              I've visited many others on my travels
            </p>
            <p>
              In particular I enjoy making{' '}
              <Link to="/2016/04/14/570f7196b3340f7375caa5de">
                small electronics
              </Link>
              , home automation, laser cutting, screen printing and random low
              quality artwork
            </p>
          </SubSection>

          <SubSection title="Indieweb" className={styles.printCard}>
            <p>
              I am a supporter of the{' '}
              <a href="https://indieweb.org">Indieweb</a> movement and make a{' '}
              <a href="https://postr.dev">bunch</a>{' '}
              <a href="https://alltogethernow.io">of</a>{' '}
              <a href="https://postrchild.com">tools</a> in that space
            </p>
          </SubSection>
        </Section>
      </div>
      <p className={cx('print-only')}>
        <small
          style={{
            marginBlockStart: '2rem',
            fontSize: '0.6em',
            display: 'block',
          }}
        >
          This CV is a printout from{' '}
          <a href="https://grant.codes/about">https://grant.codes/about</a>{' '}
          check there for more detailed information on my work, skills and
          projects
        </small>
      </p>
    </div>
  )
}

About.containerClass = 'right-aligned right-aligned--wide-content'

export const metadata = {
  title: 'About Me',
}

export default About
