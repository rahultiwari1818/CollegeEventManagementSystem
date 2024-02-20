import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Router from "./router/Router";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {


	return (
		<BrowserRouter>
			<Navbar />
			<main className="max-h-[82vh] lg:max-h-[77vh] xl:max-h-[83vh] overflow-auto">
					<Router />
			</main>
			<Footer />
			<ToastContainer />
		</BrowserRouter>

	);
}

export default App;
