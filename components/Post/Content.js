import React from 'react'
// TODO: Look into using interweave in here to autolink and escape stuff. Has a problem of wrapping everything in span tags
import styled from 'styled-components'
import { theme, palette, mixin } from '../Theme/helpers'
import { CommentWrapper } from './Comments'

const Content = styled.div`
  > p:first-child {
    margin-top: 0;
  }

  .container.single-article ${CommentWrapper} & {
    margin-left: 0;
    margin-right: 0;
  }

  .container.single-article &,
  .container.single-article & > .postrchild-editor {
    width: auto;
    max-width: none;
    margin-left: -var(--card-padding);
    margin-right: -var(--card-padding);

    background-color: var(--color-main);
    position: relative;
    overflow: hidden;

    & > *:not(div),
    .alignnone,
    .alignwide,
    .alignfull {
      display: block;
      width: ${theme('widthNormal')};
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding-left: var(--card-padding);
      padding-right: var(--card-padding);
    }

    > ul,
    > ol {
      padding-left: ${mixin.space(2)};
    }

    .alignwide {
      width: ${theme('widthWide')};
    }

    .alignfull {
      width: 100%;
      padding-left: 0;
      padding-right: 0;
    }

    > p {
      width: ${theme('widthNormal')};
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding-left: var(--card-padding);
      padding-right: var(--card-padding);
    }
  }
`

const PostContent = ({ content }) => {
  if (content && content.html) {
    return (
      <Content
        className="e-content"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    )
  } else if (content && content.value) {
    return (
      <Content as="p" className="e-content">
        {content.value}
      </Content>
    )
  } else if (typeof content === 'string') {
    return (
      <Content as="p" className="e-content">
        {content}
      </Content>
    )
  }
  return null
}

export default PostContent
