import { FC, useMemo } from 'react'

import { useGlobalState } from '@pepper/ui'
import clsx from 'clsx'
import { CloudOff, Cloud } from 'react-feather'

import styles from './_.module.css'

const EditorUpdateStatus: FC = () => {
  const { docErrorUpdate, editorUpdateStatus } = useGlobalState()
  const updatingStatus = useMemo(() => {
    if (editorUpdateStatus === 'UPDATE_FAILED') {
      return (
        <>
          <Cloud className={clsx(styles.cloudIcon, styles.errorCloud)} />
          {' Update failed'}
        </>
      )
    } else {
      return (
        <>
          <Cloud className={styles.cloudIcon} />
          {` ${editorUpdateStatus === 'UPDATING' ? 'Updating...' : 'Updated'}`}
        </>
      )
    }
  }, [editorUpdateStatus])

  return (
    <div
      className={clsx('pill', {
        [styles.offlineWrap]: editorUpdateStatus === 'offline',
        [styles.onlineWrap]: editorUpdateStatus !== 'OFFLINE',
        [styles.errorWrap]: editorUpdateStatus !== 'OFFLINE' && docErrorUpdate,
      })}
    >
      {editorUpdateStatus === 'OFFLINE' && (
        <>
          <CloudOff className={styles.cloudIconDisabled} /> Offline
        </>
      )}
      {editorUpdateStatus !== 'OFFLINE' && updatingStatus}
    </div>
  )
}

export default EditorUpdateStatus
