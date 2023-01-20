import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Dropdown, Popover } from 'antd'
import {
  Avatar,
  Modal,
  Tooltip,
  useAuthState,
  useGlobalState,
  useShowMessage,
  useUserDetails,
  Button,
} from '@pepper/ui'
import {
  Sidebar,
  Menu,
  Bell,
  Search,
  Gift,
  ChevronsRight,
  ChevronsLeft,
  Menu as MenuIcon,
} from 'react-feather'
import { CSSTransition } from 'react-transition-group'
import { StringParam, useQueryParam } from 'use-query-params'
import clsx from 'clsx'
import { fetchNotificationCount } from '@pepper/utils/lib/api/notifications/notifications'
import { joinPendingInvites } from '@pepper/utils/lib/api/invites/invites'
import { dataLayerExploreWhatsNewEvent } from '@pepper/utils/lib/function/dataLayerEvents'
import { OrgModalType } from 'container/Dashboard/Dashboard'
import GuidedTourModal from 'components/Modals/GuidedTour/GuidedTourModal'
import SideExpanded from 'components/SideModal/SideExpanded/SideModalDetails'
import { useSelectedCompanyId } from 'utils/functions/misc'
import { useBeamer } from 'utils/hooks/useBeamer'
import { useJoinOrganisation } from 'utils/hooks/useJoinOrganisation'
import Notifications from 'components/Notifications/Notifications'
import UniversalSearch from './UniversalSearch/UniversalSearch'
import UserDropdown from './UserDropdown'
import Editable from './PepperEditor/Editable'
import EditorUpdateStatus from './PepperEditor/EditorUpdateStatus'
import RenamePrivateDoc from './PepperEditor/RenamePrivateDoc'
import s from './Topbar.module.css'

type TopbarProps = {
  collapse: boolean
  toggleMenu: () => void
  toggleMobileMenu?: () => void
  joinOrganisationModal?: OrgModalType
  setJoinOrganisationModal?: (args: OrgModalType) => void
}

