import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../../Button'
import Icon from '../../Icon'
import searchIcon from 'eva-icons/fill/svg/search.svg'
import { mixin, theme } from '../../Theme/helpers'

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  margin-top: 1rem;
  margin-bottom: 1rem;
  box-shadow: ${mixin.shadow(2)};
  border-radius: var(--border-radius);

  input {
    margin: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: none;
    border-color: transparent;
    font-size: 1rem;
    min-width: 5em;
    @media (min-width: ${theme('midBreak')}) {
      font-size: 0.9rem;
    }
  }

  button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    box-shadow: none;
    font-size: 0.7rem;
    @media (min-width: ${theme('midBreak')}) {
      font-size: 0.9rem;
    }
  }
`

function Search() {
  const [showSearch, setShowSearch] = useState(false)
  const [search, setSearch] = useState('')

  // Only show on mount
  useEffect(() => {
    setShowSearch(true)
  }, [])

  if (!showSearch) {
    return null
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        window.location.href = `/search/${search.replace(' ', '+')}`
      }}
    >
      <input
        type="search"
        value={search}
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button type="submit">
        <span className="screen-reader-text">Search</span>
        <Icon icon={searchIcon} />
      </Button>
    </Form>
  )
}

export default Search
