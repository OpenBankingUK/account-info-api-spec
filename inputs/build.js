const { YAML } = require('swagger-parser'); // eslint-disable-line
const fs = require('fs');

const readYaml = file => YAML.parse(fs.readFileSync(file));

const fileListToObject = (items, dir) => {
  const obj = {};
  items.forEach(file => Object.assign(obj, readYaml(`${dir}/${file.$ref}`)));
  return obj;
};

const importSection = (api, dir, section) => {
  console.log(`section: ${section}`);
  const items = api[section];
  console.log(`${YAML.stringify(items)}`);
  const obj = fileListToObject(items, dir);
  api[section] = obj; // eslint-disable-line
};

const importPaths = (api, dir) => {
  for (const path in api.paths) { // eslint-disable-line
    const items = api.paths[path];
    console.log(`path: ${path}`);
    console.log(`${YAML.stringify(items)}`);
    const obj = fileListToObject(items, dir);
    api.paths[path] = obj; // eslint-disable-line
  }
};

const writeOutput = (outFile, api) => {
  const path = outFile.split('/');
  path.pop();
  const outDir = path.join('/');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  fs.writeFileSync(`${outFile}.yaml`, YAML.stringify(api));
  fs.writeFileSync(`${outFile}.json`, JSON.stringify(api, null, 2));
};

const process = (file, outFile) => {
  try {
    const dir = file.replace('/index.yaml', '');
    const api = readYaml(file);
    importPaths(api, dir);
    importSection(api, dir, 'definitions');
    importSection(api, dir, 'parameters');
    importSection(api, dir, 'responses');
    importSection(api, dir, 'securityDefinitions');
    writeOutput(outFile, api);
  } catch (e) {
    console.log(Object.keys(e)); // eslint-disable-line
    console.log(e); // eslint-disable-line
  }
};

try {
  process('./inputs/v1.1/accounts/index.yaml', './dist/v1.1/account-info-swagger');
  // process('./inputs/v2.0/accounts/index.yaml', './dist/v2.0/account-info-swagger');
} catch (e) {
  console.log(Object.keys(e)); // eslint-disable-line
  console.log(e); // eslint-disable-line
}
