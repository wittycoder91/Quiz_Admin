import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilList, cilSettings } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Quiz Management',
  },
  {
    component: CNavItem,
    name: 'Quiz List',
    to: '/quiz/list',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/quiz/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
