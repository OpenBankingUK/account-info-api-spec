# Account and Transaction API Specification


<a name="overview"></a>
## Overview
Swagger for Account and Transaction API Specification


### Version information
*Version* : v1.1.1


### Contact information
*Contact* : Service Desk  
*Contact Email* : ServiceDesk@openbanking.org.uk


### License information
*License* : open-licence  
*License URL* : https://www.openbanking.org.uk/open-licence  
*Terms of service* : https://www.openbanking.org.uk/terms


### URI scheme
*BasePath* : /open-banking/v1.1  
*Schemes* : HTTPS


### Produces

* `application/json; charset=utf-8`




<a name="paths"></a>
## Paths

***

<a name="createaccountrequest"></a>
### Create an account request
```
POST /account-requests
```


#### Description
Create an account request


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Header**|**x-jws-signature**  <br>*optional*|DO NOT USE. Header containing a detached JWS signature of the body of the payload.|string|


#### Body parameter
Create an Account Request

*Name* : body  
*Flags* : required


|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Allows setup of an account access request|[Data](#data)|
|**Risk**  <br>*required*|The Risk payload is sent by the initiating party to the ASPSP. It is used to specify additional details for risk scoring for Account Info.|object|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**ExpirationDateTime**  <br>*optional*|Specified date and time the permissions will expire. If this is not populated, the permissions will be open ended. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**Permissions**  <br>*required*|Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.|< enum (ReadAccountsBasic, ReadAccountsDetail, ReadBalances, ReadBeneficiariesBasic, ReadBeneficiariesDetail, ReadDirectDebits, ReadProducts, ReadStandingOrdersBasic, ReadStandingOrdersDetail, ReadTransactionsBasic, ReadTransactionsCredits, ReadTransactionsDebits, ReadTransactionsDetail) > array|
|**TransactionFromDateTime**  <br>*optional*|Specified start date and time for the transaction query period. If this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TransactionToDateTime**  <br>*optional*|Specified end date and time for the transaction query period. If this is not populated, the end date will be open ended, and data will be returned to the latest available transaction. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**201**|Account Request resource successfully created  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account Request POST response](#account-request-post-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-request-post-response"></a>
**Account Request POST response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Account Request Response|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|
|**Risk**  <br>*required*|The Risk payload is sent by the initiating party to the ASPSP. It is used to specify additional details for risk scoring for Account Info.|object|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**AccountRequestId**  <br>*required*|Unique identification as assigned to identify the account request resource.  <br>**Length** : `1 - 128`|string|
|**CreationDateTime**  <br>*required*|Date and time at which the resource was created. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**ExpirationDateTime**  <br>*optional*|Specified date and time the permissions will expire. If this is not populated, the permissions will be open ended. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**Permissions**  <br>*required*|Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.|< enum (ReadAccountsBasic, ReadAccountsDetail, ReadBalances, ReadBeneficiariesBasic, ReadBeneficiariesDetail, ReadDirectDebits, ReadProducts, ReadStandingOrdersBasic, ReadStandingOrdersDetail, ReadTransactionsBasic, ReadTransactionsCredits, ReadTransactionsDebits, ReadTransactionsDetail) > array|
|**Status**  <br>*optional*|Specifies the status of the account request resource.|enum (Authorised, AwaitingAuthorisation, Rejected, Revoked)|
|**TransactionFromDateTime**  <br>*optional*|Specified start date and time for the transaction query period. If this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TransactionToDateTime**  <br>*optional*|Specified end date and time for the transaction query period. If this is not populated, the end date will be open ended, and data will be returned to the latest available transaction. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Consumes

* `application/json; charset=utf-8`


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[TPPOAuth2Security](#tppoauth2security)**|accounts|


***

<a name="getaccountrequest"></a>
### Get an account request
```
GET /account-requests/{AccountRequestId}
```


#### Description
Get an account request


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountRequestId**  <br>*required*|Unique identification as assigned by the ASPSP to uniquely identify the account request resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Request resource successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account Request GET response](#account-request-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-request-get-response"></a>
**Account Request GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Account Request Response|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|
|**Risk**  <br>*required*|The Risk payload is sent by the initiating party to the ASPSP. It is used to specify additional details for risk scoring for Account Info.|object|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**AccountRequestId**  <br>*required*|Unique identification as assigned to identify the account request resource.  <br>**Length** : `1 - 128`|string|
|**CreationDateTime**  <br>*required*|Date and time at which the resource was created. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**ExpirationDateTime**  <br>*optional*|Specified date and time the permissions will expire. If this is not populated, the permissions will be open ended. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**Permissions**  <br>*required*|Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.|< enum (ReadAccountsBasic, ReadAccountsDetail, ReadBalances, ReadBeneficiariesBasic, ReadBeneficiariesDetail, ReadDirectDebits, ReadProducts, ReadStandingOrdersBasic, ReadStandingOrdersDetail, ReadTransactionsBasic, ReadTransactionsCredits, ReadTransactionsDebits, ReadTransactionsDetail) > array|
|**Status**  <br>*optional*|Specifies the status of the account request resource.|enum (Authorised, AwaitingAuthorisation, Rejected, Revoked)|
|**TransactionFromDateTime**  <br>*optional*|Specified start date and time for the transaction query period. If this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TransactionToDateTime**  <br>*optional*|Specified end date and time for the transaction query period. If this is not populated, the end date will be open ended, and data will be returned to the latest available transaction. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[TPPOAuth2Security](#tppoauth2security)**|accounts|


***

<a name="deleteaccountrequest"></a>
### Delete an account request
```
DELETE /account-requests/{AccountRequestId}
```


#### Description
Delete an account request


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Path**|**AccountRequestId**  <br>*required*|Unique identification as assigned by the ASPSP to uniquely identify the account request resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**204**|Account Request resource successfully deleted  <br>**Headers** :   <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|No Content|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[TPPOAuth2Security](#tppoauth2security)**|accounts|


***

<a name="getaccounts"></a>
### Get Accounts
```
GET /accounts
```


#### Description
Get a list of accounts


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Accounts successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account GET response](#account-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-get-response"></a>
**Account GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*optional*|Account|< [Account](#account) > array|

<a name="account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*optional*|Provides the details to identify an account.|[Account](#account-account)|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Currency**  <br>*required*|Identification of the currency in which the account is held.  Usage: Currency should only be used in case one and the same account number covers several currencies and the initiating party needs to identify which currency needs to be used for settlement on the account.  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|
|**Nickname**  <br>*optional*|The nickname of the account, assigned by the account owner in order to provide an additional means of identification of the account.  <br>**Length** : `1 - 70`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account.|[Servicer](#account-servicer)|

<a name="account-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|The data dictionary is the correct version in these four instances.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (IBAN, SortCodeAccountNumber)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="account-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getaccount"></a>
### Get Account
```
GET /accounts/{AccountId}
```


#### Description
Get an account


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account resource successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account GET response](#account-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-get-response"></a>
**Account GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*optional*|Account|< [Account](#account) > array|

<a name="account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*optional*|Provides the details to identify an account.|[Account](#account-account)|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Currency**  <br>*required*|Identification of the currency in which the account is held.  Usage: Currency should only be used in case one and the same account number covers several currencies and the initiating party needs to identify which currency needs to be used for settlement on the account.  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|
|**Nickname**  <br>*optional*|The nickname of the account, assigned by the account owner in order to provide an additional means of identification of the account.  <br>**Length** : `1 - 70`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account.|[Servicer](#account-servicer)|

<a name="account-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|The data dictionary is the correct version in these four instances.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (IBAN, SortCodeAccountNumber)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="account-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getaccountbalances"></a>
### Get Account Balances
```
GET /accounts/{AccountId}/balances
```


#### Description
Get Balances related to an account


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Beneficiaries successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Balances GET response](#balances-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="balances-get-response"></a>
**Balances GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Balance**  <br>*optional*|Balance|< [Balance](#balance) > array|

<a name="balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Amount**  <br>*required*|Amount of money of the cash balance.|[Amount](#balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**CreditLine**  <br>*optional*||< [CreditLine](#balance-creditline) > array|
|**DateTime**  <br>*required*|Indicates the date (and time) of the balance. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, Expected, ForwardAvailable, Information, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked)|

<a name="balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="balance-creditline"></a>
**CreditLine**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*optional*|Active Or Historic Currency Code and Amount|[Amount](#balance-creditline-amount)|
|**Included**  <br>*required*|Indicates whether or not the credit line is included in the balance of the account. Usage: If not present, credit line is not included in the balance amount of the account.|boolean|
|**Type**  <br>*optional*|Limit type, in a coded form.|enum (Pre-Agreed, Emergency, Temporary)|

<a name="balance-creditline-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getaccountbeneficiaries"></a>
### Get Account Beneficiaries
```
GET /accounts/{AccountId}/beneficiaries
```


#### Description
Get Beneficiaries related to an account


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Beneficiaries  successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Beneficiaries GET response](#beneficiaries-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="beneficiaries-get-response"></a>
**Beneficiaries GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Beneficiary**  <br>*optional*|Beneficiary|< [Beneficiary](#beneficiary) > array|

<a name="beneficiary"></a>
**Beneficiary**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*optional*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**BeneficiaryId**  <br>*optional*|A unique and immutable identifier used to identify the beneficiary resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*optional*|Provides the details to identify the beneficiary account.|[CreditorAccount](#beneficiary-creditoraccount)|
|**Reference**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account.|[Servicer](#beneficiary-servicer)|

<a name="beneficiary-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|The data dictionary is the correct version in these four instances.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (IBAN, SortCodeAccountNumber)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="beneficiary-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getaccountdirectdebits"></a>
### Get Account Direct Debits
```
GET /accounts/{AccountId}/direct-debits
```


#### Description
Get Direct Debits related to an account


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Direct Debits successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account GET response](#account-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-get-response"></a>
**Account GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**DirectDebit**  <br>*optional*|DirectDebit|< [DirectDebit](#directdebit) > array|

<a name="directdebit"></a>
**DirectDebit**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitId**  <br>*optional*|A unique and immutable identifier used to identify the direct debit resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitStatusCode**  <br>*optional*|Specifies the status of the direct debit in code form.|enum (Active, Inactive)|
|**MandateIdentification**  <br>*required*|Direct Debit reference. For AUDDIS service users provide Core Reference. For non AUDDIS service users provide Core reference if possible or last used reference.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*required*|Name of Service User  <br>**Length** : `1 - 70`|string|
|**PreviousPaymentAmount**  <br>*optional*|The amount of the most recent direct debit collection.|[PreviousPaymentAmount](#directdebit-previouspaymentamount)|
|**PreviousPaymentDateTime**  <br>*optional*|Date of most recent direct debit collection. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|

<a name="directdebit-previouspaymentamount"></a>
**PreviousPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getaccountproduct"></a>
### Get Account Product
```
GET /accounts/{AccountId}/product
```


#### Description
Get Product related to an account


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Product successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Product GET response](#product-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="product-get-response"></a>
**Product GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Product**  <br>*optional*|Product|< [Product](#product) > array|

<a name="product"></a>
**Product**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**ProductIdentifier**  <br>*required*|Identifier within the parent organisation for the product. Must be unique in the organisation.|string|
|**ProductName**  <br>*optional*|The name of the product used for marketing purposes from a customer perspective. I.e. what the customer would recognise.|string|
|**ProductType**  <br>*required*|Descriptive code for the product category.|enum (BCA, PCA)|
|**SecondaryProductIdentifier**  <br>*optional*|Identifier within the parent organisation for the product. Must be unique in the organisation.|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getaccountstandingorders"></a>
### Get Account Standing Orders
```
GET /accounts/{AccountId}/standing-orders
```


#### Description
Get Standing Orders related to an account


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Standing Orders successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Standing Orders GET response](#standing-orders-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="standing-orders-get-response"></a>
**Standing Orders GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**StandingOrder**  <br>*optional*|StandingOrder|< [StandingOrder](#standingorder) > array|

<a name="standingorder"></a>
**StandingOrder**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*optional*|Provides the details to identify the beneficiary account.|[CreditorAccount](#standingorder-creditoraccount)|
|**FinalPaymentAmount**  <br>*optional*|The amount of the final Standing Order|[FinalPaymentAmount](#standingorder-finalpaymentamount)|
|**FinalPaymentDateTime**  <br>*optional*|The date on which the final payment for a Standing Order schedule will be made. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**FirstPaymentAmount**  <br>*optional*|The amount of the first Standing Order|[FirstPaymentAmount](#standingorder-firstpaymentamount)|
|**FirstPaymentDateTime**  <br>*optional*|The date on which the first payment for a Standing Order schedule will be made. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**Frequency**  <br>*required*|EvryDay - Every day<br>EvryWorkgDay - Every working day<br>IntrvlWkDay - An interval specified in weeks (01 to 09), and the day within the week (01 to 07)<br>WkInMnthDay - A monthly interval, specifying the week of the month (01 to 05) and day within the week (01 to 07)<br>IntrvlMnthDay - An interval specified in months (between 01 to 06, 12, 24), specifying the day within the month (-5 to -1, 1 to 31)<br>QtrDay - Quarterly (either ENGLISH, SCOTTISH, or RECEIVED)<br>Patterns: <br>EvryDay (ScheduleCode)<br>EvryWorkgDay (ScheduleCode)<br>IntrvlWkDay:IntervalInWeeks:DayInWeek (ScheduleCode + IntervalInWeeks + DayInWeek)<br>WkInMnthDay:WeekInMonth:DayInWeek (ScheduleCode + WeekInMonth + DayInWeek)<br>IntrvlMnthDay:IntervalInMonths:DayInMonth (ScheduleCode + IntervalInMonths + DayInMonth)<br>QtrDay: + either (ENGLISH, SCOTTISH or RECEIVED) ScheduleCode + QuarterDay<br><br>The regular expression for this element combines five smaller versions for each permitted pattern. To aid legibility - the components are presented individually here:<br>EvryDay<br>EvryWorkgDay<br>IntrvlWkDay:0[1-9]:0[1-7]<br>WkInMnthDay:0[1-5]:0[1-7]<br>IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01])<br>QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED)  <br>**Pattern** : `"^(EvryDay)$\|^(EvryWorkgDay)$\|^(IntrvlWkDay:0[1-9]:0[1-7])$\|^(WkInMnthDay:0[1-5]:0[1-7])$\|^(IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))$\|^(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED))$"`|string|
|**NextPaymentAmount**  <br>*required*|The amount of the next Standing Order|[NextPaymentAmount](#standingorder-nextpaymentamount)|
|**NextPaymentDateTime**  <br>*required*|The date on which the next payment for a Standing Order schedule will be made. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**Reference**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#standingorder-servicer)|
|**StandingOrderId**  <br>*optional*|A unique and immutable identifier used to identify the standing order resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|

<a name="standingorder-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|The data dictionary is the correct version in these four instances.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (IBAN, SortCodeAccountNumber)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="standingorder-finalpaymentamount"></a>
**FinalPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="standingorder-firstpaymentamount"></a>
**FirstPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="standingorder-nextpaymentamount"></a>
**NextPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="standingorder-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getaccounttransactions"></a>
### Get Account Transactions
```
GET /accounts/{AccountId}/transactions
```


#### Description
Get transactions related to an account


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|
|**Query**|**fromBookingDateTime**  <br>*optional*|The UTC ISO 8601 Date Time to filter transactions FROM <br>NB Time component is optional - set to 00:00:00 for just Date.  <br>The parameter must NOT have a timezone set|string (date-time)|
|**Query**|**toBookingDateTime**  <br>*optional*|The UTC ISO 8601 Date Time to filter transactions TO <br>NB Time component is optional - set to 00:00:00 for just Date.  <br>The parameter must NOT have a timezone set|string (date-time)|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Transactions successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account Transactions GET response](#account-transactions-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-transactions-get-response"></a>
**Account Transactions GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Transaction**  <br>*optional*|Transaction|< [Transaction](#data-transaction) > array|

<a name="data-transaction"></a>
**Transaction**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**AddressLine**  <br>*optional*|Information that locates and identifies a specific address, as defined by postal services, that is presented in free format text.  <br>**Length** : `1 - 70`|string|
|**Amount**  <br>*required*|Amount of money in the cash entry.|[Amount](#data-transaction-amount)|
|**Balance**  <br>*optional*|Set of elements used to define the balance as a numerical representation of the net increases and decreases in an account after a transaction entry is applied to the account.|[Balance](#data-transaction-balance)|
|**BankTransactionCode**  <br>*optional*|Set of elements used to fully identify the type of underlying transaction resulting in an entry.|[BankTransactionCode](#data-transaction-banktransactioncode)|
|**BookingDateTime**  <br>*required*|Date and time when a transaction entry is posted to an account on the account servicer's books. Usage: Booking date is the expected booking date, unless the status is booked, in which case it is the actual booking date. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the transaction is a credit or a debit entry.|enum (Credit, Debit)|
|**MerchantDetails**  <br>*optional*|Details of the merchant involved in the transaction.|[MerchantDetails](#data-transaction-merchantdetails)|
|**ProprietaryBankTransactionCode**  <br>*optional*|Set of elements to fully identify a proprietary bank transaction code.|[ProprietaryBankTransactionCode](#data-transaction-proprietarybanktransactioncode)|
|**Status**  <br>*required*|Status of a transaction entry on the books of the account servicer.|enum (Booked, Pending)|
|**TransactionId**  <br>*optional*|Unique identifier for the transaction within an servicing institution. This identifier is both unique and immutable.  <br>**Length** : `1 - 40`|string|
|**TransactionInformation**  <br>*optional*|Further details of the transaction. This is the transaction narrative, which is unstructured text.  <br>**Length** : `1 - 500`|string|
|**TransactionReference**  <br>*optional*|Unique reference for the transaction. This reference is optionally populated, and may as an example be the FPID in the Faster Payments context.  <br>**Length** : `1 - 35`|string|
|**ValueDateTime**  <br>*optional*|Date and time at which assets become available to the account owner in case of a credit entry, or cease to be available to the account owner in case of a debit entry.  Usage: If entry status is pending and value date is present, then the value date refers to an expected/requested value date. For entries subject to availability/float and for which availability information is provided, the value date must not be used. In this case the availability component identifies the  number of availability days. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|

<a name="data-transaction-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="data-transaction-balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|Amount of money of the cash balance after a transaction entry is applied to the account..|[Amount](#data-transaction-balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, Expected, ForwardAvailable, Information, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked)|

<a name="data-transaction-balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="data-transaction-banktransactioncode"></a>
**BankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Specifies the family within a domain.|string|
|**SubCode**  <br>*required*|Specifies the sub-product family within a specific family.|string|

<a name="data-transaction-merchantdetails"></a>
**MerchantDetails**

|Name|Description|Schema|
|---|---|---|
|**MerchantCategoryCode**  <br>*optional*|Category code conform to ISO 18245, related to the type of services or goods the merchant provides for the transaction.  <br>**Length** : `3 - 4`|string|
|**MerchantName**  <br>*optional*|Name by which the merchant is known.  <br>**Length** : `1 - 350`|string|

<a name="data-transaction-proprietarybanktransactioncode"></a>
**ProprietaryBankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Proprietary bank transaction code to identify the underlying transaction.  <br>**Length** : `1 - 35`|string|
|**Issuer**  <br>*optional*|Identification of the issuer of the proprietary bank transaction code.  <br>**Length** : `1 - 35`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getbalances"></a>
### Get Balances
```
GET /balances
```


#### Description
Get Balances


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Balances successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Balances GET response](#balances-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="balances-get-response"></a>
**Balances GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Balance**  <br>*optional*|Balance|< [Balance](#balance) > array|

<a name="balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Amount**  <br>*required*|Amount of money of the cash balance.|[Amount](#balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**CreditLine**  <br>*optional*||< [CreditLine](#balance-creditline) > array|
|**DateTime**  <br>*required*|Indicates the date (and time) of the balance. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, Expected, ForwardAvailable, Information, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked)|

<a name="balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="balance-creditline"></a>
**CreditLine**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*optional*|Active Or Historic Currency Code and Amount|[Amount](#balance-creditline-amount)|
|**Included**  <br>*required*|Indicates whether or not the credit line is included in the balance of the account. Usage: If not present, credit line is not included in the balance amount of the account.|boolean|
|**Type**  <br>*optional*|Limit type, in a coded form.|enum (Pre-Agreed, Emergency, Temporary)|

<a name="balance-creditline-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getbeneficiaries"></a>
### Get Beneficiaries
```
GET /beneficiaries
```


#### Description
Get Beneficiaries


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Beneficiaries successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Beneficiaries GET response](#beneficiaries-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="beneficiaries-get-response"></a>
**Beneficiaries GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Beneficiary**  <br>*optional*|Beneficiary|< [Beneficiary](#beneficiary) > array|

<a name="beneficiary"></a>
**Beneficiary**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*optional*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**BeneficiaryId**  <br>*optional*|A unique and immutable identifier used to identify the beneficiary resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*optional*|Provides the details to identify the beneficiary account.|[CreditorAccount](#beneficiary-creditoraccount)|
|**Reference**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account.|[Servicer](#beneficiary-servicer)|

<a name="beneficiary-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|The data dictionary is the correct version in these four instances.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (IBAN, SortCodeAccountNumber)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="beneficiary-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getdirectdebits"></a>
### Get Direct Debits
```
GET /direct-debits
```


#### Description
Get Direct Debits


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Direct Debits successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account GET response](#account-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-get-response"></a>
**Account GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**DirectDebit**  <br>*optional*|DirectDebit|< [DirectDebit](#directdebit) > array|

<a name="directdebit"></a>
**DirectDebit**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitId**  <br>*optional*|A unique and immutable identifier used to identify the direct debit resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitStatusCode**  <br>*optional*|Specifies the status of the direct debit in code form.|enum (Active, Inactive)|
|**MandateIdentification**  <br>*required*|Direct Debit reference. For AUDDIS service users provide Core Reference. For non AUDDIS service users provide Core reference if possible or last used reference.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*required*|Name of Service User  <br>**Length** : `1 - 70`|string|
|**PreviousPaymentAmount**  <br>*optional*|The amount of the most recent direct debit collection.|[PreviousPaymentAmount](#directdebit-previouspaymentamount)|
|**PreviousPaymentDateTime**  <br>*optional*|Date of most recent direct debit collection. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|

<a name="directdebit-previouspaymentamount"></a>
**PreviousPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getproducts"></a>
### Get Products
```
GET /products
```


#### Description
Get Products


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Products successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Products GET response](#products-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="products-get-response"></a>
**Products GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Product**  <br>*optional*|Product|< [Product](#product) > array|

<a name="product"></a>
**Product**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**ProductIdentifier**  <br>*required*|Identifier within the parent organisation for the product. Must be unique in the organisation.|string|
|**ProductName**  <br>*optional*|The name of the product used for marketing purposes from a customer perspective. I.e. what the customer would recognise.|string|
|**ProductType**  <br>*required*|Descriptive code for the product category.|enum (BCA, PCA)|
|**SecondaryProductIdentifier**  <br>*optional*|Identifier within the parent organisation for the product. Must be unique in the organisation.|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="getstandingorders"></a>
### Get Standing Orders
```
GET /standing-orders
```


#### Description
Get Standing Orders


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Standing Orders successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Standing Orders GET response](#standing-orders-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="standing-orders-get-response"></a>
**Standing Orders GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**StandingOrder**  <br>*optional*|StandingOrder|< [StandingOrder](#standingorder) > array|

<a name="standingorder"></a>
**StandingOrder**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*optional*|Provides the details to identify the beneficiary account.|[CreditorAccount](#standingorder-creditoraccount)|
|**FinalPaymentAmount**  <br>*optional*|The amount of the final Standing Order|[FinalPaymentAmount](#standingorder-finalpaymentamount)|
|**FinalPaymentDateTime**  <br>*optional*|The date on which the final payment for a Standing Order schedule will be made. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**FirstPaymentAmount**  <br>*optional*|The amount of the first Standing Order|[FirstPaymentAmount](#standingorder-firstpaymentamount)|
|**FirstPaymentDateTime**  <br>*optional*|The date on which the first payment for a Standing Order schedule will be made. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**Frequency**  <br>*required*|EvryDay - Every day<br>EvryWorkgDay - Every working day<br>IntrvlWkDay - An interval specified in weeks (01 to 09), and the day within the week (01 to 07)<br>WkInMnthDay - A monthly interval, specifying the week of the month (01 to 05) and day within the week (01 to 07)<br>IntrvlMnthDay - An interval specified in months (between 01 to 06, 12, 24), specifying the day within the month (-5 to -1, 1 to 31)<br>QtrDay - Quarterly (either ENGLISH, SCOTTISH, or RECEIVED)<br>Patterns: <br>EvryDay (ScheduleCode)<br>EvryWorkgDay (ScheduleCode)<br>IntrvlWkDay:IntervalInWeeks:DayInWeek (ScheduleCode + IntervalInWeeks + DayInWeek)<br>WkInMnthDay:WeekInMonth:DayInWeek (ScheduleCode + WeekInMonth + DayInWeek)<br>IntrvlMnthDay:IntervalInMonths:DayInMonth (ScheduleCode + IntervalInMonths + DayInMonth)<br>QtrDay: + either (ENGLISH, SCOTTISH or RECEIVED) ScheduleCode + QuarterDay<br><br>The regular expression for this element combines five smaller versions for each permitted pattern. To aid legibility - the components are presented individually here:<br>EvryDay<br>EvryWorkgDay<br>IntrvlWkDay:0[1-9]:0[1-7]<br>WkInMnthDay:0[1-5]:0[1-7]<br>IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01])<br>QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED)  <br>**Pattern** : `"^(EvryDay)$\|^(EvryWorkgDay)$\|^(IntrvlWkDay:0[1-9]:0[1-7])$\|^(WkInMnthDay:0[1-5]:0[1-7])$\|^(IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))$\|^(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED))$"`|string|
|**NextPaymentAmount**  <br>*required*|The amount of the next Standing Order|[NextPaymentAmount](#standingorder-nextpaymentamount)|
|**NextPaymentDateTime**  <br>*required*|The date on which the next payment for a Standing Order schedule will be made. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**Reference**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#standingorder-servicer)|
|**StandingOrderId**  <br>*optional*|A unique and immutable identifier used to identify the standing order resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|

<a name="standingorder-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|The data dictionary is the correct version in these four instances.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (IBAN, SortCodeAccountNumber)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="standingorder-finalpaymentamount"></a>
**FinalPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="standingorder-firstpaymentamount"></a>
**FirstPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="standingorder-nextpaymentamount"></a>
**NextPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="standingorder-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="gettransactions"></a>
### Get Transactions
```
GET /transactions
```


#### Description
Get Transactions


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Header**|**Authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP. <br>All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: <br>Sun, 10 Sep 2017 19:43:31 UTC|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Query**|**fromBookingDateTime**  <br>*optional*|The UTC ISO 8601 Date Time to filter transactions FROM <br>NB Time component is optional - set to 00:00:00 for just Date.  <br>The parameter must NOT have a timezone set|string (date-time)|
|**Query**|**toBookingDateTime**  <br>*optional*|The UTC ISO 8601 Date Time to filter transactions TO <br>NB Time component is optional - set to 00:00:00 for just Date.  <br>The parameter must NOT have a timezone set|string (date-time)|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Transactions successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : DO NOT USE. Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account Transactions GET response](#account-transactions-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**405**|Method Not Allowed|No Content|
|**406**|Not Acceptable|No Content|
|**429**|Too Many Requests  <br>**Headers** :   <br>`Retry-After` (integer) : Number in seconds to wait.|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-transactions-get-response"></a>
**Account Transactions GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data|[Data](#data)|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[MetaData](#metadata)|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**Transaction**  <br>*optional*|Transaction|< [Transaction](#data-transaction) > array|

<a name="data-transaction"></a>
**Transaction**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**AddressLine**  <br>*optional*|Information that locates and identifies a specific address, as defined by postal services, that is presented in free format text.  <br>**Length** : `1 - 70`|string|
|**Amount**  <br>*required*|Amount of money in the cash entry.|[Amount](#data-transaction-amount)|
|**Balance**  <br>*optional*|Set of elements used to define the balance as a numerical representation of the net increases and decreases in an account after a transaction entry is applied to the account.|[Balance](#data-transaction-balance)|
|**BankTransactionCode**  <br>*optional*|Set of elements used to fully identify the type of underlying transaction resulting in an entry.|[BankTransactionCode](#data-transaction-banktransactioncode)|
|**BookingDateTime**  <br>*required*|Date and time when a transaction entry is posted to an account on the account servicer's books. Usage: Booking date is the expected booking date, unless the status is booked, in which case it is the actual booking date. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the transaction is a credit or a debit entry.|enum (Credit, Debit)|
|**MerchantDetails**  <br>*optional*|Details of the merchant involved in the transaction.|[MerchantDetails](#data-transaction-merchantdetails)|
|**ProprietaryBankTransactionCode**  <br>*optional*|Set of elements to fully identify a proprietary bank transaction code.|[ProprietaryBankTransactionCode](#data-transaction-proprietarybanktransactioncode)|
|**Status**  <br>*required*|Status of a transaction entry on the books of the account servicer.|enum (Booked, Pending)|
|**TransactionId**  <br>*optional*|Unique identifier for the transaction within an servicing institution. This identifier is both unique and immutable.  <br>**Length** : `1 - 40`|string|
|**TransactionInformation**  <br>*optional*|Further details of the transaction. This is the transaction narrative, which is unstructured text.  <br>**Length** : `1 - 500`|string|
|**TransactionReference**  <br>*optional*|Unique reference for the transaction. This reference is optionally populated, and may as an example be the FPID in the Faster Payments context.  <br>**Length** : `1 - 35`|string|
|**ValueDateTime**  <br>*optional*|Date and time at which assets become available to the account owner in case of a credit entry, or cease to be available to the account owner in case of a debit entry.  Usage: If entry status is pending and value date is present, then the value date refers to an expected/requested value date. For entries subject to availability/float and for which availability information is provided, the value date must not be used. In this case the availability component identifies the  number of availability days. <br>All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|

<a name="data-transaction-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="data-transaction-balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|Amount of money of the cash balance after a transaction entry is applied to the account..|[Amount](#data-transaction-balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, Expected, ForwardAvailable, Information, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked)|

<a name="data-transaction-balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3,3}$"`|string|

<a name="data-transaction-banktransactioncode"></a>
**BankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Specifies the family within a domain.|string|
|**SubCode**  <br>*required*|Specifies the sub-product family within a specific family.|string|

<a name="data-transaction-merchantdetails"></a>
**MerchantDetails**

|Name|Description|Schema|
|---|---|---|
|**MerchantCategoryCode**  <br>*optional*|Category code conform to ISO 18245, related to the type of services or goods the merchant provides for the transaction.  <br>**Length** : `3 - 4`|string|
|**MerchantName**  <br>*optional*|Name by which the merchant is known.  <br>**Length** : `1 - 350`|string|

<a name="data-transaction-proprietarybanktransactioncode"></a>
**ProprietaryBankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Proprietary bank transaction code to identify the underlying transaction.  <br>**Length** : `1 - 35`|string|
|**Issuer**  <br>*optional*|Identification of the issuer of the proprietary bank transaction code.  <br>**Length** : `1 - 35`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**First**  <br>*optional*|string (uri)|
|**Last**  <br>*optional*|string (uri)|
|**Next**  <br>*optional*|string (uri)|
|**Prev**  <br>*optional*|string (uri)|
|**Self**  <br>*required*|string (uri)|

<a name="metadata"></a>
**MetaData**

|Name|Description|Schema|
|---|---|---|
|**FirstAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**LastAvailableDateTime**  <br>*optional*|All dates in the JSON payloads are represented in ISO 8601 date-time format. <br>All date-time fields in responses must include the timezone. An example is below:<br>2017-04-05T10:43:07+00:00|string (date-time)|
|**TotalPages**  <br>*optional*||integer (int32)|


#### Produces

* `application/json; charset=utf-8`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|






<a name="securityscheme"></a>
## Security

<a name="tppoauth2security"></a>
### TPPOAuth2Security
TPP client credential authorisation flow with the ASPSP

*Type* : oauth2  
*Flow* : application  
*Token URL* : https://authserver.example/token


|Name|Description|
|---|---|
|accounts|Ability to read Accounts information|


<a name="psuoauth2security"></a>
### PSUOAuth2Security
OAuth flow, it is required when the PSU needs to perform SCA with the ASPSP when a TPP wants to access an ASPSP resource owned by the PSU

*Type* : oauth2  
*Flow* : accessCode  
*Token URL* : https://authserver.example/authorization  
*Token URL* : https://authserver.example/token


|Name|Description|
|---|---|
|accounts|Ability to read Accounts information|



