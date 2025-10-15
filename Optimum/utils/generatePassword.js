// utils/generatePassword.js
export const generatePassword = (name, employeeId) => {
  // Take first 2 letters of name + last 3 of employee ID + special symbol
  const initials = name.slice(0, 2).toUpperCase();
  const idPart = employeeId.slice(-3); // last 3 chars
  const symbol = "@"; // fixed symbol
  const password = `${initials}${idPart}${symbol}optimum`; // e.g., KA013@123
  return password;
};
