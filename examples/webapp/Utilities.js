function fieldGetter(path) {
  let parts = path.split('.');
  if (parts.length == 1) {
    return function(obj) {
      return obj[path];
    }
  } else {
    return function(obj) {
      let x = obj;
      parts.forEach(part => {
        x = x[part];
      });
      return x;
    }
  }
}

function fieldComparator(path) {
  let getter = fieldGetter(path);
  return function(x, y) {
    let x0 = getter(x), y0 = getter(y);
    if (x0 < y0) return -1;
    else if (x0 == y0) return 0;
    else return 1;
  }
}

function makeDict(arr, keyFn) {
  let dict = {};
  arr.forEach(element => {
    dict[keyFn(element)] = element;
  });
  return dict;
}

function makeArray(dict, opt_compareFn) {
  let arr = [];
  for (var key in dict) {
    arr.push(dict[key]);
  }
  if (opt_compareFn) arr.sort(opt_compareFn);
  return arr;
}

function include(file, opt_values) {
  let template = HtmlService.createTemplateFromFile(file);
  if (opt_values) {
    for (var key in opt_values) template[key] = opt_values[key];
  }
  return template.evaluate().getContent();
}

function mergeInto(x, y) {
  for (var key in x) {
    y[key] = x[key];
  }
}

function mergeArrayIntoDict(arr, dict, keyFn) {
  arr.forEach(x => {
    let y = dict[keyFn.call(null, x)];
    if (y) mergeInto(x, y);
  })
}

function isNotNull(x) {
  if (x) return true;
  else return false;
}