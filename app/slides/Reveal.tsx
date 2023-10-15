'use client'

import { useEffect } from 'react'
import RevealJs from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm'
import RevealNotes from 'reveal.js/plugin/notes/notes.esm'

import 'reveal.js/dist/reset.css'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import 'reveal.js/dist/theme/simple.css'
import './slides.scss'

const Reveal: React.FC = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    let reveal = new RevealJs({
      controls: false,
      progress: true,
      center: true,
      transition: 'slide',
      plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
    })

    reveal.initialize()
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
