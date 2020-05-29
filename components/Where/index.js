import React, { Fragment } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Card from '../Card'
import Map from '../Map'
import { NextSeo } from 'next-seo'
import PageTitle from '../util/PageTitle'
import getLastLocation from './get-last-location'

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
`

const WhereCard = styled(Card)`
  max-width: 30em;

  p {
    margin-top: 0;
    margin-bottom: 0;
  }
`

const WhereMap = styled(Map)`
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
`

const DeviceInfo = styled.dl`
  font-size: 0.6em;
  overflow: hidden;

  dt {
    float: left;
    clear: left;
    font-weight: bold;
    margin-right: 0.5em;
    &::after {
      content: ':';
    }
  }

  dd {
    float: left;
    margin: 0;
  }
`

const Where = ({ userLocation }) => (
  <>
    <NextSeo title="Where am I?" noIndex />
    <Wrapper>
      <PageTitle as="h2">Where am I?</PageTitle>

      <WhereCard>
        {userLocation ? (
          <>
            <p>
              {process.env.NEXT_PUBLIC_AUTHOR_NAME} was last spotted{' '}
              {moment(userLocation.isotst).fromNow()}
              {!!userLocation.addr && `at ${userLocation.addr}`}
            </p>
            <DeviceInfo>
              {!!userLocation.batt && (
                <Fragment>
                  <dt>🔋 Battery %</dt>
                  <dd>{userLocation.batt}</dd>
                </Fragment>
              )}
            </DeviceInfo>
          </>
        ) : (
          <p>{process.env.NEXT_PUBLIC_AUTHOR_NAME} not found 🕵️‍</p>
        )}
      </WhereCard>
    </Wrapper>

    <WhereMap
      themed
      location={
        userLocation ? `geo:${userLocation.lat},${userLocation.lon}` : 'geo:0,0'
      }
      zoom={userLocation ? 12 : 6}
      defaultWidth={1200}
      defaultHeight={1200}
    />
  </>
)

Where.getInitialProps = async () => {
  const userLocation = await getLastLocation()
  return { userLocation }
}

export default Where
