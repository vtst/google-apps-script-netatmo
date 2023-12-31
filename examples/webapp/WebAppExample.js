// For running this example, please create an app in your Netamo developer account, and define
// the following constants.
// const CLIENT_ID = '...';
// const CLIENT_SECRET = '...';

// ********************************************************************************
// Utility function

function include(file) {
  let template = HtmlService.createTemplateFromFile(file);
  return template.evaluate().getContent();
}

// ********************************************************************************
// Main function

function getNetatmoService() {
  return NetatmoLib.createService({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'read_magellan'
  });
}

function handleRequest(service, isAuthCallback) {
  let template = HtmlService.createTemplateFromFile('MainPage');
  template.service = service;
  template.callbackRedirectUrl = isAuthCallback ? PropertiesService.getUserProperties().getProperty('serviceUrl') : null;
  return template.evaluate();
}

// Entry point of the Web app.
function doGet(e) {
  let service = getNetatmoService();
  if (!service.oauth.hasAccess()) {
    PropertiesService.getUserProperties().setProperty('serviceUrl', ScriptApp.getService().getUrl());
  }
  return handleRequest(service, false);
}

// Entry point for the completion of the OAuth2 workflow.
function authCallback(request) {
  let service = getNetatmoService();
  service.oauth.handleCallback(request);
  return handleRequest(service, true)
}

// ********************************************************************************
// UI functions

function logout() {
  var service = getNetatmoService();
  service.oauth.reset();
}
