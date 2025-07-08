import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { useCookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { cilLockLocked, cilUser } from '@coreui/icons'

import { API_URLS } from 'src/config/Constants'
import { showWarningMsg, showErrorMsg } from 'src/config/common'

const Login = () => {
  const navigate = useNavigate()
  const [, setCookie] = useCookies()
  const [curUserId, setCurUserId] = useState('')
  const [curPassword, setCurPassword] = useState('')

  const handleLogin = async () => {
    if (curUserId.length === 0 || curPassword.length === 0) {
      showWarningMsg('Please enter both username and password')
    } else {
      const response = await axios.post(API_URLS.LOGIN, {
        userId: curUserId,
        password: curPassword,
      })

      if (response.data.success) {
        navigate(`/quiz/list`)

        localStorage.setItem('token', response.data.token)

        setCookie('notification', 0)
        setCookie('notificationdata', [])
      } else {
        showErrorMsg(response.data.message)
      }
    }
  }

  return (
    <div className="auth-back bakground-no-repeat background-size-cover bg-body-tertiary h-100 min-vh-100 d-flex flex-row align-items-center justify-content-center">
      <CCard className="h-50">
        <CRow className="h-100 justify-content-center">
          <CCardGroup>
            <CCard className="p-4">
              <CCardBody className="d-flex justify-content-center align-items-center">
                <CForm className="w-100">
                  <h1 className="mb-3">Log in to your Account</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="User Id"
                      autoComplete="User Id"
                      onChange={(e) => setCurUserId(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      onChange={(e) => setCurPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CCol className="w-100 mt-4">
                    <CButton className="w-100 px-4 dark-blue" onClick={handleLogin}>
                      Login
                    </CButton>
                  </CCol>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CRow>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </CCard>
    </div>
  )
}

export default Login
