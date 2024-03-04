import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Router from "./router/Router";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onMessageListener, requestFirebaseNotificationPermission } from './firebase-init'
import { useEffect } from "react";
import {messaging} from "./firebase-init";
import { getToken } from "@firebase/messaging";
import { useSelector } from "react-redux";
import axios from "axios";
function App() {

	const userData = useSelector((state)=>state.UserSlice);

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

	useEffect(()=>{
		if(!userData._id || userData._id === undefined) return;

		// Notification.requestPermission().then((permission) => {
			// if (permission === 'granted') {
			//   getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY}).then((currentToken) => {
			// 	if (currentToken) {
			// 	  // Send the token to your server and update the UI if necessary

			// 		if(userData.token===undefined||userData.token===""){

			// 			const route = userData.role === "Student" ? "students" :"faculties";
						
			// 			axios.post(`${API_URL}/api/${route}/registerFireBaseToken`,{
			// 				token:currentToken,_id:userData._id
			// 			},
			// 			{
			// 				headers:{
			// 					"auth-token":token
			// 				}
			// 			})
			// 			.then((res)=>{
			// 				console.log(res);
			// 			})

			// 		}
		  
			// 	  // ...
			// 	} else {
			// 	  // Show permission request UI
			// 	  console.log('No registration token available. Request permission to generate one.');
			// 	  // ...
			// 	}
			//   }).catch((err) => {
			// 	console.log('An error occurred while retrieving token. ', err);
			// 	// ...
			//   });
			// }
			// });		

			// onMessageListener();


	},[userData])

	return (
		<BrowserRouter>
			<Navbar />
			<main className="max-h-[85vh] lg:max-h-[80vh] xl:max-h-[87vh] overflow-auto">
					<Router />
			</main>
			<Footer />
			<ToastContainer />
		</BrowserRouter>

	);
}

export default App;
