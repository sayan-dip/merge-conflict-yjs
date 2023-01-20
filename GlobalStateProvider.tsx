/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useReducer
} from 'react'

type SidebarCountKeys =
  | 'allProjectsCount'
  | 'keywordPortfoliosCount'
  | 'allAssignmentsCount'

type State = {
  tourState: { stepIndex: number; run: boolean }
  isTourRunning: boolean
  topbarComponent: ReactNode | null
  opportunityBoardComponent: ReactNode | null
  navbarComponent: ReactNode | null
  notificationUnreadCount: number
  refetchNotificationStats: boolean
  inboxThreadUpdate: boolean
  assignmentRefetchFunction: (() => void) | null
  streamChat: {
    client: any
    userId: string | null
    projectAssignments: any[]
    assignmentsByCreators: any
  }
  isRefetchBoolean: boolean
  grammarlySuggestionsCount: number
  viewport: 'sm' | 'md' | 'lg'
  sidebarCounts: {
    allProjectsCount: number
    keywordPortfoliosCount: number
    allAssignmentsCount: number
  }
  pendingSidebarCountKeys: Array<SidebarCountKeys>
  isPepperEditor: boolean
  isPepperDocEditable: boolean
  docErrorUpdate: boolean
  editorUpdateStatus: string
  itemDetails: { title: string; code: number; is_renamed: boolean } | null
}

type TourContextType = {
  toggleTourStatus: (value: boolean) => void
  changeTourState: (value: { stepIndex?: number; run: boolean }) => void
  setPendingSidebarCountKeys: (
    value: Array<SidebarCountKeys>,
    type?: 'push' | 'remove'
  ) => void
  setTopbarComponent: (value: ReactNode | null) => void
  setOpportunityBoardComponent: (value: ReactNode | null) => void
  setNavbarComponent: (value: ReactNode | null) => void
  setNotificationUnreadCount: (val: number) => void
  setRefetchNotificationStats: (val: boolean) => void
  setInboxThreadUpdate: (value: boolean) => void
  setAssignmentRefetchFunction: (fn: () => void) => void
  setStreamChat: (value: any) => void
  setRefetchBoolean: (value: boolean) => void
  setGrammarlySuggestionsCount: (val: number) => void
  setViewport: (value: string) => void
  setSidebarCountData: (val: number, key: SidebarCountKeys) => void
  setIsPepperEditor: (val: boolean) => void
  setIsPepperDocEditable: (val: boolean) => void
  setDocErrorUpdate: (val: boolean) => void
  setItemDetails: (
    val: { title: string; code: number; is_renamed: boolean } | null
  ) => void
  setEditorUpdateStatus: (val: string) => void
} & State

type ReducerType =
  | 'TOGGLE_TOUR_STATUS'
  | 'CHANGE_TOUR_STATE'
  | 'SET_PENDING_SIDEBAR_DATA_KEYS'
  | 'SET_TOP_BAR_COMPONENT'
  | 'SET_OPPORTUNITY_BOARD_COMPONENT'
  | 'SET_NAV_BAR_COMPONENT'
  | 'SET_NOTIFICATION_UNREAD_COUNT'
  | 'REFETCH_NOTIFICATION_STATS'
  | 'SET_INBOX_UNREAD_UPDATE'
  | 'SET_ASSIGNMENT_REFETCH_FUNCTION'
  | 'SET_STREAM_CHAT'
  | 'SET_REFETCH_BOOLEAN'
  | 'SET_GRAMMARLY_SUGGESTIONS_COUNT'
  | 'SET_VIEWPORT'
  | 'SET_SIDEBAR_COUNT_DATA'
  | 'SET_IS_PEPPER_EDITOR'
  | 'SET_IS_PEPPER_DOC_EDITABLE'
  | 'SET_NETWORK_STATUS'
  | 'SET_DOC_ERROR_UPDATE'
  | 'SET_DOC_UPDATING'
  | 'SET_ITEM_DETAILS'
  | 'SET_EDITOR_UPDATE_STATUS'

const initialState: State = {
  tourState: { stepIndex: 0, run: false },
  isTourRunning: false,
  topbarComponent: null,
  opportunityBoardComponent: null,
  navbarComponent: null,
  notificationUnreadCount: 0,
  refetchNotificationStats: true,
  inboxThreadUpdate: true,
  assignmentRefetchFunction: null,
  streamChat: {
    client: null,
    userId: null,
    projectAssignments: [],
    assignmentsByCreators: null
  },
  isRefetchBoolean: false,
  grammarlySuggestionsCount: 0,
  viewport: 'lg',
  sidebarCounts: {
    allProjectsCount: 0,
    keywordPortfoliosCount: 0,
    allAssignmentsCount: 0
  },
  pendingSidebarCountKeys: ['allProjectsCount', 'keywordPortfoliosCount'],
  isPepperEditor: false,
  isPepperDocEditable: true,
  docErrorUpdate: false,
  itemDetails: null,
  editorUpdateStatus: 'UPDATED'
}

