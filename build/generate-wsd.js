var wsd = require('websequencediagrams');
var fs = require('fs');
const docsPath = process.argv[2] || './docs';
const distPath = process.argv[3] || './dist';
const glob = require('glob');
const utils = require('./utils');

glob('**/*.wsd', {
  cwd: docsPath
}, (err, filenames ) => {
  if (err) {
    console.error(err);
    throw err;
  }
  var promises = [];
  filenames.forEach(filename => {
    promises.push(processFile(filename));
  });
  Promise.all(promises)
  .then((res) => {
    process.exit(0);
  })
  .catch((err) => {
    process.exit(1);
  });
});



function processFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(docsPath + '/' + filename, 'utf8', function (err, data) {
      if (err) {
        console.error(err);
        reject(err);
      }
      wsd.diagram(data, "modern-blue", "png", function(er, buf, typ) {
        if (er) {
          console.error(er);
          reject(er);
        } else {
          const destination = distPath + '/' + filename.replace('.wsd','.png');
          return Promise.all([
            utils.writeToFile(buf, destination),
          ])
          .then(() => {
            console.log('Correctly generated wsd for ', filename);
            resolve();
          })
          .catch(err => {
            console.error('Failed while generating wsd for ', filename);
            console.error(err);
            reject(err);
          });;
        }
      });
    });
  });
}
