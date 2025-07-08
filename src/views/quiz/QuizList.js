import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormCheck,
  CAlert,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilCheck, cilX } from '@coreui/icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import api from 'src/services'
import { API_URLS } from 'src/config/Constants'
import { showSuccessMsg, showWarningMsg, showErrorMsg } from 'src/config/common'

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null)
  const [deletingQuiz, setDeletingQuiz] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: false,
    questions: [
      { question: '' },
      { question: '' },
      { question: '' },
      { question: '' },
      { question: '' },
    ],
    answer: '',
  })
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' })
  const [loading, setLoading] = useState(false)

  // Load quizzes from API on component mount
  useEffect(() => {
    getQuizzes()
  }, [])

  const getQuizzes = async () => {
    try {
      setLoading(true)
      const response = await api.get(API_URLS.GETQUIZ)

      if (response.data.success) {
        setQuizzes(response.data.data || [])
      } else {
        showWarningMsg(response.data.message)
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleQuestionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      isActive: false,
      questions: [
        { question: '' },
        { question: '' },
        { question: '' },
        { question: '' },
        { question: '' },
      ],
      answer: '',
    })
    setEditingQuiz(null)
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setAlert({ show: true, message: 'Title is required!', color: 'danger' })
      return false
    }

    if (!formData.answer.trim()) {
      setAlert({ show: true, message: 'Correct answer is required!', color: 'danger' })
      return false
    }

    // Check if all 5 questions have content
    const validQuestions = formData.questions.filter((q) => q.question.trim())

    if (validQuestions.length < 5) {
      setAlert({
        show: true,
        message: `You must add exactly 5 question hints. Currently you have ${validQuestions.length}/5 hints.`,
        color: 'danger',
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const apiURL = editingQuiz ? API_URLS.EDITQUIZ : API_URLS.ADDQUIZ
      const payload = {
        title: formData.title,
        description: formData.description,
        isActive: formData.isActive,
        questions: formData.questions.filter((q) => q.question.trim()),
        answer: formData.answer.trim(),
        ...(editingQuiz && { selID: editingQuiz._id }),
      }

      const response = await api.post(apiURL, payload)

      if (response.data.success) {
        showSuccessMsg(response.data.message)
        setShowModal(false)
        resetForm()
        getQuizzes() // Refresh the list
      } else {
        showWarningMsg(response.data.message)
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg(error.message)
      }
    }
  }

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz)
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      isActive: quiz.isActive,
      questions:
        quiz.questions && quiz.questions.length > 0
          ? quiz.questions.map((q) => ({ question: q.question || '' }))
          : [
              { question: '' },
              { question: '' },
              { question: '' },
              { question: '' },
              { question: '' },
            ],
      answer: quiz.answer || '',
    })
    setShowModal(true)
  }

  const handleDeleteClick = (quiz) => {
    setDeletingQuiz(quiz)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await api.post(API_URLS.REMOVEQUIZ, {
        selID: deletingQuiz._id,
      })

      if (response.data.success) {
        showSuccessMsg(response.data.message)
        setShowDeleteModal(false)
        setDeletingQuiz(null)
        getQuizzes() // Refresh the list
      } else {
        showWarningMsg(response.data.message)
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg(error.message)
      }
    }
  }

  const handleToggleStatus = async (quizId) => {
    try {
      const quiz = quizzes.find((q) => q._id === quizId)
      const newStatus = !quiz.isActive

      const response = await api.post(API_URLS.EDITQUIZ, {
        selID: quizId,
        title: quiz.title,
        description: quiz.description || '',
        isActive: newStatus,
        questions: quiz.questions || [],
        answer: quiz.answer || '',
      })

      if (response.data.success) {
        showSuccessMsg(`Quiz ${newStatus ? 'activated' : 'deactivated'} successfully!`)
        getQuizzes() // Refresh the list
      } else {
        showWarningMsg(response.data.message)
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg(error.message)
      }
    }
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const getQuestionCount = (quiz) => {
    return quiz.questions ? quiz.questions.length : 0
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow className="align-items-center">
              <CCol>
                <h4 className="mb-0">Quiz Management</h4>
                <p className="text-medium-emphasis">
                  Create and manage your quizzes with questions
                </p>
              </CCol>
              <CCol xs="auto">
                <CButton
                  color="primary"
                  onClick={openCreateModal}
                  className="d-flex align-items-center gap-2"
                >
                  <CIcon icon={cilPlus} />
                  Create Quiz
                </CButton>
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

            {loading ? (
              <div className="text-center py-5">
                <p className="text-medium-emphasis">Loading quizzes...</p>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-medium-emphasis">No quizzes created yet.</p>
                <CButton color="primary" onClick={openCreateModal}>
                  Create Your First Quiz
                </CButton>
              </div>
            ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Title</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Questions</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Created</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {quizzes.map((quiz) => (
                    <CTableRow key={quiz._id}>
                      <CTableDataCell>
                        <strong>{quiz.title}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{quiz.description || 'No description'}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center gap-2">
                          <CBadge color={getQuestionCount(quiz) === 5 ? 'success' : 'warning'}>
                            {getQuestionCount(quiz)}/5 questions
                          </CBadge>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color={quiz.isActive ? 'success' : 'secondary'}
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(quiz._id)}
                          className="d-flex align-items-center gap-1"
                        >
                          <CIcon icon={quiz.isActive ? cilCheck : cilX} />
                          {quiz.isActive ? 'Active' : 'Inactive'}
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handleEdit(quiz)}
                            className="d-flex align-items-center gap-1"
                          >
                            <CIcon icon={cilPencil} />
                            Edit
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(quiz)}
                            className="d-flex align-items-center gap-1"
                          >
                            <CIcon icon={cilTrash} />
                            Delete
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Create/Edit Quiz Modal */}
      <CModal
        visible={showModal}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow>
              <CCol xs={12} className="mb-3">
                <CFormLabel htmlFor="title">Quiz Title *</CFormLabel>
                <CFormInput
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter quiz title"
                  required
                />
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel htmlFor="description">Quiz Description</CFormLabel>
                <CFormTextarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormCheck
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  label="Active Quiz"
                />
                <small className="text-medium-emphasis">Active quizzes can be taken by users</small>
              </CCol>
              <CCol xs={12}>
                <h5 className="mb-3">Question Hints (5 required)</h5>
                <div className="border rounded p-3">
                  {formData.questions.map((question, index) => (
                    <div key={index} className="mb-4 p-3 border rounded">
                      <h6 className="mb-2">Hint {index + 1} *</h6>
                      <div className="mb-3">
                        <CFormTextarea
                          id={`question-${index}`}
                          value={question.question}
                          onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                          placeholder={`Enter hint ${index + 1} to help users find the answer`}
                          rows={2}
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <CBadge
                      color={
                        formData.questions.filter((q) => q.question.trim()).length === 5
                          ? 'success'
                          : 'warning'
                      }
                    >
                      {formData.questions.filter((q) => q.question.trim()).length}/5 hints completed
                    </CBadge>
                  </div>
                </div>
              </CCol>
              <CCol xs={12} className="mt-3">
                <CFormLabel htmlFor="answer">Correct Answer *</CFormLabel>
                <CFormInput
                  id="answer"
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  placeholder="Enter the correct answer that all hints point to"
                  required
                />
                <small className="text-medium-emphasis">
                  This is the single correct answer that all 5 hints will help users find
                </small>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
            >
              Cancel
            </CButton>
            <CButton color="primary" type="submit">
              {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingQuiz(null)
        }}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Delete Quiz</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the quiz &ldquo;{deletingQuiz?.title}&rdquo;? This action
          cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setShowDeleteModal(false)
              setDeletingQuiz(null)
            }}
          >
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDeleteConfirm}>
            Delete Quiz
          </CButton>
        </CModalFooter>
      </CModal>

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

export default QuizList
