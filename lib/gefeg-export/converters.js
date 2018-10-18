const beautify = require('js-beautify').html;
const escape = require('html-escape');

const { parseGefegCsv } = require('../util');
const SwaggerDefinition = require('./definition/swagger').create;
const GefegDefinition = require('./definition/gefeg').create;

const createSkeletonObject = (parent, pathElements, externalReferences, mergeDescriptions) => {
  for (let i = 0; i < pathElements.length; i += 1) {
    if (i + 1 < pathElements.length && ['properties', 'items'].includes(pathElements[i + 1].fragment)) {
      const definition = SwaggerDefinition(
        pathElements[i + 1].fragment === 'properties' ? 'object' : 'array',
        pathElements[i].properties,
        externalReferences,
        mergeDescriptions,
      ).render();

      parent = parent[pathElements[i].fragment] = ( // eslint-disable-line
        parent[pathElements[i].fragment] || definition
      );
    } else {
      const definition = SwaggerDefinition(
        null,
        pathElements[i].properties,
        externalReferences,
        mergeDescriptions,
      ).render();
      parent = parent[pathElements[i].fragment] = // eslint-disable-line
        parent[pathElements[i].fragment] || definition;
    }
  }

  return parent;
};

const CsvToSwagger = (file, externalReferences, mergeDescriptions = []) => { // eslint-disable-line
  console.log(`\n=== ${file} ===\n`); // eslint-disable-line
  const lines = parseGefegCsv(file);

  // For each XPath
  const map = {};
  lines.forEach((parent) => {
    const childrenRegex = new RegExp(`^${parent.XPath}/[A-Za-z0-9]+$`);

    map[parent.XPath] = {
      attributes: parent,
      children: lines.filter(outerLine =>
        outerLine.XPath.match(childrenRegex)), // Match direct descendents
    };
  });

  const definition = {};

  lines.forEach((line) => {
    let targetXPath = [];
    let searchPath = '';

    // For each line in the CSV break down the path into a Swagger-like JSON path
    // Do this to ensure that each object is consistently place in the structure
    line.XPath.split('/').forEach((fragment) => {
      searchPath += searchPath === '' ? fragment : `/${fragment}`;
      const properties = map[searchPath];

      if (fragment !== '') {
        targetXPath.push({ properties, fragment });
      }

      // If the definition has children then this needs to be a complex object
      if (properties.children.length > 0) {
        // This is an array, so add items.properties
        if (properties.attributes.Occurrence.match(/[0-1]\.\.(n|[2-9]+)$/)) {
          targetXPath = targetXPath.concat([{ properties: null, fragment: 'items' }, { properties: null, fragment: 'properties' }]);
        // This is not an array, so just add properties
        } else {
          targetXPath.push({ properties: null, fragment: 'properties' });
        }
      }
    });

    createSkeletonObject(definition, targetXPath, externalReferences, mergeDescriptions);
  });

  return definition;
};

const CsvToMarkdownTable = (file) => {
  const formatTableRow = row => `| ${row.join(' | ')} |`;
  const definitions = parseGefegCsv(file)
    .map(line => GefegDefinition(line));
  const headings = [formatTableRow(definitions[0].getPropertyNames())];
  const divider = [formatTableRow(definitions[0].getPropertyNames().map(column => ' --- '))]; // eslint-disable-line

  return {
    name: definitions[0].Name,
    rows: headings.concat(
      divider,
      definitions.map(definition => formatTableRow(definition.getPropertiesAsArray())),
    ),
  };
};

const CsvToHtmlTable = (file) => {
  const tableRow = row => `<tr>${row}</tr>`;
  const definitions = parseGefegCsv(file)
    .map(line => GefegDefinition(line));
  const tableHeadings = tableRow(definitions[0]
    .getPropertyNames()
    .map(property => `<th>${property}</th>`)
    .join(''));
  const tableRows = definitions
    .map(definition => tableRow(definition.getPropertiesAsArray().map(property => `<td>${escape(property).replace(/\\/g, '\\\\')}</td>`).join('')))
    .join('');

  return {
    name: definitions[0].properties.Name,
    body: `<table><tbody>${tableHeadings}${tableRows}</tbody></table>`,
  };
};

module.exports = {
  CsvToSwagger,
  CsvToMarkdownTable,
  CsvToHtmlTable,
};
