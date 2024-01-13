const HOME_ID = '6524f3afdc785ebbd306245d';

// ********************************************************************************

const RoomTypes = {
  "kitchen": {display_name: 'Kitchen', icon: 'skillet'},
  "bedroom": {display_name: 'Bedroom', icon: 'bed'},
  "livingroom": {display_name: 'Living room', icon: 'chair'},
  "bathroom": {display_name: 'Bathroom', icon: 'bathtub'},
  "lobby": {display_name: 'Lobby', icon: 'door_front'},
  "outdoor": {display_name: 'Outdoor', icon: 'nature'},
  "toilets": {display_name: 'Toilets', icon: 'wc'},
  "garage": {display_name: 'Garage', icon: 'garage'},
  "home_office": {display_name: 'Office', icon: 'desk'},
  "dining_room": {display_name: 'Dining room', icon: 'table_restaurant'},
  "corridor": {display_name: 'Corridor', icon: 'hallway'},
  "stairs": {display_name: 'Stairs', icon: 'floor'},
  "electrical_cabinet": {display_name: 'Electrical cabinet', icon: 'dynamic_form'},
  "custom": {display_name: 'Custom', icon: 'not_listed_location'}
};

function getRoomTypeInfo(name) {
  return RoomTypes[name] || RoomTypes['custom'];
}

const ModuleTypes = {
  'NLG': {display_name: 'Gateway', icon: 'hub'},
  'NLP': {display_name: 'Socket', icon: 'outlet'},
  'NLF': {display_name: 'Switch', icon: 'switch'},
  'NLT': {display_name: 'Remote', icon: 'settings_remote'},
  'NLM': {display_name: 'Light Micromodule', icon: 'lightbulb'},
  'NLV': {display_name: 'Roller shutter', icon: 'roller_shades'},
  'NLL': {display_name: 'Light Switch with Neutral', icon: 'switch'},
  'NLPC': {display_name: 'Energy meter', icon: 'question_mark'},
  'NLPM': {display_name: 'Mobile socket', icon: 'outlet'},
  'NLPO': {display_name: 'Connected contactor', icon: 'toggle_on'},
  'NLC': {display_name: 'Cable outlet', icon: 'cable'},
  'NLIS': {display_name: 'Double Switch with Neutral', icon: 'switch'},
  'NLPT': {display_name: 'Teleruptor', icon: 'toggle_on'},
  'NLFN': {display_name: 'Dimmer with Neutral', icon: 'switch'},
  'NLAS': {display_name: 'Magellan Green Power Remote control scenarios', icon: 'question_mark'},
  'NLFE': {display_name: 'Dimmer Light Switch Evolution', icon: 'switch'},
  'NLTS': {display_name: 'Magellan Remote Motion Sensor', icon: 'question_mark'},
  'NLD': {display_name: 'Wireless 2 button switch light', icon: 'switch'},
  'Zigbee 3rd party light': {display_name: 'Z3L', icon: 'lightbulb'},
  'NLPS': {display_name: 'Smart Load Shedder', icon: 'question_mark'},
  'NLPD': {display_name: 'Dry Contact', icon: 'toggle_on'},
  'NLAS': {display_name: 'Magellan Green Power Remote control scenarios', icon: 'question_mark'},
  'BNS': {display_name: 'Smarther with Netatmo', icon: 'question_mark'},
  'BNMH': {display_name: 'MyHome Server 1', icon: 'question_mark'},
  'BNTH': {display_name: 'Bticino Thermostat', icon: 'question_mark'},
  'BNFC': {display_name: 'Bticino Fan coil', icon: 'question_mark'},
  'BNTR': {display_name: 'Bticino module towel rail', icon: 'question_mark'},
  'BNCS': {display_name: 'Bticino module Controlled Socket', icon: 'question_mark'},
  'BNXM': {display_name: 'Bticino X meter', icon: 'question_mark'},
  'BNLD': {display_name: 'Bticino module lighting dimmer', icon: 'question_mark'},
  'BNIL': {display_name: 'Bticino intelligent light', icon: 'question_mark'},
  'BN3L': {display_name: 'Bticino 3rd party light', icon: 'question_mark'},
  'BNAB': {display_name: 'Bticino module automatic blind', icon: 'question_mark'},
  'BNAS': {display_name: 'Bticino module automatic shutter', icon: 'question_mark'},
  'BNMS': {display_name: 'Bticino module motorized shade', icon: 'question_mark'}
};

