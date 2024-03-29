import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Micropub',
}

export default () => (
  <>
    <section>
      <h1>Micropub</h1>
      <p>
        <small>
          <a href='https://grant.codes/slides/about/micropub/'>
            https://grant.codes/slides/about/micropub/
          </a>
        </small>
      </p>
    </section>

    <section>
      <section>
        <h2>What?</h2>
      </section>

      <section>
        <h3>Publish to your own site</h3>
      </section>

      <section>
        <h3>IndieWeb</h3>
      </section>

      <section>
        <h3>Open API standard</h3>
        <p>W3C Working Draft</p>
      </section>
    </section>

    <section>
      <section>
        <h2>Why?</h2>
      </section>

      <section>
        <h3>No CMS</h3>
      </section>

      <section>
        <h3>Everyone posts generally the same things</h3>
      </section>
    </section>

    <section>
      <section>
        <h2>How?</h2>
      </section>

      <section>
        <h3>Authentication</h3>
        <p>IndieAuth or another form of OAuth</p>
      </section>

      <section>
        <h3>IndieAuth</h3>
        <p>Sign in with your own domain</p>
      </section>

      <section>
        <pre>
          <code
            className='html'
            data-trim
            data-noescape
          >{`<a href="https://github.com/terminalpixel" rel="me">Github</a>`}</code>
        </pre>
        or
        <pre>
          <code
            className='html'
            data-trim
            data-noescape
          >{`<link rel="me" href="https://github.com/terminalpixel">`}</code>
        </pre>
      </section>

      <section>
        <h3>Endpoint discovery</h3>
        <pre>
          <code data-trim className='html' data-noescape>
            {`<link rel="micropub" href="https://grant.codes/micropub">`}
          </code>
        </pre>
      </section>

      <section>
        <h3>Sending data</h3>
        <p>x-www-form-urlencoded, multipart form-data, or JSON</p>
      </section>

      <section>
        <h4>Defined format</h4>
      </section>

      <section>
        <pre>
          <code data-trim className='json' data-noescape>
            {`{
  "access_token": "the token",
  "type": ["h-entry"],
  "properties": {
    "name": ["The post title"],
    "content": ["The post content"],
    "summary": ["The post summary / excerpt"],
    "category": ["category1","category2"],
    "published": ["publish date"],
    "slug": ["url-slug"],
    "location": ["geo:latitude,longitude"],
    "mp-syndicate-to": ["twitter", "facebook", "etc"],
    "bookmark-of": ["url to bookmark"],
    "in-reply-to": ["url to reply to"],
    "repost-of": ["url to repost"],
  }
}`}
          </code>
        </pre>
      </section>

      <section>
        <h4>Media files</h4>
        <blockquote>
          <p>
            The entire request is sent in the multipart/form-data encoding, and
            the file is named by content type, either "audio", "video" or
            "photo".
          </p>
        </blockquote>
      </section>

      <section>
        <pre>
          <code data-trim className='json' data-noescape>
            {`{
  "type": ["h-entry"],
  "properties": {
    "content": ["hello world"]
  }
}`}
          </code>
        </pre>
      </section>

      <section>
        <pre>
          <code data-trim className='json' data-noescape>
            {`{
  "type": ["h-entry"],
  "properties": {
    "summary": [
      "Weight 155.73 pounds"
    ],
    "weight": [
      {
        "type": "h-measure",
        "properties": {
          "num": ["155.73"],
          "unit": ["lb"]
        }
      }
    ],
    "bodyfat": [
      {
        "type": "h-measure",
        "properties": {
          "num": ["19.83"],
          "unit": ["%"]
        }
      }
    ]
  }
}`}
          </code>
        </pre>
      </section>

      <section>
        <h3>The hard part</h3>
        <p>You need to save &amp; display the data</p>
      </section>

      <section>
        <h3>Existing libraries</h3>
        <ul>
          <li>
            <a href='https://wordpress.org/plugins/micropub/'>WordPress</a>
          </li>
          <li>
            <a href='https://github.com/aaronpk/p3k-micropub'>PHP</a>
          </li>
          <li>
            <a href='https://github.com/kylewm/flask-micropub'>
              Python / Flask
            </a>
          </li>
          <li>
            <a href='https://github.com/voxpelli/node-micropub-express'>
              Node / Express
            </a>
          </li>
        </ul>
      </section>
    </section>

    <section>
      <section>
        <h2>Clients</h2>
      </section>
      <section>
        <h3>
          <a href='https://quill.p3k.io/'>Quill</a>
        </h3>
      </section>
      <section>
        <h3>CLI</h3>
      </section>
      <section>
        <h3>Mobile apps</h3>
      </section>
      <section>
        <h3>
          <a href='http://ownyourgram.com/'>OwnYourGram</a>
        </h3>
        <p>Instagram to Micropub</p>
      </section>
      <section>
        <h3>
          <a href='https://teacup.p3k.io/'>Teacup</a>
        </h3>
        <p>Log your drinks</p>
      </section>
      <section>
        <h3>
          <a href='https://brid.gy/'>Bridgy</a>
        </h3>
        <p>Post content from other sites to your own website</p>
      </section>
      <section>
        <h3>Transformers</h3>
      </section>
    </section>

    <section>
      <h2>Cheers</h2>
    </section>
  </>
)
