import { useGlobalState } from '@pepper/ui'

import clsx from 'clsx'
import { FC } from 'react'

import styles from './_.module.css'

const Editable: FC = () => {
  const { isPepperDocEditable, setIsPepperDocEditable } = useGlobalState()

  return (
    <div className={styles.peAccessWrap}>
      <div
        role="none"
        onClick={() => setIsPepperDocEditable(false)}
        className={clsx(styles.pePill, {
          [styles.peActive]: !isPepperDocEditable,
        })}
      >
        Viewing
      </div>
      <div
        role="none"
        onClick={() => setIsPepperDocEditable(true)}
        className={clsx(styles.pePill, {
          [styles.peActive]: isPepperDocEditable,
        })}
      >
        Writing
      </div>
    </div>
  )
}

export default Editable
