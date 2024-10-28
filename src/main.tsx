import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/App.scss'
import './styles/font.scss'
import './styles/form.scss'
import './styles/infos.scss'
import './styles/table.scss'
import './styles/material-icons.scss'
import './styles/funnel.scss'
import './styles/profile.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
