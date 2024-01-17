import axios from "axios";


export function formatMongoDate(mongoDate) {
    // Assuming mongoDate is a valid MongoDB Date object or a string representation of a date
    const dateObject = new Date(mongoDate);
    
    // Format the date to "dd/mm/yyyy"
    const formattedDate = dateObject.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  
    return formattedDate;
}


export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const checkIsLoggedIn = () => {
	const API_URL = process.env.REACT_APP_BASE_URL;
	const token = localStorage.getItem("token");
  
	return axios.post(`${API_URL}/api/auth/checkIsLoggedIn`, "xyz", {
	  headers: {
		"auth-token": token,
	  }
	})
	.then(response => {
	  return {
		isLoggedIn: true,
		data: response.data
	  };
	})
	.catch(error => {
	  return {
		isLoggedIn: false,
		data: {}
	  };
	});
  };








