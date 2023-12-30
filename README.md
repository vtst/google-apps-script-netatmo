# Netatmo for Google Apps Script

Netatmo for Google Apps Script is a library that allows to easily use the
[Netatmo Connect API](https://dev.netatmo.com/apidocumentation) to control
[Netatmo](https://www.netatmo.com/) devices from Google Apps Script.

## How to use?

### Adding the library to your project

The library is already published as an Apps Script, making it easy to
include in your project. To add it to your script, do the following in the
Apps Script code editor, follow the instructions in the section "Add a
library to your script project" on
[this page](https://developers.google.com/apps-script/guides/libraries).

The script ID of the library is `14H4bqC5cfmrbQT43Zj5v0Z5zpGUUEE5g5X3LBfkSMlB_gjTsXWKVWx52`, and you should
typically pick the latest version.

### Setting up credentials

The Netatmo Connect API uses OAuth2 to [authenticate requests and manage
authorizations](https://dev.netatmo.com/apidocumentation/oauth).

Before using the API, do the following steps:

1. Create an account on the [Netatmo developer
   website](https://dev.netatmo.com/).

2. Create your script in the [Google Apps Script
   editor](https://script.google.com/) and add the library to it (see
   instructions above).
   
3. Retrieve the redirect URI by running the following function in the code
   editor:
   ```js
   function logRedirectUri() {
     var service = getNetatmoService();
     Logger.log(service.getRedirectUri());
   }
   ```
   This will display the redirect URI in the execution log panel. This URI
   should be of the form
   `https://script.google.com/macros/d/<script-id>/usercallback`

4. [Create a new app](https://dev.netatmo.com/apps/) in your Netatmo
   developer account.  You need to fill the required fields as well
   as the _redirect URI_ field.
   
### Using the API

Here is a minimum code snippet illustrating how to use the API:

```js
function getNetatmoService() {
  return NetatmoLib.createService({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'read_magellan'
  });
}

function testNetatmoApi() {
  let service = getNetatmoService();
  if (service.hasAccess()) {
    let response = service.homesData();
    Logger.log(JSON.stringify(response, null, 2));
  } else {
    Logger.log('Please follow this link to authorize the Netatmo API:\n' + service.getAuthorizationUrl());
  }
}

function authCallback(request) {
  let service = getNetatmoService();
  let isAuthorized = service.handleCallback(request);
  return HtmlService.createHtmlOutput((isAuthorized ? 'Success!' : 'Denied.') + ' You can close this tab.');
}

function reset() {
  let service = getNetatmoService();
  service.reset();
}
```

To test this example, you should run twice the function `testNetatmoApi`
in the script editor. At the first run, you will see an URL in the execution
log. Visit this URL with your web browser to grant access to the Netatmo
API. At the second run, you will the the JSON output returned by the API
call.



