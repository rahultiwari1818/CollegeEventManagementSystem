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

