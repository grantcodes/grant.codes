const getAuthor = (data = null) => {
  let author = {
    url: null,
    name: null,
    photo: null,
  }

  if (data && typeof data === 'string' && data.startsWith('http')) {
    author.url = data
    author.name = new URL(data).hostname
  }

  if (data && data.properties) {
    if (data.properties.url) {
      author.url = data.properties.url[0]
    }
    if (data.properties.name) {
      author.name = data.properties.name[0]
    }
    if (data.properties.photo) {
      author.photo = data.properties.photo[0]
    }
  }

  return author
}

export default getAuthor
