import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (

    <BrowserRouter>
      <Navbar />
      <Main />
      <Footer />
      <ToastContainer />
    </BrowserRouter>

  );
}

export default App;
