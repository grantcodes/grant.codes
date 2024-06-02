export const dynamic = 'force-dynamic' // Only SSR.

import { revalidatePath } from 'next/cache'

const doRevalidation = async (path) => {
  if (!path) {
    return Response.json({ error: 'No path found to revalidate' })
  }

  try {
    console.log('Revaidating path', path)
    revalidatePath(path)

    return Response.json({
      path: path,
      revalidated: true,
      now: Date.now(),
    })
  } catch (err) {
    console.warn('Error in revlidation', err)

    // But going to return as a success to prevent other tools throwing errors.
    return Response.json({
      path,
      revalidated: false,
      now: Date.now(),
    })
  }
}

export async function POST(request) {
  const body = await request.json()
  const token = request.headers.get('token')

  if (token !== process.env.MICROPUB_TOKEN) {
    return Response.json({ message: 'Invalid token' }, { status: 401 })
  }

  const path = body?.path ?? ''

  return doRevalidation(path)
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const path = searchParams.get('path')

  if (token !== process.env.MICROPUB_TOKEN) {
    return Response.json({ message: 'Invalid token' }, { status: 401 })
  }

  doRevalidation(path)

  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}${path}`)
}
