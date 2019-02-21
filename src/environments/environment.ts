export const environment = {
  production: false,
  apiKey: localStorage.getItem('api_key') || '',
  portalId: localStorage.getItem('portal_id') || 0,
  redirectUrl: localStorage.getItem('redirect_url') || 'http://localhost:4200/login',
  responseType: '&response_type=token',
  apiUrl: localStorage.getItem('api_url') || '',
  clientId: localStorage.getItem('client_id') || '',
  apidocs: localStorage.getItem('portal_api_docs_url') || '',
  apiBase: ''
};
