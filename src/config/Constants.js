export const API_URLS = {
  LOGIN: `${process.env.REACT_APP_API_URL}/auth/admin/login`,
  // Quiz
  GETQUIZ: `${process.env.REACT_APP_API_URL}/quiz/admin/get-quizzes`,
  ADDQUIZ: `${process.env.REACT_APP_API_URL}/quiz/admin/add-quiz`,
  EDITQUIZ: `${process.env.REACT_APP_API_URL}/quiz/admin/edit-quiz`,
  REMOVEQUIZ: `${process.env.REACT_APP_API_URL}/quiz/admin/remove-quiz`,
  // Settings
  GETSETTINGS: `${process.env.REACT_APP_API_URL}/settings/admin/get-settings`,
  UPDATESETTINGS: `${process.env.REACT_APP_API_URL}/settings/admin/update-settings`,
  UPDATELOGOSIZE: `${process.env.REACT_APP_API_URL}/settings/admin/update-logo-size`,
  UPLOADLOGO: `${process.env.REACT_APP_API_URL}/settings/admin/upload-logo`,
  GETLOGO: `${process.env.REACT_APP_API_URL}/settings/admin/get-logo`,
  UPLOADBACKGROUND: `${process.env.REACT_APP_API_URL}/settings/admin/upload-background`,
  GETBACKGROUND: `${process.env.REACT_APP_API_URL}/settings/admin/get-background`,
}
