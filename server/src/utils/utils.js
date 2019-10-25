const toLowerCaseObject = items => items.map((x) => {
  const lowerCased = {};
  Object.keys(x).forEach((i) => {
    if (Object.prototype.hasOwnProperty.call(x, i)) {
      lowerCased[i.toLowerCase()] = x[i] instanceof Array ? toLowerCaseObject(x[i]) : x[i];
    }
  });
  return lowerCased;
});

const prune = (data, keys = []) => {
  let y;
  Object.keys(data).forEach((x) => {
    y = data[x];
    if (keys.indexOf(x) !== -1 || y === 'null' || y === null || y === '' || typeof y === 'undefined' || (y instanceof Object && Object.keys(y).length === 0)) {
      // eslint-disable-next-line no-param-reassign
      delete data[x];
    }
    if (y instanceof Object && x !== 'config') y = prune(y, keys);
  });
  return data;
};

const hasSameProperty = (a, b) => {
  if (a === null || a === undefined) return false;
  if (b === null || b === undefined) return false;
  const aProps = Object.getOwnPropertyNames(a).sort();
  const bProps = Object.getOwnPropertyNames(b).sort();
  if (aProps.length !== bProps.length) return false;
  if (JSON.stringify(aProps) !== JSON.stringify(bProps)) return false;
  return true;
};

export { prune, toLowerCaseObject, hasSameProperty };
