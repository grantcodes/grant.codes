import { Metadata } from 'next'
import Image from 'next/image'

import boredom from './img/boredom.jpg'
import clothesTrash from './img/clothes-trash.jpg'
import digitalNomadDream from './img/digital-nomad-dream.jpg'
import dundeeMakerspace from './img/dundee-makerspace.jpg'
import freedom from './img/freedom.jpg'
import kittens from './img/kittens.jpg'
import myStuff from './img/my-stuff.jpg'
import packing from './img/packing.gif'
import paleBlueDot from './img/pale-blue-dot.png'
import selfieGuy from './img/selfie-guy.jpg'
import surroundedByShite from './img/surrounded-by-shite.jpg'
import theInternet from './img/the-internet.gif'
import wreckingBall from './img/wrecking-ball.jpg'

import './style.scss'

export const metadata: Metadata = {
  title: 'Running away',
}

export default () => (
  <>
    <section>
      <h1 style={{ fontSize: `2.5em` }}>
        Sell everything you own and run away from home
      </h1>
      <p>
        <small>
          <a href='https://grant.codes/slides/about/running-away/'>
            grant.codes/slides/about/running-away/
          </a>
        </small>
      </p>
      <aside className='notes'>
        <p>
          This is a bit different, I've not been far yet. But how I got here and
          my philosophy on travel
        </p>
      </aside>
    </section>

    <section>
      <section>
        <h2>Who?</h2>
      </section>

      <section
      // data-background='/img/ma-puss.png'
      // data-background-size='contain'
      // data-background-position='bottom center'
      // className='ma-puss'
      >
        <h3>Grant Richmond</h3>
        <p>
          <a href='https://grant.codes'>grant.codes</a>
          <br />
          <a href='https://twitter.com/grantcodes'>@grantcodes</a>
        </p>
      </section>

      <section data-background-image={freedom.src}>
        <h3>A.K.A. That Scottish guy with the wooden glasses</h3>
      </section>

      <section>
        <h3>I make websites</h3>
        <p>&amp; other dumb stuff</p>
        <aside className='notes'>
          <p>
            Freelance web developer. Occasional make stupid little projects.
          </p>
        </aside>
      </section>

      <section>
        <h3>&amp; I didn't enjoy travel</h3>
        <aside className='notes'>
          <p>
            It can be expensive, you had to take time off work, it's a lot of
            effort
          </p>
        </aside>
      </section>
    </section>

    <section>
      <section>
        <h2>Boredom</h2>
        <aside className='notes'>
          <p>
            I get bored a lot. And you should too. Use it as a driving force.
          </p>
        </aside>
      </section>

      <section>
        <h3>I had a proper job.</h3>
        <aside className='notes'>
          <p>Agency for a year and a half. Quite soul destroying</p>
        </aside>
      </section>

      <section
        data-background-color='#fff'
        data-background-image={boredom.src}
        data-background-size='contain'
        data-background-position='bottom center'
      ></section>

      <section>
        <h3>So I quit</h3>
        <aside className='notes'>
          <p>
            And went freelance. Was way easier than I thought. And not turned
            back since.
          </p>
        </aside>
      </section>

      <section
        data-background-color='#fff'
        data-background-image={boredom.src}
        data-background-size='contain'
        data-background-position='bottom center'
      >
        <aside className='notes'>
          <p>
            But I got bored again. I was in the routine of work &gt; sleep &gt;
            work, I wasn't doing anything meaningful.
          </p>
        </aside>
      </section>

      <section data-background-image={dundeeMakerspace.src}>
        <h3>Then I found something else to do</h3>
        <aside className='notes'>
          <p>
            I started a MakerSpace. Was my project for a couple of years. Was
            constantly evolving.
          </p>
        </aside>
      </section>

      <section
        data-background-color='#fff'
        data-background-image={boredom.src}
        data-background-size='contain'
        data-background-position='bottom center'
      >
        <aside className='notes'>
          <p>
            But then I got bored again. Everything was fairly stable and I had
            created something that will last on in my community without me
            there.
          </p>
        </aside>
      </section>

      <section>
        <h3>Then I sold everything I owned</h3>
        <aside className='notes'>
          <p>I could maybe have bought a flat or focused on my work.</p>
        </aside>
      </section>
    </section>

    <section>
      <section data-background-image={surroundedByShite.src}>
        <aside className='notes'>
          <p>One day I woke up and realised I was surrounded by shite.</p>
        </aside>
      </section>

      <section data-background-image={wreckingBall.src}>
        <aside className='notes'>
          <p>Decided to take the extreme approach</p>
        </aside>
      </section>

      <section data-background-image={clothesTrash.src}>
        <aside className='notes'>
          <p>This is just a small amount of the clothes I threw out</p>
        </aside>
      </section>

      <section data-background-image={digitalNomadDream.src}>
        <aside className='notes'>
          <p>And I went off to follow the dream.</p>
          <p>Digital nomad - so pretentious</p>
        </aside>
      </section>

      <section data-background-image={myStuff.src}></section>

      <section data-background-image={packing.src}></section>
    </section>

    <section>
      <section>
        <h2>The Present</h2>
        <aside className='notes'>
          <p>This is my philosophy on travel.</p>
        </aside>
      </section>

      <section>
        <h3>The pale blue dot</h3>
        <Image
          src={paleBlueDot}
          alt='The pale blue dot'
          className='stretch fragment pale-blue-dot'
        />
        <aside className='notes'>
          <p>Furthest picture of earth</p>
          <p>~6 billion km</p>
        </aside>
      </section>

      <section>
        <blockquote>
          <p>
            I have realized that the past and future are real illusions, that
            they exist in the present, which is what there is and all there is.
          </p>
          <footer>
            <cite>Alan W. Watts</cite>
          </footer>
        </blockquote>
        <aside className='notes'></aside>
      </section>

      <section>
        <h3>Don't be that guy</h3>
        <Image src={selfieGuy} alt='The selfie guy' />
        <aside className='notes'>
          <p>
            Experience the moment. Your entire life doesn't need to be recorded
          </p>
          <p>
            The only value of recording something is to help you to actually
            remember
          </p>
          <p>Don't overdo the "Look where I am now" thing</p>
        </aside>
      </section>

      <section>
        <h3>You can record the past</h3>
        <aside className='notes'>
          <p>This technology has been around for years. It's a diary.</p>
        </aside>
      </section>

      <section>
        <h3>Do something new every day</h3>
      </section>

      <section>
        <blockquote>
          <p>
            You wouldn't worry so much about what others think of you if you
            realized how seldom they do.
          </p>
          <footer>
            <cite>Eleanor Roosevelt</cite>
          </footer>
        </blockquote>
        <aside className='notes'>
          <p>
            I used to feel strange in restaurants. Do I care when I see someone?
            No-one does.
          </p>
        </aside>
      </section>
    </section>

    <section>
      <section>
        <h2>My Tools</h2>
      </section>

      <section>
        <h3>The internet!</h3>
        <Image src={theInternet} alt="It's web surfing time!" />
        <aside className='notes'>
          <p>So much great stuff!</p>
          <ul>
            <li>Google</li>
            <li>foursquare</li>
            <li>nomadlist</li>
            <li>meetup.com</li>
            <li>couchsurfing</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Todo Lists</h3>
        <aside className='notes'>
          <p>
            Make a huge list of places to eat, food to try, people to get in
            touch with, sights to see
          </p>
        </aside>
      </section>

      <section>
        <h3>D.I.Y.</h3>
        <aside className='notes'>
          <p>The most useful tools are those you make for yourself</p>
        </aside>
      </section>

      <section>
        <h3>
          Store all the things! <br />
          <small>(without getting in the way of the experience)</small>
        </h3>
        <aside className='notes'>
          <p>Check out my site. Diary &amp; map</p>
        </aside>
      </section>

      <section>
        <h3>Todo</h3>
        <ul>
          <li>Click dot to add diary entry</li>
          <li>Better photo handling</li>
          <li>Animate zooming around the map</li>
          <li>Nice diary view that only I can see</li>
        </ul>
      </section>
    </section>

    <section>
      <section>
        <h2>That's how I got here</h2>
      </section>

      <section data-background-image={kittens.src}>
        <h2>Thanks</h2>
      </section>
    </section>
  </>
)
