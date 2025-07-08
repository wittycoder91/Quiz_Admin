import React from 'react'
import {
  CAvatar,
  CCol,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { useCookies } from 'react-cookie'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { cilLockLocked } from '@coreui/icons'

import avatar from './../../assets/images/avatars/avatar.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [cookies, , removeCookie] = useCookies()

  const handleLogout = () => {
    localStorage.clear()
    Object.keys(cookies).forEach((cookieName) => removeCookie(cookieName))

    navigate('/login')
  }

  return (
    <CCol className="d-flex">
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={avatar} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
          <CDropdownDivider />
          <CDropdownItem href="#/login" onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Log out
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </CCol>
  )
}

export default AppHeaderDropdown
