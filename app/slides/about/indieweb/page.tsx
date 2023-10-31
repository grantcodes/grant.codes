import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome to the IndieWeb',
}

const microformatsNote = `
<article class="h-entry">
  <p class="e-content">This is a basic note</p>
  <footer>
    <a class="h-card u-url" href="https://grant.codes"><span class="p-name">Grant Richmond</span></a>
    Published: <time class="dt-published" dateTime="2023-10-28T17:23:01.932Z">Sat Oct 28 2023</time>
  </footer>
</article>
`

const indieauthLink = `
<link rel="authorization_endpoint" href="https://indieauth.com/auth" />
`

const micropubNote = `
curl https://example.com/micropub -d h=entry -d "content=Hello World" -H "Authorization: Bearer XXXXXXX"
`

const micropubJSON = `
{
  "type": [
    "h-entry"
  ],
  "properties": {
    "name": [
      "Article with photo"
    ],
    "content": [
      "Isn't this neat"
    ],
    "photo": [
      "https://example.com/photo.jpg"
    ]
  }
}
`

const webmention = `
POST /webmention-endpoint HTTP/1.1
Host: aaronpk.example
Content-Type: application/x-www-form-urlencoded

source=https://waterpigs.example/post-by-barnaby&
target=https://aaronpk.example/post-by-aaron
`

