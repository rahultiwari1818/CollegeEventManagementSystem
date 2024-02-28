

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

export const debounce = (func, delay) => {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
};

export function throttle(func, delay) {
    let lastCall = 0;
    let timeoutId;

    return function (...args) {
        const now = new Date().getTime();
        const timeSinceLastCall = now - lastCall;

        if (!lastCall || timeSinceLastCall >= delay) {
            func(...args);
            lastCall = now;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
                lastCall = now;
            }, delay - timeSinceLastCall);
        }
    };
}


export const handleNumericInput = (event) => {
	// Allow backspace, delete, and arrow keys
	if (event.key === "Backspace" || event.key === "Delete" || event.key.includes("Arrow")) {
		return;
	}

	// Allow numbers (0-9)
	if (/[0-9]/.test(event.key)) {
		return;
	}

	// Prevent default behavior for all other key presses
	event.preventDefault();
};


export const validatePhno = (phno) => {
	return phno?.length === 10 ? true : false;
}

export function isValidName(name) {
	// Regular expression for validating names (alphabets and spaces only)
	const nameRegex = /^[a-zA-Z\s]+$/;

	// Test the name against the regular expression
	return nameRegex.test(name);
}

export function isValidPassword(password){
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d !@#$%^&*()_+]{8,}$/;
	return regex.test(password);

}

export function transformCourseData(coursesData,requiresAll) {
	const arr = [];
	if(requiresAll){
		arr.push({ name: "All" });
	}
	for (let course of coursesData) {
		arr.push({ name: course.courseName });
	}
	return arr;
}

export function transformEventTypesData(eventTypes) {
	const arr = [];
	
	for (let eventtype of eventTypes) {
		arr.push({ name: eventtype.eventTypeName,
		eventTypeLogoPath:eventtype.eventTypeLogoPath
		});
	}
	return arr;
}





