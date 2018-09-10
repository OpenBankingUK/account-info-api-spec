# Account and Transaction API Specification

For more information see the [Open Banking Developer Zone](https://openbanking.atlassian.net/wiki/spaces/DZ/overview).

# Usage (new approach)

Install dependencies:

```sh
npm install
```

For Confirmation of Funds and Payment Initiation run `csvtoyaml` and `buildswagger` commands e.g. for Payment Initiation:

```
npm run csvtoyaml -- --input ./inputs/v3.0-RC4/data_definition/payment-initiation --output ./inputs/v3.0-RC4/payment-initiation
npm run buildswagger -- --input ./inputs/v3.0-RC4/payment-initiation --apiversion v3.0.0 --output ./dist/v3.0.0
```

Account Info requires an extra step `copy-product-schemas` to copy in the Product JSON Schemas from the Open Data API specification. Account Info also requires a description of the permissions that describe the Basic and Detailed data clusters to be passed in:

```
npm run csvtoyaml -- --input ./inputs/v3.0-RC4/data_definition/account-info --output ./inputs/v3.0-RC4/account-info
npm run copy-product-schemas -- --output ./inputs/v3.0-RC4/account-info/definitions inputs/v3.0-RC4/data_definition/ainfobca.2.2.0.swagger.json inputs/v3.0-RC4/data_definition/ainfopca.2.2.0.swagger.json
npm run buildswagger -- --input ./inputs/v3.0-RC4/account-info --apiversion v3.0.0 --output ./dist/v3.0.0
```

To run tests:

```sh
npm run test
```

# Usage (old approach no longer works with latest version)
```npm run start```  builds the project and runs a local webserver on http://localhost:8080/ serving the swagger spec using the spectacles-docs format

# Scripts
```npm run test``` runs the tests , validate swagger spec against the swagger schema (not the editor!!)

```npm run flatten-schemas``` flattens the schemas in the schema folder<br>
```npm run compile-swagger``` dereference the swagger spec split from  several yaml files to one fully dereferenced yaml file , dereferencing the schemas compiled using npm run flatten-schemas

# Debugging

When runnning ```npm run build:all``` the schema flattening was failing
 due to multiple referenced files not being interpreted correctly.
It's now possible to see a debug log of the inner reference fixes
set the environment variable *SWAGGER_DEBUG=true* and a json file of old / fixes / and fixed
partials will appear in the path *debug/log.json*

# Versions
The buid scripts depend on a version being set in an environment variable
e.g. export `VERSION=v1.0`  
The Master list of allowable versions is stored in the /build/versions.js file
and must be maintained there as new versions are created.


**** WIP Documentation ****
To convert SwaggerSpec to MARKDOWN
You need to have
1) swagger2markup-cli-1.3.1.jar  -> http://swagger2markup.github.io/swagger2markup/1.3.1/#_command_line_interface

Install Ruby and PDF libraries.
Either:
- rbenv install 2.2.9
- gem install bundler
- bundle install
OR:
- rvm install 2.2
- rvm use 2.2
- gem install asciidoctor
- gem install --pre asciidoctor-pdf
- gem uninstall prawn
- gem install prawn -v 2.1.0

# Troubleshooting

If you run `npm run build:all` and there are errors in a new terminal session,
issuing the command `rvm use 2.2` may fix it
