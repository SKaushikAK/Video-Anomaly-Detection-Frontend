import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ssnLogo from './assets/ssn.png';
import backgroundImage from './assets/6912037.jpg';
import headerImage from './assets/header1.png';
import Home from './components/Home';
import History from './components/History';
import Graphs from './components/Graphs';

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat'
  },

  overlay: {
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
    minHeight: '100vh'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 3rem',
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'white',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundImage: `url(${headerImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '50px' // Adjust this value based on your header image's aspect ratio
  },
  
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },

  logo: {
    height: '40px',
    width: 'auto'
  },

  headerRight: {
    display: 'flex',
    gap: '1rem'
  },

  headerButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      transform: 'translateY(-2px)'
    }
  }
};

function App() {
  return (
    <Router>
      <div style={styles.body}>
        <div style={styles.overlay}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <img src={ssnLogo} alt="SSN Logo" style={styles.logo} />
      </div>
            <div style={styles.headerRight}>
              <Link to="/" style={styles.headerButton}>Home</Link>
              <Link to="/history" style={styles.headerButton}>History</Link>
              <Link to="/graphs" style={styles.headerButton}>Graphs</Link>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/graphs" element={<Graphs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
