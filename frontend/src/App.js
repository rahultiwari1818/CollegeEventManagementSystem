import Footer from "./components/Footer";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <Navbar/>
      <Main/>
      <Footer/>
      <ToastContainer />
    </>
  );
}

export default App;
