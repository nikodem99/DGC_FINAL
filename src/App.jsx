import 'bootstrap/dist/css/bootstrap.min.css'
import '../src/css/themify-icons.css'
import '../src/css/flaticon_medically.css'
import '../src/css/font-awesome.min.css'
import './sass/style.scss'
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AllRoute from './main-component/router';
import { ToastContainer } from 'react-toastify';

// Paleta DGC dla wszystkich kontrolek MUI (formularze, przyciski, selecty).
const dgcTheme = createTheme({
  palette: {
    primary: { main: '#127887', contrastText: '#FDFCFC' },
    secondary: { main: '#0D4444', contrastText: '#FDFCFC' },
    error: { main: '#B50B50' },
    text: { primary: '#0D4444', secondary: 'rgba(13, 68, 68, 0.65)' },
    background: { default: '#FDFCFC', paper: '#FDFCFC' },
    divider: 'rgba(13, 68, 68, 0.18)',
  },
  typography: { fontFamily: '"Poppins", sans-serif' },
});

function App() {
  return (
    <ThemeProvider theme={dgcTheme}>
      <div className="App" id="scrool">
        <AllRoute />
        <ToastContainer />
      </div>
    </ThemeProvider>
  )
}

export default App
