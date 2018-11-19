// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  apiKey: localStorage.getItem('api_key') || 'gtkh01rtXwaQjLX2SZdZtHDoxM7IMm63g00BH3Hj',
  portalId: localStorage.getItem('portal_id') || 83,
  redirectUrl: localStorage.getItem('redirect_url') || 'https://frontend-reference.skidataus.com/login',
  responseType: '&response_type=token',
  apiUrl: localStorage.getItem('api_url') || 'https://id.skidataus.com/oauth2/login/',
  clientId: localStorage.getItem('client_id') || 'cf734321fe47be03d609',
  apidocs: localStorage.getItem('portal_api_docs_url') || 'https://developer.skidataus.com/DesktopModules/',
  AUTHORIZE_MERCHANT_NAME: '9T2Nqc38WrQ9',
  AUTHORIZE_TRANSACTION_KEY: '24CZj84ZgB6g3pd7'
};