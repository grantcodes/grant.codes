import { Metadata } from 'next'

import beer from './img/beer.jpg'
import makerspace01 from './img/makerspace-0.1.jpg'
import makerspace1 from './img/makerspace-1.0.jpg'
import makerspace2 from './img/makerspace-2.0.jpg'
import thanks from './img/thanks.jpg'

export const metadata: Metadata = {
  title: 'Jamming',
}

export default () => (
  <>
    <section>
      <h1>Jamming</h1>
    </section>

    <section>
      <section>
        <h2>Things start as an idea</h2>
      </section>
      <section data-background={beer.src}>
        <h3>An idea can start in the pub</h3>
      </section>
      <section data-background={makerspace01.src}>
        <h3>Then you need to do something about it</h3>
      </section>
      <section data-background={makerspace1.src}>
        <h3>And work on it</h3>
      </section>
      <section data-background={makerspace2.src}>
        <h3>And improve it</h3>
      </section>
      <section>
        <h3>Until it is something you can be proud of</h3>
      </section>
      <section>
        <h3>
          <strong>This</strong> happened in 8months
        </h3>
      </section>
    </section>

    <section>
      <section>
        <h2>Dundee MakerSpace</h2>
        <p>Enabling everyone to create anything</p>
      </section>
      <section>
        <h3>Volunteer run</h3>
      </section>
      <section>
        <h3>Member funded</h3>
      </section>
      <section>
        <h3>Sustainable</h3>
      </section>
      <section>
        <h3>Open</h3>
      </section>
      <section>
        <h3>Do awesome stuff</h3>
      </section>
      <section>
        <h3>Open every Monday evening</h3>
      </section>
      <section>
        <h3>Come help and do something amazing</h3>
      </section>
    </section>

    <section data-background={thanks.src}>
      <h2>Cheers</h2>
    </section>
  </>
)
