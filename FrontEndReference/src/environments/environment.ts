// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiKey: localStorage.getItem('api_key') || 'gtkh01rtXwaQjLX2SZdZtHDoxM7IMm63g00BH3Hj',
  portalId: localStorage.getItem('portal_id') || 83, // 31 is default
  redirectUrl: localStorage.getItem('redirect_url') || 'http://localhost:4200/login',
  responseType: '&response_type=token',
  apiUrl: localStorage.getItem('api_url') || 'https://iddev.skidataus.com/oauth2/login/',
  clientId: localStorage.getItem('client_id') || 'fn28073h283fg2378f2g3',
  apidocs: localStorage.getItem('portal_api_docs_url') || 'https://developerdev.skidataus.com/DesktopModules/'
};