// default values are added in the component
const AuthContext = createContext<TourContextType>({
  ...initialState,
  toggleTourStatus: () => {
    /** Handle tour status */
  },
  changeTourState: () => {
    /** Handle tour state */
  },
  setPendingSidebarCountKeys: (
    _: SidebarCountKeys[],
    __?: 'push' | 'remove'
  ) => {
    /** Handle updating sidebar count data */
  },
  setTopbarComponent: () => {
    /** set topbar component */
  },
  setOpportunityBoardComponent: () => {
    /** set navbar component */
  },
  setNavbarComponent: () => {
    /** set navbar component */
  },
  setNotificationUnreadCount: () => {
    /** set notification set count */
  },
  setSidebarCountData: (_: number, __: SidebarCountKeys) => {
    /** set sidebar count data*/
  },
  setRefetchNotificationStats: () => {
    /** refetch notification */
  },
  setInboxThreadUpdate: () => {
    /** set inbox unread thread count */
  },
  setAssignmentRefetchFunction: () => {},
  setStreamChat: () => {},
  setRefetchBoolean: () => {
    /** set Refetch boolean */
  },
  setGrammarlySuggestionsCount: () => {},
  setViewport: () => {},
  setIsPepperEditor: () => {},
  /** to be added */
  setIsPepperDocEditable: () => {},
  /** to be added */
  setDocErrorUpdate: () => {
    /** to be added */
  },
  setItemDetails: () => {
    /** tba */
  },
  setEditorUpdateStatus: () => {
    /** tba */
  }
})

const reducer = (
  state: State,
  action: { type: ReducerType; payload: any }
): State => {
  switch (action.type) {
    case 'TOGGLE_TOUR_STATUS':
      return {
        ...state,
        isTourRunning: action.payload
      }
    case 'CHANGE_TOUR_STATE':
      return {
        ...state,
        tourState: action.payload
      }
    case 'SET_PENDING_SIDEBAR_DATA_KEYS': {
      const { type, value } = action.payload
      const currentKeys = state.pendingSidebarCountKeys
      let newKeys: SidebarCountKeys[] = []
      if (type === 'remove')
        newKeys = currentKeys.filter(key => !value.includes(key))
      else newKeys = [...currentKeys, ...value]
      return {
        ...state,
        pendingSidebarCountKeys: [...new Set(newKeys)]
      }
    }
    case 'SET_TOP_BAR_COMPONENT':
      return {
        ...state,
        topbarComponent: action.payload
      }
    case 'SET_OPPORTUNITY_BOARD_COMPONENT':
      return {
        ...state,
        opportunityBoardComponent: action.payload
      }
    case 'SET_NAV_BAR_COMPONENT':
      return {
        ...state,
        navbarComponent: action.payload
      }
    case 'SET_NOTIFICATION_UNREAD_COUNT':
      return {
        ...state,
        notificationUnreadCount: action.payload
      }
    case 'SET_SIDEBAR_COUNT_DATA':
      return {
        ...state,
        sidebarCounts: {
          ...state.sidebarCounts,
          [action.payload.key]: action.payload.value
        }
      }
    case 'REFETCH_NOTIFICATION_STATS':
      return {
        ...state,
        refetchNotificationStats: action.payload
      }
    case 'SET_INBOX_UNREAD_UPDATE':
      return {
        ...state,
        inboxThreadUpdate: action.payload
      }
    case 'SET_ASSIGNMENT_REFETCH_FUNCTION':
      return {
        ...state,
        assignmentRefetchFunction: action.payload
      }
    case 'SET_STREAM_CHAT':
      return {
        ...state,
        streamChat: action.payload
      }
    case 'SET_REFETCH_BOOLEAN':
      return {
        ...state,
        isRefetchBoolean: action.payload
      }
    case 'SET_GRAMMARLY_SUGGESTIONS_COUNT':
      return {
        ...state,
        grammarlySuggestionsCount: action.payload
      }
    case 'SET_VIEWPORT':
      return {
        ...state,
        viewport: action.payload
      }
    case 'SET_IS_PEPPER_EDITOR':
      return {
        ...state,
        isPepperEditor: action.payload
      }
    case 'SET_IS_PEPPER_DOC_EDITABLE':
      return {
        ...state,
        isPepperDocEditable: action.payload
      }
    case 'SET_DOC_ERROR_UPDATE':
      return {
        ...state,
        docErrorUpdate: action.payload
      }
    case 'SET_ITEM_DETAILS':
      return {
        ...state,
        itemDetails: action.payload
      }
    case 'SET_EDITOR_UPDATE_STATUS':
      return {
        ...state,
        editorUpdateStatus: action.payload
      }
    default:
      return state
  }
}

const GlobalStateProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const toggleTourStatus = (value: boolean) =>
    dispatch({ type: 'TOGGLE_TOUR_STATUS', payload: value })

  const changeTourState = (value: { stepIndex?: number; run: boolean }) =>
    dispatch({ type: 'CHANGE_TOUR_STATE', payload: value })

  const setPendingSidebarCountKeys = (
    value: Array<SidebarCountKeys>,
    type: 'push' | 'remove' = 'push'
  ) =>
    dispatch({
      type: 'SET_PENDING_SIDEBAR_DATA_KEYS',
      payload: { type, value }
    })

  const setTopbarComponent = (value: ReactNode | null) =>
    dispatch({ type: 'SET_TOP_BAR_COMPONENT', payload: value })

  const setOpportunityBoardComponent = (value: ReactNode | null) =>
    dispatch({ type: 'SET_OPPORTUNITY_BOARD_COMPONENT', payload: value })

  const setNavbarComponent = (value: ReactNode | null) =>
    dispatch({ type: 'SET_NAV_BAR_COMPONENT', payload: value })

  const setNotificationUnreadCount = (value: number) =>
    dispatch({ type: 'SET_NOTIFICATION_UNREAD_COUNT', payload: value })

  const setSidebarCountData = (value: number, key: SidebarCountKeys) =>
    dispatch({ type: 'SET_SIDEBAR_COUNT_DATA', payload: { value, key } })

  const setRefetchNotificationStats = (value: boolean) =>
    dispatch({ type: 'REFETCH_NOTIFICATION_STATS', payload: value })

  const setInboxThreadUpdate = (value: boolean) =>
    dispatch({ type: 'SET_INBOX_UNREAD_UPDATE', payload: value })

  const setAssignmentRefetchFunction = (fn: () => void) => {
    dispatch({ type: 'SET_ASSIGNMENT_REFETCH_FUNCTION', payload: fn })
  }
  const setRefetchBoolean = (value: boolean) => {
    dispatch({ type: 'SET_REFETCH_BOOLEAN', payload: value })
  }

  const setStreamChat = (value: any) => {
    dispatch({ type: 'SET_STREAM_CHAT', payload: value })
  }
  const setGrammarlySuggestionsCount = (value: number) =>
    dispatch({ type: 'SET_GRAMMARLY_SUGGESTIONS_COUNT', payload: value })

  const setViewport = (value: string) => {
    dispatch({ type: 'SET_VIEWPORT', payload: value })
  }
  const setIsPepperEditor = (value: boolean) => {
    dispatch({ type: 'SET_IS_PEPPER_EDITOR', payload: value })
  }
  const setIsPepperDocEditable = (value: boolean) => {
    dispatch({ type: 'SET_IS_PEPPER_DOC_EDITABLE', payload: value })
  }
  const setDocErrorUpdate = (value: boolean) => {
    dispatch({ type: 'SET_DOC_ERROR_UPDATE', payload: value })
  }
  const setItemDetails = (
    value: { title: string; code: number; is_renamed: boolean } | null
  ) => {
    dispatch({ type: 'SET_ITEM_DETAILS', payload: value })
  }
  const setEditorUpdateStatus = (value: string) => {
    dispatch({ type: 'SET_EDITOR_UPDATE_STATUS', payload: value })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        toggleTourStatus,
        changeTourState,
        setPendingSidebarCountKeys,
        setTopbarComponent,
        setOpportunityBoardComponent,
        setNavbarComponent,
        setNotificationUnreadCount,
        setSidebarCountData,
        setRefetchNotificationStats,
        setInboxThreadUpdate,
        setAssignmentRefetchFunction,
        setStreamChat,
        setRefetchBoolean,
        setGrammarlySuggestionsCount,
        setViewport,
        setIsPepperEditor,
        setIsPepperDocEditable,
        setDocErrorUpdate,
        setItemDetails,
        setEditorUpdateStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// hooks for accessing context
const useGlobalState = (): TourContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

export { GlobalStateProvider, useGlobalState }
