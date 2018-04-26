// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiKey: localStorage.getItem('api_key') || 'gtkh01rtXwaQjLX2SZdZtHDoxM7IMm63g00BH3Hj',
  portalId: localStorage.getItem('portal_id') || 31, // 31 is default
  redirectUrl: localStorage.getItem('redirect_url') || 'http://localhost:4200/login',
  responseType: '&response_type=token',
  getUrl: localStorage.getItem('api_url') || 'https://apidev.skidataus.com/56/auth/v1/url',
  clientId: localStorage.getItem('client_id') || '25q6j2av3n48e7vgpfmm7qn46t',
  apidocs: localStorage.getItem('portal_api_docs_url') || 'https://b2edev.skidataus.com/DesktopModules/'
};
