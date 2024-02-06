

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

export const handleKeyDown = (event) => {
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








