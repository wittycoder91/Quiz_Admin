import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CAlert,
  CSpinner,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilAperture, cilFont, cilImage, cilArrowThickFromBottom } from '@coreui/icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'src/assets/css/local-fonts.css'

import api from 'src/services'
import { API_URLS } from 'src/config/Constants'
import { showSuccessMsg, showWarningMsg, showErrorMsg } from 'src/config/common'

/**
 * Settings Component
 *
 * API Structure for UPDATESETTINGS:
 * {
 *   backgroundColor: string (hex color),
 *   textColor: string (hex color),
 *   fontFamily: string,
 *   logoWidth: string (number as string, 50-500),
 *   logoHeight: string (number as string, 20-300)
 * }
 *
 * API Structure for GETSETTINGS response:
 * {
 *   success: boolean,
 *   data: {
 *     backgroundColor: string,
 *     textColor: string,
 *     fontFamily: string,
 *     logoWidth: string,
 *     logoHeight: string
 *   }
 * }
 */
const Settings = () => {
  const [settings, setSettings] = useState({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'Postbook, sans-serif',
  })

  const [saving, setSaving] = useState(false)
  const [logoWidth, setLogoWidth] = useState(150)
  const [logoHeight, setLogoHeight] = useState(100)
  const [loading, setLoading] = useState(false)
  const [savingLogoSize, setSavingLogoSize] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' })

  // Logo upload states
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [currentLogo, setCurrentLogo] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  // Background image upload states
  const [backgroundFile, setBackgroundFile] = useState(null)
  const [backgroundPreview, setBackgroundPreview] = useState(null)
  const [currentBackground, setCurrentBackground] = useState(null)
  const [uploadingBackground, setUploadingBackground] = useState(false)

  const localFonts = [
    { value: 'Postbook, sans-serif', label: 'Postbook (Clean & Modern)' },
    { value: 'OpalOrbit, sans-serif', label: 'Opal Orbit (Light & Elegant)' },
    { value: 'SweetJoys, sans-serif', label: 'Sweet Joys (Playful & Fun)' },
    { value: 'RiskTaker, sans-serif', label: 'Risk Taker (Bold & Dynamic)' },
    { value: 'Howdybun, sans-serif', label: 'Howdybun (Friendly & Casual)' },
    { value: 'KindDaily, sans-serif', label: 'Kind Daily (Warm & Welcoming)' },
    { value: 'SuperGreatly, sans-serif', label: 'Super Greatly (Strong & Impactful)' },
    { value: 'BeachBall, sans-serif', label: 'Beach Ball (Fun & Relaxed)' },
  ]

  useEffect(() => {
    getSettings()
    getLogo()
    getBackground()
  }, [])

  const getSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get(API_URLS.GETSETTINGS)

      if (response.data.success && response.data.data) {
        const settingsData = response.data.data || {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'Postbook, sans-serif',
        }
        setSettings(settingsData)

        setLogoWidth(response.data.data?.logoWidth || 150)
        setLogoHeight(response.data.data?.logoHeight || 100)
      } else {
        showWarningMsg(response.data.message || 'Failed to load settings')
      }
    } catch (error) {
      console.error('Error loading settings:', error)

      setSettings({
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Postbook, sans-serif',
      })
      setLogoWidth(150)
      setLogoHeight(100)
    } finally {
      setLoading(false)
    }
  }

  const getLogo = async () => {
    try {
      const response = await api.get(API_URLS.GETLOGO)

      if (response.data.success) {
        const logoUrl = response.data.image || response.data.data?.image
        if (logoUrl) {
          // Use the upload URL to construct the full logo URL
          const fullLogoUrl = `${process.env.REACT_APP_UPLOAD_URL}${logoUrl}`
          setCurrentLogo(fullLogoUrl)
        }
      }
    } catch (error) {
      console.error('Error loading logo:', error)
      // Don't show error for logo loading as it's optional
    }
  }

  const getBackground = async () => {
    try {
      const response = await api.get(API_URLS.GETBACKGROUND)
      if (response.data.success) {
        const backgroundUrl = response.data.backgroundImage || response.data.data?.backgroundImage
        if (backgroundUrl) {
          const fullBackgroundUrl = `${process.env.REACT_APP_UPLOAD_URL}${backgroundUrl}`
          setCurrentBackground(fullBackgroundUrl)
        }
      }
    } catch (error) {
      console.error('Error loading background:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogoWidthChange = (e) => {
    setLogoWidth(parseInt(e.target.value) || 0)
  }

  const handleLogoHeightChange = (e) => {
    setLogoHeight(parseInt(e.target.value) || 0)
  }

  // Logo upload functions
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setAlert({
          show: true,
          message: 'Please select a valid image file',
          color: 'danger',
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlert({
          show: true,
          message: 'Image size should be less than 5MB',
          color: 'danger',
        })
        return
      }

      setLogoFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Background image upload functions
  const handleBackgroundChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setAlert({
          show: true,
          message: 'Please select a valid image file',
          color: 'danger',
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlert({
          show: true,
          message: 'Image size should be less than 5MB',
          color: 'danger',
        })
        return
      }

      setBackgroundFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setBackgroundPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = async () => {
    if (!logoFile) {
      setAlert({
        show: true,
        message: 'Please select a logo file to upload',
        color: 'danger',
      })
      return
    }

    try {
      setUploadingLogo(true)
      const formData = new FormData()
      formData.append('logo', logoFile)

      const response = await api.post(API_URLS.UPLOADLOGO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        showSuccessMsg('Logo uploaded successfully!')
        setLogoFile(null)
        setLogoPreview(null)
        setAlert({ show: false, message: '', color: 'success' })

        // Set the uploaded image as current logo with full upload URL
        const uploadedLogoUrl = `${process.env.REACT_APP_UPLOAD_URL}${response.data.image || response.data.data?.image}`
        setCurrentLogo(uploadedLogoUrl)
      } else {
        showWarningMsg(response.data.message || 'Failed to upload logo')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg('Failed to upload logo. Please try again.')
      }
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleBackgroundUpload = async () => {
    if (!backgroundFile) {
      setAlert({
        show: true,
        message: 'Please select a background image to upload',
        color: 'danger',
      })
      return
    }

    try {
      setUploadingBackground(true)
      const formData = new FormData()
      formData.append('background', backgroundFile)

      const response = await api.post(API_URLS.UPLOADBACKGROUND, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        showSuccessMsg('Background image uploaded successfully!')
        setBackgroundFile(null)
        setBackgroundPreview(null)
        setAlert({ show: false, message: '', color: 'success' })

        // Set the uploaded image as current background with full upload URL
        const uploadedBackgroundUrl = `${process.env.REACT_APP_UPLOAD_URL}${response.data.backgroundImage || response.data.data?.backgroundImage}`
        setCurrentBackground(uploadedBackgroundUrl)
      } else {
        showWarningMsg(response.data.message || 'Failed to upload background image')
      }
    } catch (error) {
      console.error('Error uploading background image:', error)
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg('Failed to upload background image. Please try again.')
      }
    } finally {
      setUploadingBackground(false)
    }
  }

  const validateForm = () => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

    if (!hexColorRegex.test(settings.backgroundColor)) {
      setAlert({
        show: true,
        message: 'Please enter a valid background color (hex format)',
        color: 'danger',
      })
      return false
    }

    if (!hexColorRegex.test(settings.textColor)) {
      setAlert({
        show: true,
        message: 'Please enter a valid text color (hex format)',
        color: 'danger',
      })
      return false
    }

    if (!settings.fontFamily.trim()) {
      setAlert({ show: true, message: 'Please select a font family', color: 'danger' })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('handleSubmit called')
    console.log('settings:', settings)

    if (!validateForm()) {
      console.log('Form validation failed')
      return
    }

    try {
      setSaving(true)
      console.log('Sending settings to API:', settings)
      const response = await api.post(API_URLS.UPDATESETTINGS, settings)

      if (response.data.success) {
        showSuccessMsg('Settings updated successfully!')
        setAlert({ show: false, message: '', color: 'success' })
      } else {
        showWarningMsg(response.data.message || 'Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg('Failed to update settings. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleLogoSizeSubmit = async (e) => {
    try {
      if (logoWidth <= 0 || logoHeight <= 0) {
        showErrorMsg('The Logo width or height should be bigger than 0')
        return
      }

      setSavingLogoSize(true)
      const logoSizeData = {
        logoWidth: logoWidth,
        logoHeight: logoHeight,
      }

      const response = await api.post(API_URLS.UPDATELOGOSIZE, logoSizeData)

      if (response.data.success) {
        showSuccessMsg('Logo size updated successfully!')
        setAlert({ show: false, message: '', color: 'success' })
      } else {
        showWarningMsg(response.data.message || 'Failed to update logo size')
      }
    } catch (error) {
      console.error('Error updating logo size:', error)
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg('Failed to update logo size. Please try again.')
      }
    } finally {
      setSavingLogoSize(false)
    }
  }

  const getPreviewStyle = () => ({
    backgroundColor: settings.backgroundColor,
    color: settings.textColor,
    fontFamily: settings.fontFamily || 'Postbook, sans-serif',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  })

  const getLogoStyle = () => ({
    width: `${logoWidth}px`,
    height: `${logoHeight}px`,
    maxWidth: '100%',
    objectFit: 'contain',
  })

  if (loading) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody className="text-center py-5">
              <CSpinner />
              <p className="mt-3 text-medium-emphasis">Loading settings...</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow className="align-items-center">
              <CCol>
                <h4 className="mb-0">Appearance Settings</h4>
                <p className="text-medium-emphasis">
                  Customize the background color, text color, and font of your application
                </p>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            {alert.show && (
              <CAlert
                color={alert.color}
                dismissible
                onClose={() => setAlert({ show: false, message: '', color: 'success' })}
              >
                {alert.message}
              </CAlert>
            )}

            <CForm onSubmit={handleSubmit}>
              <CRow>
                {/* Color Settings */}
                <CCol lg={6} className="mb-4">
                  <CCard className="h-100">
                    <CCardHeader>
                      <div className="d-flex align-items-center gap-2">
                        <CIcon icon={cilAperture} />
                        <h5 className="mb-0">Color Settings</h5>
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      <div className="mb-3">
                        <CFormLabel htmlFor="backgroundColor">Background Color</CFormLabel>
                        <div className="d-flex gap-2 align-items-center">
                          <CFormInput
                            id="backgroundColor"
                            name="backgroundColor"
                            type="color"
                            value={settings.backgroundColor}
                            onChange={handleInputChange}
                            className="w-auto"
                          />
                          <CFormInput
                            type="text"
                            value={settings.backgroundColor}
                            onChange={handleInputChange}
                            name="backgroundColor"
                            placeholder="#ffffff"
                            className="flex-grow-1"
                          />
                        </div>
                        <small className="text-medium-emphasis">
                          Choose the background color for your application
                        </small>
                      </div>

                      <div className="mb-3">
                        <CFormLabel htmlFor="textColor">Text Color</CFormLabel>
                        <div className="d-flex gap-2 align-items-center">
                          <CFormInput
                            id="textColor"
                            name="textColor"
                            type="color"
                            value={settings.textColor}
                            onChange={handleInputChange}
                            className="w-auto"
                          />
                          <CFormInput
                            type="text"
                            value={settings.textColor}
                            onChange={handleInputChange}
                            name="textColor"
                            placeholder="#000000"
                            className="flex-grow-1"
                          />
                        </div>
                        <small className="text-medium-emphasis">
                          Choose the text color for your application
                        </small>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Font Settings */}
                <CCol lg={6} className="mb-4">
                  <CCard className="h-100">
                    <CCardHeader>
                      <div className="d-flex align-items-center gap-2">
                        <CIcon icon={cilFont} />
                        <h5 className="mb-0">Font Settings</h5>
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      <div className="mb-3">
                        <CFormLabel htmlFor="fontFamily">Font Family</CFormLabel>
                        <CFormSelect
                          id="fontFamily"
                          name="fontFamily"
                          value={settings.fontFamily}
                          onChange={handleInputChange}
                        >
                          {localFonts.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </CFormSelect>
                        <small className="text-medium-emphasis">
                          Select the font family for your application text
                        </small>
                      </div>

                      <div className="mt-4">
                        <h6>Font Preview</h6>
                        <div
                          style={{
                            fontFamily: settings.fontFamily || 'Postbook, sans-serif',
                            padding: '15px',
                            border: '1px solid #dee2e6',
                            borderRadius: '6px',
                            backgroundColor: '#f8f9fa',
                          }}
                        >
                          <p className="mb-1">
                            <strong>Sample Text:</strong> The quick brown fox jumps over the lazy
                            dog.
                          </p>
                          <p className="mb-0 text-medium-emphasis">
                            This is how your selected font will appear in the application.
                          </p>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Live Preview */}
              <CCol xs={12} className="mb-4">
                <CCard>
                  <CCardHeader>
                    <h5 className="mb-0">Live Preview</h5>
                    <small className="text-medium-emphasis">
                      See how your settings will look in the application
                    </small>
                  </CCardHeader>
                  <CCardBody>
                    <div style={getPreviewStyle()}>
                      <h4 style={{ margin: 0, marginBottom: '10px' }}>
                        Welcome to Your Application
                      </h4>
                      <p style={{ margin: 0, opacity: 0.8 }}>
                        This is a preview of how your content will appear with the selected colors
                        and font.
                      </p>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Save Button */}
              <CCol xs={12} className="mb-4">
                <div className="d-flex justify-content-end">
                  <CButton
                    color="primary"
                    type="submit"
                    disabled={saving}
                    className="d-flex align-items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <CSpinner size="sm" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSave} />
                        Save Settings
                      </>
                    )}
                  </CButton>
                </div>
              </CCol>

              {/* Background Image Upload */}
              <CCol xs={12} className="mb-4">
                <CCard>
                  <CCardHeader>
                    <div className="d-flex align-items-center gap-2">
                      <CIcon icon={cilImage} />
                      <h5 className="mb-0">Background Image Settings</h5>
                    </div>
                    <small className="text-medium-emphasis">
                      Upload a new background image for your application
                    </small>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      {/* Current Background Display */}
                      <CCol lg={6} className="mb-4">
                        <h6>Current Background</h6>
                        <div className="border rounded p-3 text-center">
                          {currentBackground ? (
                            <CImage
                              src={currentBackground}
                              alt="Current Background"
                              className="img-fluid"
                              style={{ maxHeight: '150px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="text-medium-emphasis">
                              <CIcon icon={cilImage} size="xl" />
                              <p className="mt-2 mb-0">No background image uploaded yet</p>
                            </div>
                          )}
                        </div>
                      </CCol>

                      {/* Background Upload */}
                      <CCol lg={6} className="mb-4">
                        <h6>Upload New Background</h6>
                        <div className="mb-3">
                          <CFormLabel htmlFor="backgroundFile">Select Background File</CFormLabel>
                          <CFormInput
                            id="backgroundFile"
                            type="file"
                            accept="image/*"
                            onChange={handleBackgroundChange}
                            className="mb-2"
                          />
                          <small className="text-medium-emphasis">
                            Supported formats: JPG, PNG, GIF. Max size: 5MB
                          </small>
                        </div>

                        {/* Background Preview */}
                        {backgroundPreview && (
                          <div className="mb-3">
                            <h6>Preview</h6>
                            <div className="border rounded p-2 text-center">
                              <CImage
                                src={backgroundPreview}
                                alt="Background Preview"
                                className="img-fluid"
                                style={{ maxHeight: '150px', maxWidth: '100%' }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Upload Button */}
                        <CButton
                          color="success"
                          onClick={handleBackgroundUpload}
                          disabled={!backgroundFile || uploadingBackground}
                          className="d-flex align-items-center gap-2"
                        >
                          {uploadingBackground ? (
                            <>
                              <CSpinner size="sm" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilArrowThickFromBottom} />
                              Upload Background
                            </>
                          )}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Logo Upload */}
              <CCol xs={12} className="mb-4">
                <CCard>
                  <CCardHeader>
                    <div className="d-flex align-items-center gap-2">
                      <CIcon icon={cilImage} />
                      <h5 className="mb-0">Logo Settings</h5>
                    </div>
                    <small className="text-medium-emphasis">
                      Upload a new logo and customize its size for your application
                    </small>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      {/* Current Logo Display */}
                      <CCol lg={6} className="mb-4">
                        <h6>Current Logo</h6>
                        <div className="border rounded p-3 text-center">
                          {currentLogo ? (
                            <CImage
                              src={currentLogo}
                              alt="Current Logo"
                              className="img-fluid"
                              style={getLogoStyle()}
                            />
                          ) : (
                            <div className="text-medium-emphasis">
                              <CIcon icon={cilImage} size="xl" />
                              <p className="mt-2 mb-0">No logo uploaded yet</p>
                            </div>
                          )}
                        </div>
                      </CCol>

                      {/* Logo Upload */}
                      <CCol lg={6} className="mb-4">
                        <h6>Upload New Logo</h6>
                        <div className="mb-3">
                          <CFormLabel htmlFor="logoFile">Select Logo File</CFormLabel>
                          <CFormInput
                            id="logoFile"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="mb-2"
                          />
                          <small className="text-medium-emphasis">
                            Supported formats: JPG, PNG, GIF. Max size: 5MB
                          </small>
                        </div>

                        {/* Logo Preview */}
                        {logoPreview && (
                          <div className="mb-3">
                            <h6>Preview</h6>
                            <div className="border rounded p-2 text-center">
                              <CImage
                                src={logoPreview}
                                alt="Logo Preview"
                                className="img-fluid"
                                style={{ maxHeight: '100px', maxWidth: '100%' }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Upload Button */}
                        <CButton
                          color="success"
                          onClick={handleLogoUpload}
                          disabled={!logoFile || uploadingLogo}
                          className="d-flex align-items-center gap-2"
                        >
                          {uploadingLogo ? (
                            <>
                              <CSpinner size="sm" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilArrowThickFromBottom} />
                              Upload Logo
                            </>
                          )}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Logo Size Settings - Separate Section */}
      <CCol xs={12} className="mb-4">
        <CCard>
          <CCardHeader>
            <div className="d-flex align-items-center gap-2">
              <CIcon icon={cilImage} />
              <h5 className="mb-0">Logo Size Settings</h5>
            </div>
            <small className="text-medium-emphasis">
              Customize the width and height of your logo
            </small>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol lg={6} className="mb-3">
                <CFormLabel htmlFor="logoWidth">Logo Width (px)</CFormLabel>
                <CFormInput
                  id="logoWidth"
                  name="logoWidth"
                  type="number"
                  value={logoWidth}
                  onChange={handleLogoWidthChange}
                  min="50"
                  max="500"
                  placeholder="150"
                />
              </CCol>
              <CCol lg={6} className="mb-3">
                <CFormLabel htmlFor="logoHeight">Logo Height (px)</CFormLabel>
                <CFormInput
                  id="logoHeight"
                  name="logoHeight"
                  type="number"
                  value={logoHeight}
                  onChange={handleLogoHeightChange}
                  min="20"
                  max="300"
                  placeholder="100"
                />
              </CCol>
            </CRow>

            {/* Logo Size Save Button */}
            <div className="d-flex justify-content-end">
              <CButton
                color="primary"
                disabled={savingLogoSize}
                className="d-flex align-items-center gap-2"
                onClick={handleLogoSizeSubmit}
              >
                {savingLogoSize ? (
                  <>
                    <CSpinner size="sm" />
                    Saving Logo Size...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} />
                    Save Logo Size
                  </>
                )}
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

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
    </CRow>
  )
}

export default Settings
