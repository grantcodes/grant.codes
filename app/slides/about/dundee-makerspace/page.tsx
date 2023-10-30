import { Metadata } from 'next'
import Image from 'next/image'
import beer from './img/beer.jpg'
import hackerspaceLife from './img/hackerspace-life.jpg'
import makerspace0 from './img/makerspace-0.1.jpg'
import makerspace1 from './img/makerspace-1.0.jpg'
import makerspace2 from './img/makerspace-2.0.jpg'
import makerspace25 from './img/makerspace-2.5.jpg'
import makerspace3 from './img/makerspace-3.0.jpg'
import thanks from './img/thanks.jpg'

export const metadata: Metadata = {
  title: 'Dundee MakerSpace',
}

export default () => (
  <>
    <section>
      <h1>Dundee MakerSpace.</h1>
      <p>Enabling everyone to create anything</p>
      <p>
        <a href='https://dundeemakerspace.co.uk'>dundeemakerspace.co.uk</a>
      </p>
    </section>

    <section>
      <section>
        <h2>Maker/Hackerspaces</h2>
        <aside className='notes'>
          <ul>
            <li>Originally started in Germany in the 90s</li>
            <li>Terms pretty much interchangable</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Community orientated workspace</h3>
        <aside className='notes'>
          <ul>
            <li>Brings together people with a common interest</li>
            <li>
              Generally a focus around things hard for people to do in their own
              homes due to cost / space
            </li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>Global movement</h3>
        <p>&gt; 1000 around the world</p>
      </section>
      <section>
        <h3>Ethos not rules</h3>
        <aside className='notes'>
          <ul>
            <li>There are no set rules</li>
            <li>They are all run slightly differently</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>All sorts of activities</h3>
        <p>
          <span className='fragment'>programming.</span>
          <span className='fragment'>furniture.</span>
          <span className='fragment'>sewing.</span>
          <span className='fragment'>art.</span>
          <span className='fragment'>electronics.</span>
          <span className='fragment'>3D printing.</span>
          <span className='fragment'>woodworking.</span>
          <span className='fragment'>science.</span>
          <span className='fragment'>laser cutting.</span>
          <span className='fragment'>recycling.</span>
          <span className='fragment'>weaving.</span>
          <span className='fragment'>metalworking.</span>
          <span className='fragment'>painting.</span>
          <span className='fragment'>hacking.</span>
          <span className='fragment'>research.</span>
          <span className='fragment'>robotics.</span>
          <span className='fragment'>repair.</span>
          <span className='fragment'>sign making.</span>
          <span className='fragment'>knitting.</span>
          <span className='fragment'>models.</span>
          <span className='fragment'>food.</span>
          <span className='fragment'>etc.</span>
          <span className='fragment'>etc.</span>
        </p>
      </section>
      <section>
        <h3>Flexible</h3>
        <aside className='notes'>
          <ul>
            <li>
              There are plenty of different things that could be considered
              makerspaces from garages to giant factories
            </li>
          </ul>
        </aside>
      </section>
      <section>
        <Image
          src={hackerspaceLife}
          alt='Hackerspace Life'
          className='stretch'
        />
        <aside className='notes'>
          <ul>
            <li>Recently got tuck shop</li>
          </ul>
        </aside>
      </section>
    </section>

    <section>
      <section>
        <h2>Our Business</h2>
        <aside className='notes'>
          <ul>
            <li>Started in June 2014</li>
            <li>Limited by guarantee</li>
            <li>Social enterprise</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>Volunteer run</h3>
        <aside className='notes'>
          <ul>
            <li>All done for fun</li>
            <li>Doesn&#39;t require full time</li>
            <li>Stuff &gt; People</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>Nimble</h3>
        <aside className='notes'>
          <ul>
            <li>No large board to hold us back</li>
            <li>People given the freedom to do what they want</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>Member funded</h3>
        <aside className='notes'>
          <ul>
            <li>Keeps us away from strings</li>
            <li>Helps to nurture the community spirit</li>
            <li>Easy to manage</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>Sustainable</h3>
        <aside className='notes'>
          <ul>
            <li>
              Funding great for improvements but do not want to be reliant
            </li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>Open</h3>

        <dl>
          <dt>Trello</dt>
          <dd>
            <a href='http://dms.rocks/trello'>dms.rocks/trello</a>
          </dd>
          <dt>Google Drive</dt>
          <dd>
            <a href='http://dms.rocks/drive'>dms.rocks/drive</a>
          </dd>
        </dl>

        <aside className='notes'>
          <ul>
            <li>We have no need for secrets</li>
            <li>Lets anyone contribute</li>
          </ul>
        </aside>
      </section>
    </section>

    <section>
      <section>
        <h2>Past</h2>
      </section>
      <section data-background={beer.src}>
        <h3>2014-04</h3>

        <aside className='notes'>
          <ul>
            <li>Started as an idea from a friend in the pub</li>
            <li>Made a trip to Edinburgh Hacklab</li>
          </ul>
        </aside>
      </section>

      <section data-background={makerspace0.src}>
        <h3>2014-07</h3>

        <aside className='notes'>
          <ul>
            <li>Started meeting in coffee shops to plan</li>
            <li>Got this room from a fiendly charity for an evening</li>
          </ul>
        </aside>
      </section>
      <section data-background={makerspace1.src}>
        <h3>2014-08</h3>

        <aside className='notes'>
          <ul>
            <li>Got our first unit in August</li>
            <li>Small but charming</li>
            <li>500sqft</li>
          </ul>
        </aside>
      </section>
      <section data-background={makerspace2.src}>
        <h3>2015-01</h3>

        <aside className='notes'>
          <ul>
            <li>
              Got offered a space in the vision building at the end of 2015
            </li>
            <li>
              Actually viewed it previously and never thought we&#39;d be able
              to afford it
            </li>
            <li>6500sqft</li>
            <li>Completely empty</li>
          </ul>
        </aside>
      </section>
      <section data-background={makerspace25.src}>
        <h3>2015-05</h3>

        <aside className='notes'>
          <ul>
            <li>Scraped together money and free stuff to fill it up</li>
          </ul>
        </aside>
      </section>
      <section data-background={makerspace3.src}>
        <h3>2016</h3>

        <aside className='notes'>
          <ul>
            <li>Kept on growing despite lack of cash</li>
            <li>Built a lot of things ourself</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>Events</h3>
        <p>
          <span className='fragment'>Robot wars.</span>
          <span className='fragment'>Jams.</span>
          <span className='fragment'>Hackathons.</span>
          <span className='fragment'>Workshops.</span>
          <span className='fragment'>Make / Share.</span>
        </p>
      </section>
    </section>

    <section>
      <section>
        <h2>Present</h2>
      </section>
      <section>
        <h3>Slow steady growth</h3>
        <aside className='notes'>
          <ul>
            <li>Up to 20+ members</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>Self sustaining</h3>
        <aside className='notes'>
          <ul>
            <li>Costs: rent, insurance, utilities</li>
            <li>More members = more money to spend on stuff</li>
          </ul>
        </aside>
      </section>
    </section>

    <section>
      <section>
        <h2>Future</h2>
      </section>
      <section>
        <h3>Employee</h3>
        <aside className='notes'>
          <ul>
            <li>Part time would be super helpful</li>
            <li>Applying for funding</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>More events</h3>
        <aside className='notes'>
          <ul>
            <li>Events are great.</li>
            <li>Bring more people in -&gt; more members</li>
            <li>Benefits attendees</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>More collaborations</h3>
        <aside className='notes'>
          <ul>
            <li>We work with everyone</li>
            <li>
              Science festival, makerfaires, Creative Dundee, NEoN, DCA, IGDA
              etc.
            </li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>More stuff</h3>
        <aside className='notes'>
          <ul>
            <li>3D printer</li>
            <li>Woodworking</li>
            <li>Starter kits</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>More fun</h3>
      </section>
    </section>

    <section>
      <section>
        <h2>Join in</h2>
      </section>
      <section>
        <h3>Monday maker meetups</h3>
        <p>Open to everyone every Monday evening from 6:30pm</p>
        <aside className='notes'>
          <ul>
            <li>
              This is the time to come down and try see what&#39;s going on
            </li>
            <li>Free for everyone!</li>
          </ul>
        </aside>
      </section>
      <section>
        <h3>Membership</h3>
        <ul>
          <li>&pound;25 per month</li>
          <li>24h access</li>
          <li>Open to everyone</li>
        </ul>
      </section>
      <section>
        <h3>Find us</h3>
        <p>Unit 5, Vision Building</p>
        <div className='stretch'>{/* MAP HERE */}</div>
      </section>
    </section>

    <section data-background={thanks.src}>
      <h1>Cheers.</h1>
    </section>

    {/* <!-- For Google map -->
		<script src='https://maps.googleapis.com/maps/api/js?v=3.exp'></script>
	    <style>
	    	#gmap_canvas {
	    		color: #000;
	    	}
	    	#gmap_canvas img {
	    		max-width :none !important;
	    		background: none !important;
	    	}
	    </style>

		<script type='text/javascript'>function init_map(){var myOptions = {zoom:15,center:new google.maps.LatLng(56.45612999999999,-2.9788300000000163),mapTypeId: google.maps.MapTypeId.ROADMAP};map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(56.45612999999999,-2.9788300000000163)});infowindow = new google.maps.InfoWindow({content:'<strong>Dundee MakerSpace</strong><br> Vision Building,  20 Greenmarket, DD1 4QB<br>'});google.maps.event.addListener(marker, 'click', function(){infowindow.open(map,marker);});infowindow.open(map,marker);}google.maps.event.addDomListener(window, 'load', init_map);</script> */}
  </>
)
