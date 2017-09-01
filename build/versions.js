/**
 * Master list of allowable versions
 */
const allowable = ['v1.0', 'v1.1'];

const version = process.env.VERSION;

if (!version) {
  throw new Error(' Environment Variable `VERSION` not set.  Please see README');
  process.exit(1);
}

if (allowable.indexOf(version) === -1) {
  throw new Error('VERSION not specified correctly.  Please see README');
  process.exit(1);
}
