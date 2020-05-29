import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

const breakpoint = '50rem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 2rem;

  @media (min-width: ${breakpoint}) {
    flex-direction: row;
    max-width: 54rem;
  }
`

const Left = styled.div`
  margin-bottom: 0.5rem;
  @media (min-width: ${breakpoint}) {
    flex-grow: 0;
    flex-shrink: 0;
    width: 15rem;
    margin-right: 2rem;
    margin-bottom: 1rem;
  }
`

const Right = styled.div`
  flex-grow: 1;
`

const Title = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`

const Subtitle = styled.h5`
  margin: 0;
  font-size: 1.2rem;
  @media (min-width: ${breakpoint}) {
    margin-bottom: 0.5rem;
  }
`

const Content = styled.div`
  display: block;
`

const Time = styled.time`
  font-size: 0.9rem;
  opacity: 0.8;
`

const Event = ({
  place,
  start,
  end = null,
  title,
  children,
  links = [],
  ...props
}) => (
  <Wrapper {...props}>
    <Left>
      {!!place && <Subtitle className="p-location">{place}</Subtitle>}
      <Time className="dt-start" datetime={moment(start).format()}>
        {moment(start).format('MMMM YYYY')}
      </Time>{' '}
      -{' '}
      {end ? (
        <Time className="dt-end" datetime={moment(end).format()}>
          {moment(end).format('MMMM YYYY')}
        </Time>
      ) : (
        'current'
      )}
    </Left>
    <Right>
      <Title className="p-name">{title}</Title>
      <Content className="p-summary">{children}</Content>
      {links.map(link => (
        <a href={link} key={link}>
          {new URL(link).hostname}
        </a>
      ))}
    </Right>
  </Wrapper>
)

export default Event
