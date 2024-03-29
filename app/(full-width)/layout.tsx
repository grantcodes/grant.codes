import Container from 'components/Container'

export default function DefaultPageLayout ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Container className='right-aligned right-aligned--wide-content'>
      {children}
    </Container>
  )
}
