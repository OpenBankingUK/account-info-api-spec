const { convertCSVs, schemaFile } = require('./csv-to-yaml'); // eslint-disable-line
const { YAML } = require('swagger-parser'); // eslint-disable-line
const fs = require('fs');

const separateDefinitions = [
  'AccountId',
  'Amount',
  'CurrencyAndAmount',
  'TransactionInformation',
];

const versions = fs.readdirSync('./inputs').filter(d => d.startsWith('v'));

const readJson = file => JSON.parse(fs.readFileSync(file));

const writeSchema = (key, type, schemas, outdir) => {
  const schema = schemas.find(s => Object.keys(s)[0] === key);
  const outFile = schemaFile(type, outdir);
  const def = { [type]: Object.values(schema)[0] };
  fs.writeFileSync(outFile, YAML.stringify(def));
};

const convertJson = (dir, outdir) => {
  const schemas = fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .map(file => readJson(`${dir}/${file}`));
  if (schemas.length > 0) {
    writeSchema('PCA', 'OBPCAData1', schemas, outdir);
    writeSchema('BCA', 'OBBCAData1', schemas, outdir);
  }
};

versions.filter(v => v.startsWith('v2')).forEach((version) => {
  convertCSVs(`./inputs/${version}/data_definition`, `./inputs/${version}`, separateDefinitions);
  convertJson(`./inputs/${version}/data_definition`, `./inputs/${version}`);
});
