// CRA only exposes env vars prefixed with REACT_APP_ to the browser.
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';
