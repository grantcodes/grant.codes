import React, { Fragment } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Card from 'components/Card'
import Map from 'components/Map'
import { NextSeo } from 'next-seo'
import PageTitle from 'components/util/PageTitle'
import getLastLocation from 'lib/get/last-location'

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

const Where = ({ location }) => {
  return (
    <Fragment>
      <NextSeo title="Where am I?" noIndex />
      <Wrapper>
        <PageTitle as="h2">Where am I?</PageTitle>

        <WhereCard>
          {location ? (
            <>
              <p>
                {process.env.NEXT_PUBLIC_AUTHOR_NAME} was last spotted{' '}
                {moment(location.isotst).fromNow()}
                {!!location.addr && `at ${location.addr}`}
              </p>
              <DeviceInfo>
                {!!location.batt && (
                  <Fragment>
                    <dt>🔋 Battery %</dt>
                    <dd>{location.batt}</dd>
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
        location={location ? `geo:${location.lat},${location.lon}` : 'geo:0,0'}
        zoom={location ? 12 : 6}
        defaultWidth={1200}
        defaultHeight={1200}
      />
    </Fragment>
  )
}

Where.containerClass = 'right-aligned'

export const getServerSideProps = async () => {
  const location = await getLastLocation()
  return { props: { location } }
}

export default Where
