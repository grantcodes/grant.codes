import styled from 'styled-components'
import { NextSeo } from 'next-seo'
import Card from 'components/Card'
import PageTitle from 'components/util/PageTitle'

const ContactList = styled.ul`
  list-style: none;
  display: block;
  padding: 0;
  margin: 0;

  > li {
    display: block;
  }
`

const Contact = () => (
  <>
    <NextSeo title="Contact" />
    <PageTitle as="h3">Get in touch!</PageTitle>

    <Card>
      <ContactList>
        {!!process.env.NEXT_PUBLIC_AUTHOR_EMAIL && (
          <li>
            <a href={'mailto:' + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}>Email</a>
          </li>
        )}
        {!!process.env.NEXT_PUBLIC_AUTHOR_TWITTER && (
          <li>
            <a href="https://twitter.com/messages/compose?recipient_id=1121850384">
              Twitter DM
            </a>
          </li>
        )}
      </ContactList>
    </Card>
  </>
)

export default Contact