export default () => (
  <>
    <section>
      <h1>Welcome to the IndieWeb</h1>
      <p>
        <small>
          <a href="https://grant.codes/slides/about/indieweb/">
            https://grant.codes/slides/about/indieweb/
          </a>
        </small>
      </p>

      <aside className="notes">
        <ul>
          <li>Of course find everything on my website</li>
          <li>If you don't know me - frontend web developer</li>
        </ul>
      </aside>
    </section>

    <section>
      <section>
        <h2>What?</h2>
        <blockquote>
          <p>
            The IndieWeb is a people-focused alternative to the "corporate web".
          </p>
          <footer>
            <cite>
              <a href="https://indieweb.org">indieweb.org</a>
            </cite>
          </footer>
        </blockquote>

        <aside className="notes">
          <ul>
            <li>Try to be a quick tour</li>
            <li>But there's so much available to learn on the wiki</li>
            <li>Join the chat</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Own your content</h3>

        <aside className="notes">
          <ul>
            <li>You should own your content</li>
            <li>Not some billionare</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Publish to your own site</h3>
      </section>

      <section>
        <h3>Social interactions between websites</h3>

        <aside className="notes">
          <ul>
            <li>
              Try to have a balance between existing social media and old-school
              blogging
            </li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Pricples over projects</h3>

        <aside className="notes">
          <ul>
            <li>There's no one size fits all solution</li>
            <li>Made for humans first, machines second</li>
          </ul>
        </aside>
      </section>
    </section>

    <section>
      <section>
        <h2>Why?</h2>
      </section>

      <section>
        <h3>Control</h3>
        <ul>
          <li className="fragment">UI</li>
          <li className="fragment">No limitations</li>
        </ul>
      </section>

      <section>
        <h3>Social media is a dumpster fire</h3>

        <img
          src="https://cdn.vox-cdn.com/thumbor/sEsDnQY1tYtHbITfj2j-BPV9-Lg=/0x38:1920x1043/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/13130363/thumb_social_dumpsterfire_clean.jpg"
          alt="Social media dumpster fire"
        />

        <aside className="notes">
          <ul>
            <li>Most recently that is Twitter</li>
            <li>But many other platforms have disappeared or turned to 💩</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Fun</h3>
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2FXreQmk7ETCak0%2Fgiphy.gif&f=1&nofb=1&ipt=5749b68c4b2ee01d7fac8d423c2ad2ea699088aabd457c1ea53a2d39c1baf0bc&ipo=images"
          alt="Thumbs up"
        />
      </section>
    </section>

    <section>
      <section>
        <h2>How?</h2>

        <aside className="notes">
          <ul>
            <li>Lets dive into the building blocks</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Domain</h3>

        <aside className="notes">
          <ul>
            <li>Costs a bit of money per year</li>
            <li>On the indieweb your domain is your identity</li>
            <li>
              <a href="https://www.w3.org/Provider/Style/URI">
                Cool URIs don't change
              </a>
            </li>
            <li>Can also be great for branding</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Hosting</h3>

        <aside className="notes">
          <ul>
            <li>This is normally the expensive part</li>
            <li>But for us this is no problem</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>Website</h3>

        <ul>
          <li className="fragment">IndieWeb specific solutions</li>
          <li className="fragment">Extend existing CMSes</li>
          <li className="fragment">DIY</li>
        </ul>

        <aside className="notes">
          <ul>
            <li>
              As I think you all know there are many options for building a
              website
            </li>
          </ul>
        </aside>
      </section>
    </section>

    <section>
      <section>
        <h2>
          <a href="https://indieweb.org/Category:building-blocks">
            Building Blocks
          </a>
        </h2>

        <aside className="notes">
          <ul>
            <li>Getting into the technical side of it</li>
            <li>But there are a lot of potential moving parts</li>
            <li>I'm just scratching the surface</li>
            <li>But don't get overwhelmed</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>
          <a href="https://indieweb.org/microformats">Microformats</a>
        </h3>

        <pre className="fragment">
          <code data-trim data-noescape>
            {microformatsNote}
          </code>
        </pre>

        <aside className="notes">
          <ul>
            <li>Kinda old-school</li>
            <li>Extension to html for machine readable data</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>
          Authentication <br />
          <a href="https://indieweb.org/IndieAuth" className="fragment">
            IndieAuth
          </a>
        </h3>

        <pre className="fragment">
          <code data-trim data-noescape>
            {indieauthLink}
          </code>
        </pre>

        <aside className="notes">
          <ul>
            <li>Sign in with your own domain</li>
            <li>Can work via a variety of auth methods</li>
            <li>
              IndieAuth.com uses RelMe auth - checks social services that link
              to your website and allows you to login through them
            </li>
            <li>All you need is a header / link</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>
          Interaction <br />
          <a href="https://indieweb.org/Webmention" className="fragment">
            Webmention
          </a>
        </h3>

        <pre className="fragment">
          <code data-trim data-noescape>
            {webmention}
          </code>
        </pre>

        <aside className="notes">
          <ul>
            <li>
              Provides a mechanism to send and receive mentions from anywhere
              across the web
            </li>
            <li>
              Basics is to send a http request to say, hey I wrote something
              about your url at my own url
            </li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>
          Publishing <br />
          <a href="https://indieweb.org/micropub" className="fragment">
            Micropub
          </a>
        </h3>

        <pre className="fragment">
          <code data-trim data-noescape>
            {micropubNote}
          </code>
        </pre>

        <pre className="fragment">
          <code data-trim data-noescape>
            {micropubJSON}
          </code>
        </pre>

        <aside className="notes">
          <ul>
            <li>
              A defined, relatively simple API to publish content to your
              website
            </li>
            <li>Often a headless system with server and client</li>
          </ul>
        </aside>
      </section>

      <section>
        <h4 className="fragment">
          <a href="https://indieweb.org/POSSE">
            <abbr title="Publish (on your) Own Site, Syndicate Elsewhere">
              POSSE
            </abbr>
          </a>
        </h4>

        <p className="fragment">
          Publish (on your) Own Site, Syndicate Elsewhere
        </p>

        <aside className="notes">
          <ul>
            <li>IndieWeb is not against posting to other places</li>
            <li>Go to where the people are</li>
            <li>But you always maintain your copy</li>
          </ul>
        </aside>
      </section>

      <section>
        <h3>But you don't need to DIY everything</h3>
        <ul>
          <li className="fragment">
            <a href="https://micro.blog">micro.blog</a> - Fully hosted service
          </li>
          <li className="fragment">
            <a href="https://wordpress.org/plugins/indieweb/">
              WordPress Plugins
            </a>{' '}
            - Use something you already know
          </li>
          <li className="fragment">
            <a href="https://getindiekit.com">IndieKit</a> - Static site backend
          </li>
          <li className="fragment">
            Micropub: <a href="https://quill.p3k.io">Quill</a>,{' '}
            <a href="https://ia.net/writer">iA Writer</a>,{' '}
            <a href="https://postr.dev">PostrChild</a>
          </li>
          <li className="fragment">
            <a href="https://webmention.io">Webmention.io</a>
          </li>
          <li className="fragment">
            POSSE:
            <a href="https://brid.gy">Bridgy</a> - Send your posts to social
            media
          </li>
          <li className="fragment">
            <a href="https://indieauth.com">IndieAuth.com</a> - Sign in with
            your website
          </li>
        </ul>

        <aside className="notes">
          <ul>
            <li>Bridgy for POSSE, but no facebook or twitter anymore</li>
          </ul>
        </aside>
      </section>
    </section>

    <section>
      <h2>Wrapping up</h2>
      <ul>
        <li className="fragment">Join the community</li>
        <li className="fragment">Read the Wiki</li>
        <li className="fragment">Your own content on your own website</li>
      </ul>

      <aside className="notes">What have we learned</aside>
    </section>

    <section>
      <h2>Cheers</h2>
    </section>
  </>
)
