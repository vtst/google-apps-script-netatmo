// NetatmoLib: A Google Apps Script Library for the Netatmo API
// (c) Vincent Simonet, 2023
// See the documentation of the Netatmo API : https://dev.netatmo.com/apidocumentation/
// This library is using OAuth2 library (https://github.com/googleworkspace/apps-script-oauth2)

const AUTHORIZATION_BASE_URL = 'https://api.netatmo.com/oauth2/authorize';
const TOKEN_URL = 'https://api.netatmo.com/oauth2/token';
const BASE_API_URL = 'https://api.netatmo.com/api';

// ********************************************************************************
// Constructor and initializer.

/**
Class wrapping the Netatmo API.

Required parameters:
- client_id: string
- client_secret: string

Optional parameters:
- scope: string (default: empty)
- callback_function: string (default: authCallback)
- use_lock: boolean (default: false)
- mute_exceptions: boolean (default: false)
- check_requests: boolean (default: true)

TODO: Explain how to use authCallback

@param {*} params
@constructor
*/
function NetatmoService_(params) {
  // Required parameters.
  if (!params.client_id) throw 'NetatmoLib.createService: Client ID is a required parameter.';
  this.clientID_ = params.client_id;
  if (!params.client_secret) throw 'NetatmoLib.createService: Client secret is a required parameter.';
  this.clientSecret_ = params.client_secret;

  // Optional parameters.
  this.scope_ = params.scope || '';
  this.callbackFunction_ = params.callback_function || 'authCallback';
  this.useLock_ = params.use_lock || false;
  this.muteExceptions_ = params.mute_exceptions || false;
  this.checkRequests_ = params.check_requests || true;

  // Other members.
  this.oauthService_ = null;
}

/**
Initialize the API and get the OAuth2 credentials.
 */
NetatmoService_.prototype.init = function() {
  this.oauthService_ = OAuth2.createService('netatmo')

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl(AUTHORIZATION_BASE_URL)
      .setTokenUrl(TOKEN_URL)

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(this.clientID_)
      .setClientSecret(this.clientSecret_)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction(this.callbackFunction_)

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())
      // .setCache(CacheService.getUserCache())

      // Set the scopes to request (space-separated for Google services).
      .setScope(this.scope_)

      // Sets the login hint, which will prevent the account chooser screen
      // from being shown to users logged in with multiple accounts.
      .setParam('login_hint', Session.getEffectiveUser().getEmail())

      // Requests offline access.
      .setParam('access_type', 'offline')

      // Consent prompt is required to ensure a refresh token is always
      // returned when requesting offline access.
      .setParam('prompt', 'consent');
  
  if (this.useLock_) {
    this.oauthService_.setLock(LockService.getUserLock());
  }
};

/**
@return {string}
 */
NetatmoService_.prototype.getRedirectUri = function() {
  return this.oauthService_.getRedirectUri();
};

/**
@param {*} request
 */
NetatmoService_.prototype.handleCallback = function(request) {
  return this.oauthService_.handleCallback(request);
};

/**
Top-level function to create and initialize a service.
@param {*} params
@return {NetatmoService_}
 */
function createService(params) {
  let service = new NetatmoService_(params);
  service.init();
  return service;
}

// ********************************************************************************
// OAuth2 methods

/**
Return true if the OAuth2 credentials are available.
@return {boolean}
 */
NetatmoService_.prototype.hasAccess = function() { return this.oauthService_.hasAccess(); };

/**
Refresh the OAuth2 credentials.
 */
NetatmoService_.prototype.refresh = function() { return this.oauthService_.refresh(); };

/**
Reset the OAuth2 credentials (i.e. logout).
 */
NetatmoService_.prototype.reset = function() { return this.oauthService_.reset(); };

/**
Get the URL for user consent.
@return {string}
 */
NetatmoService_.prototype.getAuthorizationUrl = function() { return this.oauthService_.getAuthorizationUrl(); };

// ********************************************************************************
// Request management

/**
Wrapper around UrlFetchApp.fetch, adding the OAuth2 token.
@param {string} url
@param {*} params
 */
NetatmoService_.prototype.fetch = function(url, params) {
  let clonedParams = {... params};
  let clonedHeaders = params.headers ? {... params.headers} : {};
  clonedParams.headers = clonedHeaders;
  clonedParams.headers['Authorization'] = 'Bearer ' + this.oauthService_.getAccessToken();
  return UrlFetchApp.fetch(url, clonedParams);
};

/**
@param {Object.<string|number|boolean|Array.<string|number|boolean>} urlParameters
@return {string}
 */
function formatURLParameters_(urlParameters) {
  let parameterString = '';
  function push(key, value) {
    parameterString += (parameterString ? '&' : '?') + key + '=' + encodeURIComponent(value);
  }
  for (var key in urlParameters) {
    let arr = urlParameters[key];
    if (Array.isArray(arr)) {
      arr.forEach(value => { push(key, value); });
    } else {
      push(key, arr);
    }
  }
  return parameterString;
};

/**
@param {*} value
@return {string}
@private
 */
function getTypeOf_(value) {
  if (Array.isArray(value)) return 'array';
  return (typeof value);
}

/**
@param {string} parameterName
@param {string} expectedType
@param {*} value
@private
 */
function checkType_(parameterName, expectedType, value) {
  let strippedExpectedType = expectedType.substring(0, 1) == '*' ? expectedType.substring(1) : expectedType;
  let valueType = getTypeOf_(value);
  if (valueType != strippedExpectedType) {
    throw 'Type mismatch: ' + parameterName + ' expects a value of type ' + strippedExpectedType + ', ' + valueType + ' found';
  }
}

