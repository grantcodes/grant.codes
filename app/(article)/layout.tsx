import Container from 'components/Container'

interface ArticleLayoutProps {
  children: React.ReactNode
}

const ArticleLayout = ({ children }: ArticleLayoutProps) => (
  <Container className='single-article'>{children}</Container>
)

export default ArticleLayout
