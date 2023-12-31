// For running this example, please create an app in your Netamo developer account, and define
// the following constants.
// const CLIENT_ID = '...';
// const CLIENT_SECRET = '...';

function getNetatmoService() {
  return NetatmoLib.createService({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'read_magellan'
  });
}

function testNetatmoApi() {
  let service = getNetatmoService();
  if (service.oauth.hasAccess()) {
    let response = service.endpoints.homesData();
    Logger.log(JSON.stringify(response, null, 2));
  } else {
    Logger.log('Please follow this link to authorize the Netatmo API:\n' + service.getAuthorizationUrl());
  }
}

// This is the OAuth2 callback function, which is called at the end of the OAuth2 workflow.
function authCallback(request) {
  let service = getNetatmoService();
  let isAuthorized = service.oauth.handleCallback(request);
  return HtmlService.createHtmlOutput((isAuthorized ? 'Success!' : 'Denied.') + ' You can close this tab.');
}

function reset() {
  let service = getNetatmoService();
  service.oauth.reset();
}

function logRedirectUri() {
  var service = NetatmoLib.createService({client_id: '', client_secret: '', scope: ''});
  Logger.log(service.oauth.getRedirectUri());
}
