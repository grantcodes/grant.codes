import React from 'react'
import styled from 'styled-components'
import Avatar from '../Avatar'

const Wrapper = styled.div``

const AvatarWrapper = styled.div`
  @media print {
    width: 20rem;
    max-width: 100%;
  }

  img {
    max-width: calc(100% - 4rem);
    max-height: calc(100% - 4rem);
  }
`

const Title = styled.h1`
  font-size: 4rem;
`

const Description = styled.p`
  font-size: 1.4em;
`

const Profile = props => {
  return (
    <Wrapper {...props}>
      <AvatarWrapper>
        <Avatar
          size={400}
          author={{
            name: 'Grant Richmond',
            photo: '/img/me.jpg',
            url: 'https://grant.codes',
          }}
          noName
          noLink
          noProxy
        />
      </AvatarWrapper>
      <Title>Hi! I'm Grant 👋</Title>
      <Description>
        {/* <span className="p-name">Grant Richmond</span>. A */}
        I'm a Scottish web developer, currently based in Madrid.
      </Description>
      <Description>I like to make, fun, usable websites.</Description>
      {/* <Photo className="p-photo" src="/img/me.jpg" /> */}
    </Wrapper>
  )
}

export default Profile
