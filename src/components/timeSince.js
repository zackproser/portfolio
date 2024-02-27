export function timeElapsedSinceJanuary2023() {
  const startDate = new Date("2023-01-01"); // Starting point: January 1, 
  2023
  const currentDate = new Date(); // Today's date                         

  // Difference in milliseconds between the current date and January 1,   
  2023
  const diffInMilliseconds = currentDate - startDate;

  // Convert milliseconds to years (1 year = 31536000000 milliseconds)    
  const years = diffInMilliseconds / 31536000000;

  // Convert milliseconds to months (1 month = 2628000000 milliseconds, approx 
  const months = diffInMilliseconds / 2628000000;

  // Round years and months to the nearest tenth                          
  const roundedYears = Math.round(years * 10) / 10;
  const roundedMonths = Math.round(months * 10) / 10;

  return `${roundedMonths} months        
  (${roundedYears} years)`;
}                                          
