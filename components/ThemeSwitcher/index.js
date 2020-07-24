import dynamic from 'next/dynamic'

const ThemeSwitcher = dynamic(() => import('./ThemeSwitcher'), {
  ssr: false,
})

export default ThemeSwitcher
