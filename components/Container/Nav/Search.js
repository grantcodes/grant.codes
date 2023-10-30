'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../../Button'
import Icon from '../../Icon'
import searchIcon from 'eva-icons/fill/svg/search.svg'

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
    <form
      className="search"
      onSubmit={(e) => {
        e.preventDefault()
        window.location.href = `/search/${search.replace(' ', '+')}`
      }}
    >
      <input
        className="search__input"
        type="search"
        value={search}
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button className="search__button" type="submit">
        <span className="screen-reader-text">Search</span>
        <Icon icon={searchIcon} />
      </Button>
    </form>
  )
}

export default Search
