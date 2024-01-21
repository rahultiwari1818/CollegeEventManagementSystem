import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Router from "./components/Router";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {


	return (
		<BrowserRouter>
			<Navbar />
			<main className="max-h-[82vh] lg:max-h-[77vh] overflow-auto">
					<Router />
			</main>
			<Footer />
			<ToastContainer />
		</BrowserRouter>

	);
}

export default App;