function getModuleTypeInfo(name) {
  return ModuleTypes[name] || {display_name: 'Unknown', icon: 'question_mark'};
}

const ApplianceTypes = {
  "light": {display_name: 'Light', icon: 'lightbulb'},
  "fridge_freezer": {display_name: 'Fridge or freezer', icon: 'kitchen'},
  "oven": {display_name: 'Oven', icon: 'oven'},
  "washing_machine": {display_name: 'Washing machine', icon: 'local_laundry_service'},
  "tumble_dryer": {display_name: 'Tumble dryer', icon: 'local_laundry_service'},
  "dishwasher": {display_name: 'Dishwasher', icon: 'dishwasher'},
  "multimedia": {display_name: 'Multimedia', icon: 'connected_tv'},
  "router": {display_name: 'Router', icon: 'router'},
  "other": {display_name: 'Other', icon: 'question_mark'},
  "cooking": {display_name: 'Cooking', icon: 'cooking'},
  "radiator": {display_name: 'Radiator', icon: 'mode_heat'},
  "radiator_without_pilot_wire": {display_name: 'Radiator without pilot wire', icon: 'mode_heat'},
  "water_heater": {display_name: 'Water heater', icon: 'water_heater'},
  "extractor_hood": {display_name: 'Extractor hood', icon: 'range_hood'},
  "contactor": {display_name: 'Contactor', icon: 'toggle_on'},
  "dryer": {display_name: 'Dryer', icon: 'local_laundry_service'},
  "electric_charger": {display_name: 'Electric charger', icon: 'ev_charger'},
};

function getApplicanceTypeInfo(name) {
  return ApplianceTypes[name] || ApplianceTypes['other'];
}

function getModuleInfo(module) {
  if (module.appliance_type) return getApplicanceTypeInfo(module.appliance_type);
  else return getModuleTypeInfo(module.type);
}

const ThermFpSetpoints = [
  {mode: 'off', fp: 'stand_by', display_name: 'Off'},
  {mode: 'hg', fp: 'frost_guard', display_name: 'Frost guard'},
  {mode: 'manual', fp: 'away', display_name: 'Eco'},
  {mode: 'manual', fp: 'comfort', display_name: 'Comfort'}
];

const ThermFpSetpointsByFp = makeDict(ThermFpSetpoints, fieldGetter('fp'));

// ********************************************************************************

function getExplorerData(homeId) {
  let service = getNetatmoService();
  let homeData = service.endpoints.homesData();
  let home = homeData.body.homes.find(home => (home.id == homeId)) || homeData.body.homes[0];
  let homeStatus = service.endpoints.homeStatus({home_id: home.id});

  let data = {
    home: home,
    homes: homeData.body.homes,
    homeStatus: homeStatus,
    rooms: makeDict(homeData.body.homes[0].rooms, fieldGetter('id')),
    modules: makeDict(homeData.body.homes[0].modules, fieldGetter('id'))
  };

  // TODO: It might be good to trim data, so that the HTML page does not get too large.

  // Merge room data from homeStatus.
  mergeArrayIntoDict(homeStatus.body.home.rooms, data.rooms, fieldGetter('id'));
  // Merge module data from homeStatus.
  mergeArrayIntoDict(homeStatus.body.home.modules, data.modules, fieldGetter('id'));

  return data;
}

// ********************************************************************************
// UI functions

function isHeatingModule(module) {
  return module.type == 'NLC' && module.appliance_type == 'radiator';
}

function isDisplayableModule(module) {
  return module && !isHeatingModule(module);
}

function logout() {
  var service = getNetatmoService();
  service.oauth.reset();
}

function setHomeState(homeState) {
  return getNetatmoService().endpoints.setState({}, {home: homeState});
}

function setStateOLD(homeId, module, onValue) {
  return getNetatmoService().endpoints.setState({}, {
    "home": {
      "id": homeId,
      "modules": [
        {
          "id": module.id,
          "on": onValue,
          "bridge": module.bridge
        }
      ]
    }
  });
}
