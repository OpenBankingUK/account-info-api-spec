# Usage

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
