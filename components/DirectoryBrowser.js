import React from 'react'
import axios from 'axios'
import { NextSeo } from 'next-seo'
import Card from './Card'

const DirectoryBrowser = ({ match: { path }, files = [] }) => {
  return (
    <>
      <NextSeo title={path} />
      <h1 className="page-title">{path}</h1>
      <Card>
        {files.length === 0 ? (
          <p>Nothing found...</p>
        ) : (
          <ul className="file-listing">
            {path.split('/').length > 2 && (
              <li>
                <a href="../">../</a>
              </li>
            )}
            {files.map((file, i) => (
              <li key={'file-browser-item-' + i}>
                <a href={path + '/' + file}>{file}</a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}

DirectoryBrowser.getInitialProps = async ({ req }) => {
  try {
    const {
      data: { files },
    } = await axios.get(process.env.NEXT_PUBLIC_URL + '/api/files' + req.path)
    return { files }
  } catch (err) {
    console.err('[Error getting directory files]', err)
  }
  return {}
}

export default DirectoryBrowser
