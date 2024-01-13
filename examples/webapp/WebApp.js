// For running this example, please create an app in your Netamo developer account, and define
// the following constants.
// const CLIENT_ID = '...';
// const CLIENT_SECRET = '...';

const APP_TITLE = 'Netatmo Web App example';

// ********************************************************************************
// Main function

let netatmoService_ = null;

function getNetatmoService() {
  if (!netatmoService_) {
    netatmoService_ = NetatmoLib.createService({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: 'read_magellan write_magellan'
    });
  }
  return netatmoService_;
}

function oauth2Page(service, isAuthCallback) {
  let template = HtmlService.createTemplateFromFile('OAuth2Page');
  template.service = service;
  template.callbackRedirectUrl = isAuthCallback ? PropertiesService.getUserProperties().getProperty('serviceUrl') : null;
  return template.evaluate();
}

function explorerPage(e) {
  let template = HtmlService.createTemplateFromFile('ExplorerPage');
  template.data = getExplorerData(e.parameter.home_id);
  return template.evaluate();
}

// Entry point of the Web app.
function doGet(e) {
  let service = getNetatmoService();
  if (service.oauth.hasAccess()) {
    return explorerPage(e);
  } else {
    PropertiesService.getUserProperties().setProperty('serviceUrl', ScriptApp.getService().getUrl());
    return oauth2Page(service, false);
  }
}

// Entry point for the completion of the OAuth2 workflow.
function authCallback(request) {
  let service = getNetatmoService();
  service.oauth.handleCallback(request);
  return oauth2Page(service, true)
}