/**
Throw an exception if the request is not compliant with the API schema.
@param {string} method
@param {Object.<string>} parameterSchema
@param {boolean} requiresPayload
@param {Object.<string|number|boolean|Array.<string|number|boolean>} parameters
@param {*} payload
 */
NetatmoService_.prototype.checkRequest = function(method, parameterSchema, requiresPayload, parameters, payload) {
  // Check the payload.
  if (requiresPayload) {
    if (!payload) throw 'Missing payload';
  } else {
    if (payload) throw 'Unexpected payload';
  }

  // Check parameter types.
  for (var key in parameters) {
    let expectedType = parameterSchema[key];
    if (!expectedType) {
      throw 'Unexpected parameter: ' + key;
    }
    checkType_(key, expectedType, parameters[key]);
  }

  // Check required parameters
  for (var key in parameterSchema) {
    let t = parameterSchema[key];
    if (t.substring(0, 1) == '*' && !(key in parameters)) {
      throw 'Missing required parameter: ' + key;
    }
  }
};

/**
@param {string|*|undefined} payload
@return {string}
@private
 */
function formatPayload_(payload) {
  if (!payload) {
    return undefined;
  } else if (typeof payload == 'string') {
    return payload;
  } else {
    return JSON.stringify(payload);
  }
}

/**
Send a request to an API endpoint.
@param {string} path
@param {string} method
@param {Object.<string|number|boolean|Array.<string|number|boolean>} urlParameters
@param {string|*} payload
 */
NetatmoService_.prototype.makeRequest = function(path, method, urlParameters, payload) {
  let response = this.fetch(BASE_API_URL + path + formatURLParameters_(urlParameters), {
    method: method,
    payload: formatPayload_(payload),
    contentType: payload ? 'application/json' : undefined,
    muteHttpExceptions: this.muteExceptions_
  });
  return response;
};

// ********************************************************************************
// API

/**
@const @enum
 */
var Scopes = {
  READ_MAGELLAN: 'read_magellan'
};

/**
@param {string} path
@param {string} method
@param {Object.<string>} parameterSchema
@param {boolean} requiresPayload
@return {function(Object.<string|number|boolean|Array.<string|number|boolean>, (Object|string|undefined): Object)}
@private
 */
function createEndpoint_(path, method, parameterSchema, requiresPayload) {
  return function(parameters, payload) {
    if (this.checkRequests_) this.checkRequest(method, parameterSchema, requiresPayload, parameters || {}, payload);
    let response = this.makeRequest(path, method, parameters, payload);
    return JSON.parse(response.getContentText())
  }
}

// Home+Control
NetatmoService_.prototype.homesData = createEndpoint_('/homesdata', 'GET', {home_id: 'string', gateway_types: 'array'});
NetatmoService_.prototype.homeStatus = createEndpoint_('/homestatus', 'GET', {home_id: '*string', device_types : 'array'});
NetatmoService_.prototype.setState = createEndpoint_('/setstate', 'POST', {}, true);
NetatmoService_.prototype.getScenarios = createEndpoint_('/getscenarios', 'GET', {home_id: '*string'});
NetatmoService_.prototype.getRoomMeasure = createEndpoint_('/getroommeasure', 'GET', {home_id: '*string', room_id : '*string', scale: '*string', type: '*array', date_begin: 'number', date_end: 'number', limit: 'number'});
NetatmoService_.prototype.homeStatus = createEndpoint_('/homestatus', 'GET', {home_id: '*string', device_types : 'array'});
NetatmoService_.prototype.setThermMode = createEndpoint_('/setthermmode', 'POST', {home_id: '*string', mode: '*string', endtime: 'string'}, false);
NetatmoService_.prototype.getMeasure = createEndpoint_('/getmeasure', 'GET',
  {device_id: '*string', module_id: '*string', scale: '*string', type: '*string', date_begin: 'number', date_end: 'number'});
NetatmoService_.prototype.createNewHomeSchedule = createEndpoint_('/createnewhomeschedule', 'POST', {home_id: '*string', name: 'string'}, true);
NetatmoService_.prototype.syncHomeSchedule = createEndpoint_('/synchomeschedule', 'POST', {home_id: '*string', schedule_id: 'string', name: 'string'}, true);
NetatmoService_.prototype.switchHoweSchedule = createEndpoint_('/switchhomeschedule', 'POST', {home_id: '*string', schedule_id: '*string'}, false);

// Home+Security
NetatmoService_.prototype.getEvents = createEndpoint_('/getevents', 'GET', {home_id: '*string', device_types: 'string', event_id: 'string', person_id: 'string', device_id: 'string', module_id: 'string', offset: 'number', size: 'number', locale: 'string'});
NetatmoService_.prototype.setPersonsAway = createEndpoint_('/setpersonsaway', 'POST', {home_id: '*string', person_id: 'string'}, false);
NetatmoService_.prototype.setPersonsHome = createEndpoint_('/setpersonshome', 'POST', {home_id: '*string', person_ids: 'array'}, false);
NetatmoService_.prototype.addWebHook = createEndpoint_('/addwebhook', 'POST', {url: '*string'}, false);
NetatmoService_.prototype.dropWebHook = createEndpoint_('/dropwebhook', 'POST', {}, false);

// Energy

// Weather
NetatmoService_.prototype.getPublicData = createEndpoint_('/getpublicdata', 'GET', {lat_ne: '*string', lon_ne: '*string', lat_sw: '*string', lon_sw: '*string', required_data: 'array', filter: 'boolean'});
NetatmoService_.prototype.getStationData = createEndpoint_('/getstationdata', 'GET', {device_id: 'string', get_favorites: 'string'});

// Aircare
NetatmoService_.prototype.getHomeCoachsData = createEndpoint_('/gethomescoachdata', 'GET', {device_id: 'string'});
