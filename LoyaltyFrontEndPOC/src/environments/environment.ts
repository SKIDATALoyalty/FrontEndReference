// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiKey: 'gtkh01rtXwaQjLX2SZdZtHDoxM7IMm63g00BH3Hj',
  portalId: 31,
  redirectUrl: window.location.href + '&response_type=token',
  getUrl: 'https://apidev.skidataus.com/44/auth/v1/url',
  clientId: '7qdnkn70qn5apo3aish8b2aqn3'
};
