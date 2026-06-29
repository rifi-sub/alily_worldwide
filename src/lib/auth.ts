export const getAdminToken = () => localStorage.getItem('worldwide_admin_token');
export const setAdminToken = (t: string) => localStorage.setItem('worldwide_admin_token', t);
export const removeAdminToken = () => localStorage.removeItem('worldwide_admin_token');
