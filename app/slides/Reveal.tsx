'use client'

import { useEffect } from 'react'

import 'reveal.js/dist/reset.css'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import 'reveal.js/dist/theme/simple.css'
import './slides.scss'

const importAll = async () => {
  const RevealJs = await import('reveal.js')
  const RevealMarkdown = await import('reveal.js/plugin/markdown/markdown.esm')
  const RevealHighlight = await import(
    'reveal.js/plugin/highlight/highlight.esm'
  )
  const RevealNotes = await import('reveal.js/plugin/notes/notes.esm')

  return {
    RevealJs: RevealJs.default,
    RevealMarkdown: RevealMarkdown.default,
    RevealHighlight: RevealHighlight.default,
    RevealNotes: RevealNotes.default,
  }
}

const Reveal = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    importAll().then(
      ({ RevealJs, RevealNotes, RevealMarkdown, RevealHighlight }) => {
        let reveal = new RevealJs({
          controls: false,
          progress: true,
          center: true,
          transition: 'slide',
          plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
        })

        reveal.initialize()
      }
    )
  }, [])

  return (
    <div className='reveal'>
      <div className='slides' data-transition='slide'>
        {children}
      </div>
    </div>
  )
}

export { Reveal }
