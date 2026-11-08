import { useState, useEffect } from 'react'
import getCollection from '../lib/local-collection'

const promise = async () => {
  const { replicationState } = await getCollection()
  return replicationState
}

let replicationStatePromise = null
const getReplicationState = () => {
  if (!replicationStatePromise) {
    replicationStatePromise = promise()
  }
  return replicationStatePromise
}

const useIsSyncing = () => {
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    let mounted = true
    let subscription = null

    const onChange = active => {
      if (mounted && active !== isSyncing) {
        setIsSyncing(active)
      }
    }

    getReplicationState().then(replicationState => {
      if (replicationState) {
        subscription = replicationState.active$.subscribe(onChange)
      }
    })

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return isSyncing
}

export default useIsSyncing
