import { FC, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import clsx from 'clsx'

import { Tooltip, Input, useShowMessage, useGlobalState } from '@pepper/ui'

import { postDocsContent } from '@pepper/utils/lib/api/editor/editor'

import styles from './_.module.css'

interface Params {
  itemId: string
}

const RenamePrivateDoc: FC = () => {
  const [itemName, setItemName] = useState('')
  const [itemNameInputFocused, setItemNameInputFocused] = useState(false)
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null)
  const showMessage = useShowMessage()
  const params = useParams<Params>()
  const { itemDetails } = useGlobalState()

  useEffect(() => {
    if (itemDetails?.title) {
      setItemName(itemDetails?.title)
    }
    if (itemDetails?.is_renamed === false) {
      inputRef?.current?.focus()
      setTimeout(() => {
        //inputRef?.current?.focus({
        //   cursor: 'all'
        // }) not working
        inputRef?.current?.select()
      }, 200)
    }
  }, [itemDetails])

  const updatePrivateItemName = useCallback(
    async (name: string) => {
      setItemNameInputFocused(false)
      try {
        if (name?.length < 5 || name?.length > 256) {
          throw Error(`Please enter name within 5 to 256 character length`)
        } else {
          await postDocsContent({
            id: params.itemId,
            body: {
              title: name,
            },
            apiType: 'PRIVATE_DOC',
          })
        }
      } catch (e) {
        showMessage({ type: 'error', message: e?.message })
        setItemName(itemDetails?.title ?? '')
      }
    },
    [itemDetails, params, showMessage]
  )

  const widthInputName = useMemo(() => {
    if (itemNameInputFocused) {
      return '16rem'
    } else if (!Number(itemName?.length)) {
      return '0'
    } else if (itemName?.length < 15) {
      return `${Number(itemName?.length) + 2}ch`
    } else {
      return '15ch'
    }
  }, [itemName, itemNameInputFocused])

  return (
    <div className={styles.peGroup}>
      <span className={styles.peGrpBold}>{`Projects / `}</span>
      <Tooltip title={itemName}>
        <Input
          itemRef={inputRef as unknown as string}
          style={{
            width: widthInputName,
          }}
          className={clsx(styles.peTitle, {
            [styles.peTitleOnFocus]: itemNameInputFocused,
          })}
          value={itemName}
          onFocus={() => setItemNameInputFocused(true)}
          onChange={e => setItemName(e?.target?.value)}
          onBlur={e => updatePrivateItemName(e?.target?.value)}
        />
      </Tooltip>
    </div>
  )
}

export default RenamePrivateDoc