const Topbar = ({
  toggleMenu,
  toggleMobileMenu,
  collapse,
  joinOrganisationModal,
  setJoinOrganisationModal,
}: TopbarProps) => {
  const [showNotification, setShowNotification] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [hasUnseenNotification, setHasUnseenNotification] = useState(false)
  const [notificationUnSeenCount, setNotificationUnSeenCount] = useState(0)
  const [modal, setModal] = useState<Record<string, boolean>>({
    assistedOnboarding: false,
  })
  const companyId = useSelectedCompanyId()
  const { user } = useAuthState()
  const history = useHistory()
  const message = useShowMessage()
  useJoinOrganisation({ setJoinOrganisationModal })
  useBeamer(user)

  const { refetch } = useUserDetails('userDetails', user.uid || '')

  const {
    viewport,
    topbarComponent,
    assignmentRefetchFunction,
    setNotificationUnreadCount,
    setRefetchNotificationStats,
    refetchNotificationStats,
  } = useGlobalState()
  const [viewAssignmentId, setViewAssignmentId] = useQueryParam(
    'view_assignment',
    StringParam
  )

  const isMobileView = ['sm', 'md'].includes(viewport)

  const handleOnConfirmJoinOrganisation = async () => {
    if (!joinOrganisationModal || joinOrganisationModal.data === null) return

    try {
      const result = await joinPendingInvites({
        inviteId: joinOrganisationModal.data.invite_id,
      })

      if (result.status === 'ok') {
        message({ type: 'success', message: 'Joined successfully.' })
        setJoinOrganisationModal?.({ visible: false, data: null })
        refetch()

        window.location.href = `/${joinOrganisationModal.data.id}`
      } else {
        message({ type: 'error', message: result.error })
      }
    } catch (error) {
      message({ type: 'error', message: error.message })
    }
  }

  const handleToggleModal = () => {
    setModal(prevState => ({
      ...prevState,
      assistedOnboarding: !prevState.assistedOnboarding,
    }))
    setIsUserDropdownOpen(false)
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await fetchNotificationCount({ companyId })
      setHasUnseenNotification(data?.unseen > 0)
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleNotificationCount = async (): Promise<void> => {
      const { data } = await fetchNotificationCount({ companyId })
      setNotificationUnreadCount(data.total)
      setNotificationUnSeenCount(data.unseen ?? 0)
      setRefetchNotificationStats(false)
    }
    refetchNotificationStats && handleNotificationCount()
  }, [
    setNotificationUnreadCount,
    refetchNotificationStats,
    setRefetchNotificationStats,
    companyId,
  ])

  useEffect(() => {
    if (history.location.state) {
      const { showGuidedTour } = history.location.state as {
        showGuidedTour: boolean
      }
      if (showGuidedTour) {
        setModal({ assistedOnboarding: true })
      }
    }
  }, [history.location.state])

  return (
    <>
      <div
        className={clsx(s.topbar, {
          [s.isMobile]: isMobileView,
        })}
      >
        <div className={s.left}>
          {isMobileView ? (
            <div
              role="none"
              onClick={toggleMobileMenu}
              data-id="business-topbar-hamburger-button"
            >
              <Menu size={18} className={s.icon} />
            </div>
          ) : (
            <div
              role="none"
              onClick={toggleMenu}
              data-id="business-topbar-hamburger-button"
              title={collapse ? 'Expand Menu' : 'Collapse Menu'}
            >
              <Sidebar size={18} className={s.icon} />
              {
                <div>
                  <Button
                    className={s.menuIcon}
                    type="text"
                    // onClick={(): void => setCollapseNav(val => !val)}
                  >
                    <MenuIcon size={15} className={s.defaultMenuIcon} />
                    {collapse ? (
                      <ChevronsRight size={15} className={s.hoverMenuIcon} />
                    ) : (
                      <ChevronsLeft size={15} className={s.hoverMenuIcon} />
                    )}
                  </Button>
                </div>
              }
            </div>
          )}
          {!window.location.href.includes('projects') && <RenamePrivateDoc />}
          {!window.location.href.includes('projects') && <EditorUpdateStatus />}
          {topbarComponent}
        </div>
        <div className={s.right}>
          {!window.location.href.includes('projects') && <Editable />}
          {isMobileView ? (
            <button
              className={clsx(s.iconContainer, {
                [s.active]: showMobileSearch,
              })}
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search size={16} />
            </button>
          ) : (
            <UniversalSearch isMobileView={isMobileView} />
          )}
          <Popover
            content={
              <Notifications
                isMobileView={isMobileView}
                unseenCount={notificationUnSeenCount}
                onClose={() => setShowNotification(false)}
              />
            }
            trigger="click"
            autoAdjustOverflow={true}
            visible={showNotification}
            onVisibleChange={visible => setShowNotification(visible)}
            getPopupContainer={_node =>
              document.getElementById('notification-popover-container') ??
              document.body
            }
            overlayStyle={{
              padding: '0',
              width: '400px',
              overflow: 'hidden',
              border: '1px solid #E9E2EC',
              borderRadius: '8px',
              zIndex: 99999,
            }}
          >
            <button
              className={clsx(s.iconContainer, 'js-tour-notification', {
                [s.active]: showNotification,
                [s.highlight]: hasUnseenNotification,
              })}
              onClick={() => setShowNotification(true)}
            >
              <Bell size={16} />
            </button>
          </Popover>

          <Tooltip title="What's new?">
            <button
              className={s.iconContainer}
              onClick={() => {
                dataLayerExploreWhatsNewEvent()
              }}
              id="beamer-element"
              data-id="business-topbar-beamer-feed-button"
            >
              <Gift size={16} />
            </button>
          </Tooltip>

          {!isMobileView && (
            <Dropdown
              trigger={['click']}
              overlay={
                <UserDropdown
                  onClose={() => setIsUserDropdownOpen(false)}
                  setJoinOrganisationModal={setJoinOrganisationModal}
                  onToggleModal={handleToggleModal}
                />
              }
              placement="topRight"
              visible={isUserDropdownOpen}
              onVisibleChange={isOpen => setIsUserDropdownOpen(isOpen)}
            >
              <div className="js-tour-account-settings">
                <button
                  className={s.avatarButton}
                  data-id="business-topbar-avatar-button"
                >
                  <Avatar size="default" src={user.avatar} />
                </button>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
      <CSSTransition
        in={isMobileView && showMobileSearch}
        timeout={300}
        classNames={{
          enter: s.openSearch,
          enterActive: s.openSearchActive,
          exit: s.closeSearch,
          exitActive: s.closeSearchActive,
        }}
        unmountOnExit
      >
        <div className={s.searchContainer}>
          <UniversalSearch isMobileView={isMobileView} />
        </div>
      </CSSTransition>

      {viewAssignmentId && (
        <>
          <div
            className={s.sideViewDetailsBackDrop}
            onClick={() => {
              setViewAssignmentId(undefined)
            }}
            aria-hidden="true"
          />
          <div className={s.sideViewDetails}>
            {assignmentRefetchFunction && (
              <SideExpanded
                hideSideLoad={() => {
                  assignmentRefetchFunction()
                  setViewAssignmentId(undefined)
                }}
                assignmentDetails={viewAssignmentId}
                refetch={assignmentRefetchFunction}
              />
            )}
          </div>
        </>
      )}

      {joinOrganisationModal?.visible && (
        <Modal
          centered
          title={`Joining ${(
            '' + joinOrganisationModal.data?.company_name
          ).trim()}?`}
          visible={true}
          onCancel={() => {
            setJoinOrganisationModal?.({ visible: false, data: null })
          }}
          okText="Confirm"
          onOk={handleOnConfirmJoinOrganisation}
        >
          <p>
            Are you sure you want to join{' '}
            {('' + joinOrganisationModal.data?.company_name).trim()}?
          </p>
        </Modal>
      )}
      <GuidedTourModal
        isOpen={modal.assistedOnboarding}
        onCancel={handleToggleModal}
      />
    </>
  )
}

export default Topbar
