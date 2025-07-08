import React from 'react'

// Settings

// Quiz Management
const QuizList = React.lazy(() => import('./views/quiz/QuizList'))
const Settings = React.lazy(() => import('./views/quiz/Settings'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/quiz', name: 'Quiz Management', element: QuizList, exact: true },
  { path: '/quiz/list', name: 'Quiz List', element: QuizList },
  { path: '/quiz/settings', name: 'Settings', element: Settings },
]

export default routes
