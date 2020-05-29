import React from 'react'
import styled from 'styled-components'
import Link from '../Link'
import getAuthor from 'lib/get/author'
import imageProxy from '../../lib/image-proxy'
import { palette } from '../Theme/helpers'

const emojiPlaceholders = [
  '👻',
  '👤',
  '🕵️‍',
  '🧔',
  '👩‍🚀',
  '💀',
  '🧕',
  '🧙‍',
  '‍‍🤷‍',
]

const Author = styled.div`
  display: inline-block;
  max-width: 100%;

  ${Link} {
    display: block;
  }
`

const AuthorName = styled.span`
  display: inline-block;
  vertical-align: middle;
`

const Thumbnail = styled.img`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  overflow: hidden;
  width: ${(props) => (props.width / 20) * 1.5}em;
  height: ${(props) => (props.width / 20) * 1.5}em;
  object-fit: cover;
  text-align: center;
  color: inherit;
  background-color: ${palette('complementary')};
  transition: box-shadow 0.2s;
  clip-path: url(#topography-clip);
  clip-path: url(#topography-clip--rotating);
  text-indent: -100%;

  /* Make the image a square */
  &:before {
    content: '';
    display: block;
    width: 100%;
    padding-bottom: 100%;
  }

  /* Add a emoji placeholder */
  &:after {
    font-style: normal;
    content: '🤷‍';
    display: block;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    text-indent: 0;
    width: ${(props) => ((props.width / 20) * 1.5) / 2}em;
    height: ${(props) => ((props.width / 20) * 1.5) / 2}em;
    font-size: 2rem;
    line-height: 1.5;
    background-color: ${palette('complementary')};
  }

  ${emojiPlaceholders.map(
    (emoji, i) => `
    .h-cite:nth-of-type(${emojiPlaceholders.length}n - ${i}) &:after {
      content: "${emoji}"
    }
`
  )}
`

export default ({
  author,
  alt = '',
  noLink = false,
  noName = false,
  size = 20,
  noProxy = false,
}) => {
  if (!author) {
    return null
  }
  if (!author.url) {
    author = getAuthor(author)
  }
  if (!author.url) {
    return null
  }

  const photoUrl = author.photo
    ? noProxy
      ? author.photo
      : imageProxy(author.photo, { w: size, h: size, fit: 'contain', dpr: 2 })
    : null

  return (
    <Author className="h-card p-author">
      <Link className="u-url" to={author.url} as={noLink ? 'span' : null}>
        <Thumbnail
          className="u-photo"
          src={photoUrl}
          alt={alt}
          width={size}
          title={alt + author.name}
        />
        <AuthorName
          className={'p-name' + (noName ? ' screen-reader-text' : '')}
        >
          {author.name}
        </AuthorName>
      </Link>
    </Author>
  )
}
