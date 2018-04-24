// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiKey: localStorage.getItem('api_key') || 'gtkh01rtXwaQjLX2SZdZtHDoxM7IMm63g00BH3Hj',
  portalId: localStorage.getItem('portal_id') || 31, // 31 is default
  redirectUrl: localStorage.getItem('redirect_url') || 'http://localhost:3000/login',
  responseType: '&response_type=token',
  getUrl: localStorage.getItem('api_url') || 'https://apidev.skidataus.com/31/auth/v1/url',
  clientId: localStorage.getItem('client_id') || 'e43fmc9p2iv1q6k64cejidqnj',
  apidocs: localStorage.getItem('portal_api_docs_url') || 'https://redskinsdev.skidataus.com/DesktopModules/'
};
