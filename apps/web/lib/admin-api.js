const siteUrl = process.env.NEXT_PUBLIC_URL

export async function deletePost(permalink) {
  const apiUrl = permalink.replace(siteUrl, siteUrl + '/api')
  const res = await fetch(apiUrl, {
    method: 'DELETE',
    credentials: 'same-origin',
  })
  if (res.status === 410) {
    const data = await res.json()
    if (data.result === 'deleted') {
      return true
    }
  }
  return false
}

export async function syndicatePost(permalink, service) {
  const apiUrl = permalink.replace(siteUrl, siteUrl + '/api')
  const res = await fetch(apiUrl, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      syndicate: service,
    }),
  })
  if (res.status === 200) {
    const data = await res.json()
    if (data.result === 'updated') {
      return true
    }
  }
  return false
}

export async function deleteSyndication(permalink, service) {
  const apiUrl = permalink.replace(siteUrl, siteUrl + '/api')
  const res = await fetch(apiUrl, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deleteSyndication: service,
    }),
  })
  if (res.status === 200) {
    const data = await res.json()
    if (data.result === 'deleted') {
      return true
    }
  }
  return false
}

export async function postAction(permalink, action) {
  const apiUrl = permalink.replace(siteUrl, siteUrl + '/api')
  const res = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  })
  if (res.status === 200) {
    const data = await res.json()
    return data
  }
  return false
}
