import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import clsx from 'clsx'
// import { Dropdown } from 'antd'
// import {
//   Menu as MenuIcon,
//   ChevronsRight,
//   ChevronsLeft,
//   User as UserIcon,
//   Power,
// } from 'react-feather'

import {
  useShowMessage,
  Button,
  useUserDetails,
  MenuItem,
  useAuthState,
  Avatar,
  Menu as MenuPepper,
  Input,
  Tooltip,
  useGlobalState,
} from '@pepper/ui'
import { postDocsContent } from '@pepper/utils/lib/api/editor/editor'
import { checkAuthorization } from '@pepper/utils/lib/api/functions/authHelpers'

import Editor from 'container/EditDocument/EditorRoot'
import Navbar from 'components/Navbar/Navbar'
import Topbar from 'components/Topbar/Topbar'

import styles from './_.module.css'

interface Params {
  itemId: string
}

const PrivateDocument = (): JSX.Element => {
  // const inputRef: React.RefObject<HTMLInputElement> = useRef(null)
  // const { logout } = useAuthState()
  // const history = useHistory()
  const [socketDataPushed, setSocketDataPushed] = useState<string[]>([])
  const [collapseNav, setCollapseNav] = useState(true)
  const userId = checkAuthorization()?.data?.userId
  const { data: user } = useUserDetails(`/users/${userId}`, userId || '')
  const params = useParams<Params>()
  // const showMessage = useShowMessage()
  const {
    isPepperDocEditable,
    docErrorUpdate,
    setDocErrorUpdate,
    itemDetails,
    setItemDetails,
    editorUpdateStatus,
    setEditorUpdateStatus,
  } = useGlobalState()

  useEffect(() => {
    if (!docErrorUpdate) {
      if (socketDataPushed?.length > 0) {
        setEditorUpdateStatus('UPDATING')
      } else {
        setEditorUpdateStatus('UPDATED')
      }
    }
  }, [socketDataPushed, docErrorUpdate])

  const updateSocketCallback = useCallback(
    (data: SocketEventType) => {
      const key = data?.key as string
      if (data?.status === 'error') {
        setDocErrorUpdate(true)
      } else if (data?.status === 'reset') {
        setDocErrorUpdate(false)
        setSocketDataPushed([])
      } else if (data?.status === 'entry' && !docErrorUpdate) {
        setSocketDataPushed(val => {
          return [...val, key]
        })
      } else if (data?.status === 'ok' && !docErrorUpdate) {
        setSocketDataPushed(val => {
          const foundIndex = val?.findIndex(it => it === key)
          if (foundIndex > -1) {
            const updatedValue = [...val]
            updatedValue?.splice(foundIndex, 1)
            return updatedValue
          }
          return val
        })
      }
    },
    [docErrorUpdate, setDocErrorUpdate]
  )

  const [shouldClearTimeout, setShouldClearTimeout] = useState(false)

  const isAuthorized = useMemo(() => {
    return localStorage.getItem('authToken') ? true : false
  }, [])

  return (
    <>
      <div
        key={params.itemId}
        className={clsx(styles.pepperEditorWrap, styles.customScrollBar)}
      >
        <div
          className={clsx(styles.pepperSidebarLeft, {
            [styles.expandedSideNav]: !collapseNav,
          })}
        >
          <Navbar collapseMenu={collapseNav} />
        </div>

        <div className={styles.pepperEditorInnerContent}>
          {/* <div className={styles.pepperEditorHeader}>
            <div className={styles.pepperEditorSubHeader}>
              <div>
                <Button
                  className={styles.menuIcon}
                  type="text"
                  onClick={(): void => setCollapseNav(val => !val)}
                >
                  <MenuIcon size={15} className={styles.defaultMenuIcon} />
                  {collapseNav ? (
                    <ChevronsRight size={15} className={styles.hoverMenuIcon} />
                  ) : (
                    <ChevronsLeft size={15} className={styles.hoverMenuIcon} />
                  )}
                </Button>
              </div>
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
                <div
                  className={clsx('pill', {
                    [styles.offlineWrap]: netWorkState === 'offline',
                    [styles.onlineWrap]: netWorkState === 'online',
                    [styles.errorWrap]:
                      netWorkState === 'online' && errorUpdate,
                  })}
                >
                  {netWorkState === 'offline' && (
                    <>
                      <CloudOff className={styles.cloudIconDisabled} /> Offline
                    </>
                  )}
                  {netWorkState === 'online' && updatingStatus}
                </div>
              </div>
            </div>
            <div className={styles.peGroup}>
              
              <Dropdown overlay={menu} arrow={true}>
                <div>
                  <Avatar
                    nameChar={`${user?.first_name?.[0]} ${user?.last_name?.[0]}`}
                    showBorderColor={true}
                    size={40}
                    className={styles.avatar}
                    src={user?.avatar}
                  >
                    {`${user?.first_name?.[0]?.toUpperCase()}${user?.last_name?.[0]?.toUpperCase()}`}
                  </Avatar>
                </div>
              </Dropdown>
            </div>
          </div> */}
          <Topbar
            collapse={true}
            toggleMenu={() => null}
            toggleMobileMenu={() => null}
            joinOrganisationModal={undefined}
            setJoinOrganisationModal={() => null}
          />
          <div className={styles.peEditableArea}>
            {params.itemId && (
              <Editor
                isEditable={isPepperDocEditable}
                stopUpdateForcefully={false}
                updatingEditor={editorUpdateStatus === 'UPDATING'}
                setUpdatingEditor={val => {
                  val
                    ? setEditorUpdateStatus('UPDATING')
                    : setEditorUpdateStatus('UPDATED')
                }}
                assignmentData={undefined}
                assignmentCode={itemDetails?.code}
                assignmentId={params.itemId}
                netWorkState={editorUpdateStatus}
                setNetworkStatus={setEditorUpdateStatus}
                collapseNav={collapseNav}
                setCollapseNav={setCollapseNav}
                shouldClearTimeout={shouldClearTimeout}
                setShouldClearTimeout={setShouldClearTimeout}
                isAuthorized={isAuthorized}
                setErrorUpdate={setDocErrorUpdate}
                editorType="PRIVATE_DOC"
                setPrivateItemDetails={setItemDetails}
                privateDocName={itemDetails?.title}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PrivateDocument
