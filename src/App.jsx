import 'bootstrap/dist/css/bootstrap.min.css'
import '../src/css/themify-icons.css'
import '../src/css/flaticon_medically.css'
import '../src/css/font-awesome.min.css'
import './sass/style.scss'
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AllRoute from './main-component/router';
import { ToastContainer } from 'react-toastify';
import NewsletterPopup from './components/Newsletter/NewsletterPopup';
import { useEffect } from 'react';
import { uruchomPomiary } from './lib/analityka';
import { czyZgoda, nasluchujZgod } from './lib/zgody';

// Paleta DGC dla wszystkich kontrolek MUI (formularze, przyciski, selecty).
const dgcTheme = createTheme({
  palette: {
    primary: { main: '#0D4444', contrastText: '#FDFCFC' },
    secondary: { main: '#0D4444', contrastText: '#FDFCFC' },
    error: { main: '#B50B50' },
    text: { primary: '#0D4444', secondary: 'rgba(13, 68, 68, 0.65)' },
    background: { default: '#FDFCFC', paper: '#FDFCFC' },
    divider: 'rgba(13, 68, 68, 0.18)',
  },
  typography: { fontFamily: '"Schibsted Grotesk", system-ui, sans-serif' },
});

function App({ sciezka }) {
  // Pomiary startuja dopiero po zgodzie i tylko jesli sa wlaczone
  // w src/lib/analityka.js. Nasluch jest potrzebny, bo uzytkownik moze
  // wyrazic zgode juz po zaladowaniu strony — wtedy skrypty maja ruszyc
  // bez przeladowania. Powtorne wywolanie jest bezpieczne, loader pilnuje,
  // zeby nie dodac tego samego skryptu dwa razy.
  useEffect(() => {
    uruchomPomiary(czyZgoda);
    return nasluchujZgod(() => uruchomPomiary(czyZgoda));
  }, []);

  return (
    <ThemeProvider theme={dgcTheme}>
      <div className="App" id="scrool">
        <AllRoute sciezka={sciezka} />
        <NewsletterPopup />
        <ToastContainer />
      </div>
    </ThemeProvider>
  )
}

export default App
