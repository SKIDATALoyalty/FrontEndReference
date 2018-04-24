export const environment = {
  production: true,
  apiKey: localStorage.getItem('api_key') || 'gtkh01rtXwaQjLX2SZdZtHDoxM7IMm63g00BH3Hj',
  portalId: localStorage.getItem('portal_id') || 31, // 31 is default
  redirectUrl: localStorage.getItem('redirect_url') || 'http://localhost:3000/login',
  responseType: '&response_type=token',
  getUrl: localStorage.getItem('api_url') || 'https://apidev.skidataus.com/31/auth/v1/url',
  clientId: localStorage.getItem('client_id') || 'e43fmc9p2iv1q6k64cejidqnj',
  apidocs: localStorage.getItem('portal_api_docs_url') || 'https://redskinsdev.skidataus.com/DesktopModules/'
};
