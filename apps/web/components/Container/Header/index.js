import React from 'react'
import Link from '../../Link'

const Header = () => (
  <header className="main-header">
    <h1 className="main-header__title">
      <Link className="main-header__title__link" to="/">
        {process.env.NEXT_PUBLIC_SITE_NAME}
      </Link>
    </h1>
  </header>
)

export default Header
