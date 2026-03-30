const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const PROFILE_BASE = import.meta.env.VITE_PROFILE_URL || `${API_BASE}/api/profile`;
const ADMIN_BASE = import.meta.env.VITE_ADMIN_URL || `${API_BASE}/api/admin`;
const LOCATION_BASE = import.meta.env.VITE_LOCATION_URL || `${API_BASE}/api/location`;
const SOS_BASE = import.meta.env.VITE_SOS_URL || `${API_BASE}/api/sos`;
const EMERGENCY_CONTACTS_BASE = import.meta.env.VITE_EMERGENCY_CONTACTS_URL || `${API_BASE}/api/emergency-contacts`;

export const Config = {
  baseUrl: API_BASE,
  ADMIN_BASE_URL: ADMIN_BASE,
  SignUPUrl: import.meta.env.VITE_SIGNUP_URL || `${API_BASE}/api/user/signup`,
  LOGINUrl: import.meta.env.VITE_LOGIN_URL || `${API_BASE}/api/user/login`,
  GoogleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "625838618659-m8m6668p4rc0o525oe33erlmbbrboba1.apps.googleusercontent.com",
  GoogleSignUpUrl: import.meta.env.VITE_GOOGLELOGIN_URL || `${API_BASE}/api/user/googleLogin`,
  LogoutUrl: import.meta.env.VITE_LOGOUT_URL || `${API_BASE}/api/user/logout`,
  ContactUrl: import.meta.env.VITE_ADDCONTACT_URL || `${API_BASE}/api/contacts/addcontact`,
  GETDATAUrl: import.meta.env.VITE_GETDATA_URL || `${API_BASE}/api/user/get-data`,
  CHECKAuthUrl: import.meta.env.VITE_CHECKAUTH_URL || `${API_BASE}/api/user/auth-check`,
  DELETECONTACTUrl: import.meta.env.VITE_DELETECONTACT_URL || `${API_BASE}/api/contacts/delete-contact`,
  EMERGENCYUrl: import.meta.env.VITE_EMERGENCY_URL || `${API_BASE}/api/contacts/emergency`,
  ADDREVIEWUrl: import.meta.env.VITE_ADDREVIEW_URL || `${API_BASE}/api/reviews/addreview`,
  GETREVIEWSUrl: import.meta.env.VITE_GETREVIEWS_URL || import.meta.env.VITE_GETALLREVIEWS_URL || `${API_BASE}/api/reviews/allreviews`,
  ADDPROFILEPHOTO: import.meta.env.VITE_ADDPROFILEPHOTO_URL || `${PROFILE_BASE}/add-photo`,
  UPDATEUSERNAME: import.meta.env.VITE_UPDATEUSERNAME_URL || `${PROFILE_BASE}/update-name`,
  UPDATEEMAIL: import.meta.env.VITE_UPDATEEMAIL_URL || `${PROFILE_BASE}/update-email`,
  UPDATEPASSWORD: import.meta.env.VITE_UPDATEPASSWORD_URL || `${PROFILE_BASE}/update-password`,
  ADMIN_PROFILE_URL: import.meta.env.VITE_ADMIN_PROFILE_URL || `${ADMIN_BASE}/profile`,
  ADMIN_CONTACT_SUBMISSIONS_URL: import.meta.env.VITE_ADMIN_CONTACT_SUBMISSIONS_URL || `${ADMIN_BASE}/contact-submissions`,
  CONTACT_US_SUBMIT_URL: import.meta.env.VITE_CONTACT_US_SUBMIT_URL || `${API_BASE}/api/contact-us`,
  AI_CHAT_URL: import.meta.env.VITE_AI_CHAT_URL || `${API_BASE}/api/ai/chat`,
  AI_ANALYTICS_URL: import.meta.env.VITE_AI_ANALYTICS_URL || `${API_BASE}/api/ai/analytics`,
  LOCATION_SHARE_URL: import.meta.env.VITE_LOCATION_SHARE_URL || `${LOCATION_BASE}/share`,
  LOCATION_STOP_SHARING_URL: import.meta.env.VITE_LOCATION_STOP_SHARING_URL || `${LOCATION_BASE}/stop-sharing`,
  LOCATION_EMERGENCY_CONTACTS_URL: import.meta.env.VITE_LOCATION_EMERGENCY_CONTACTS_URL || `${LOCATION_BASE}/emergency-contacts`,
  SOS_SEND_URL: import.meta.env.VITE_SOS_SEND_URL || `${SOS_BASE}/send`,
  EMERGENCY_CONTACTS_URL: EMERGENCY_CONTACTS_BASE,
  GOOGLE_MAPS_KEY: import.meta.env.VITE_GOOGLE_MAPS_KEY || ""
}