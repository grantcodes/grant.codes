import { useState, useEffect } from 'react'

export default function() {
  const [isPrint, setIsPrint] = useState(false)

  useEffect(() => {
    const listener = mql => {
      if (mql.matches) {
        console.log('printing')
        setIsPrint(true)
        // beforePrint();
      } else {
        console.log('after printing')
        setIsPrint(false)
        // afterPrint();
      }
    }
    let mediaQuery = null
    if (window.matchMedia) {
      mediaQuery = window.matchMedia('print')
      mediaQuery.addListener(listener)
      return () => {
        if (mediaQuery) {
          mediaQuery.removeListener(listener)
        }
      }
    }
  }, [])

  return isPrint
}
