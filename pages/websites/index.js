import styled from 'styled-components'
import { theme } from 'components/Theme/helpers'
import Head from 'next/head'
import Link from 'next/link'
import Tile from 'components/Websites/Tile'
import websites from '../../data/websites'

const List = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  list-style: none;

  @media (min-width: ${theme('midBreak')}) {
    width: 100%;
  }
`

export default () => (
  <List>
    {websites.map((website) => (
      <Tile {...website} />
    ))}
  </List>
)
