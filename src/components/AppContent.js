import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CSpinner, CCol } from '@coreui/react'

// routes config
import routes from '../routes'

const AppContent = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true })
    }
  }, [navigate]) // Ensure the useEffect runs only once when the component mounts

  return (
    <CCol className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="*" element={<Navigate to="/quiz/list" replace />} />
        </Routes>
      </Suspense>
    </CCol>
  )
}

export default React.memo(AppContent)
