# Account Information APIs


<a name="overview"></a>
## Overview
Swagger specification for Account Information APIs


### Version information
*Version* : v1.0-rc4


### Contact information
*Contact* : Craig Greenhouse  
*Contact Email* : Craig.Greenhouse@openbanking.org.uk


### License information
*License* : open-licence  
*License URL* : https://www.openbanking.org.uk/open-licence  
*Terms of service* : https://www.openbanking.org.uk/terms


### URI scheme
*BasePath* : /open-banking  
*Schemes* : HTTPS


### Produces

* `application/json`




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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Header**|**x-jws-signature**  <br>*required*|Header containig a detached JWS signature of the body of the payload.|string|


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
|**ExpirationDateTime**  <br>*optional*|Specified date and time the permissions will expire. If this is not populated, the permissions will be open ended.|string (date-time)|
|**Permissions**  <br>*required*|Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.|< enum (ReadAccountsBasic, ReadAccountsDetail, ReadBalances, ReadBeneficiariesBasic, ReadBeneficiariesDetail, ReadDirectDebits, ReadProducts, ReadStandingOrdersBasic, ReadStandingOrdersDetail, ReadTransactionsBasic, ReadTransactionsCredits, ReadTransactionsDebits, ReadTransactionsDetail) > array|
|**TransactionFromDateTime**  <br>*optional*|Specified start date and time for the transaction query period. If this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction.|string (date-time)|
|**TransactionToDateTime**  <br>*optional*|Specified end date and time for the transaction query period. If this is not populated, the end date will be open ended, and data will be returned to the latest available transaction.|string (date-time)|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**201**|Account Request resource successfully created  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containig a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account Request POST response](#account-request-post-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-request-post-response"></a>
**Account Request POST response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||[Data](#data)|
|**Risk**  <br>*required*|The Risk payload is sent by the initiating party to the ASPSP. It is used to specify additional details for risk scoring for Account Info.|object|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**AccountRequestId**  <br>*required*|Unique identification as assigned to identify the account request resource.  <br>**Length** : `1 - 128`|string|
|**CreationDateTime**  <br>*required*|Date and time at which the resource was created.|string (date-time)|
|**ExpirationDateTime**  <br>*optional*|Specified date and time the permissions will expire. If this is not populated, the permissions will be open ended.|string (date-time)|
|**Permissions**  <br>*required*|Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.|< enum (ReadAccountsBasic, ReadAccountsDetail, ReadBalances, ReadBeneficiariesBasic, ReadBeneficiariesDetail, ReadDirectDebits, ReadProducts, ReadStandingOrdersBasic, ReadStandingOrdersDetail, ReadTransactionsBasic, ReadTransactionsCredits, ReadTransactionsDebits, ReadTransactionsDetail) > array|
|**Status**  <br>*optional*|Specifies the status of the account request resource.|enum (Authorised, AwaitingAuthorisation, Rejected, Revoked)|
|**TransactionFromDateTime**  <br>*optional*|Specified start date and time for the transaction query period. If this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction.|string (date-time)|
|**TransactionToDateTime**  <br>*optional*|Specified end date and time for the transaction query period. If this is not populated, the end date will be open ended, and data will be returned to the latest available transaction.|string (date-time)|


#### Consumes

* `application/json`


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountRequestId**  <br>*required*|Unique identification as assigned by the ASPSP to uniquely identify the account request resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Request resource successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account Request GET response](#account-request-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-request-get-response"></a>
**Account Request GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||[Data](#data)|
|**Risk**  <br>*required*|The Risk payload is sent by the initiating party to the ASPSP. It is used to specify additional details for risk scoring for Account Info.|object|

<a name="data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**AccountRequestId**  <br>*required*|Unique identification as assigned to identify the account request resource.  <br>**Length** : `1 - 128`|string|
|**CreationDateTime**  <br>*required*|Date and time at which the resource was created.|string (date-time)|
|**ExpirationDateTime**  <br>*optional*|Specified date and time the permissions will expire. If this is not populated, the permissions will be open ended.|string (date-time)|
|**Permissions**  <br>*required*|Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.|< enum (ReadAccountsBasic, ReadAccountsDetail, ReadBalances, ReadBeneficiariesBasic, ReadBeneficiariesDetail, ReadDirectDebits, ReadProducts, ReadStandingOrdersBasic, ReadStandingOrdersDetail, ReadTransactionsBasic, ReadTransactionsCredits, ReadTransactionsDebits, ReadTransactionsDetail) > array|
|**Status**  <br>*optional*|Specifies the status of the account request resource.|enum (Authorised, AwaitingAuthorisation, Rejected, Revoked)|
|**TransactionFromDateTime**  <br>*optional*|Specified start date and time for the transaction query period. If this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction.|string (date-time)|
|**TransactionToDateTime**  <br>*optional*|Specified end date and time for the transaction query period. If this is not populated, the end date will be open ended, and data will be returned to the latest available transaction.|string (date-time)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[TPPOAuth2Security](#tppoauth2security)**|tpp_client_credential|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Path**|**AccountRequestId**  <br>*required*|Unique identification as assigned by the ASPSP to uniquely identify the account request resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**204**|Account Request resource successfully deleted  <br>**Headers** :   <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|No Content|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Accounts successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account GET response](#account-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-get-response"></a>
**Account GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Account](#account) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

<a name="account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*optional*|Provides the details to identify an account.|[Account](#account-account)|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Currency**  <br>*required*|Identification of the currency in which the account is held.  Usage: Currency should only be used in case one and the same account number covers several currencies and the initiating party needs to identify which currency needs to be used for settlement on the account.  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**Nickname**  <br>*optional*|The nickname of the account, assigned by the account owner in order to provide an additional means of identification of the account.  <br>**Length** : `1 - 70`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account.|[Servicer](#account-servicer)|

<a name="account-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Identification assigned by an institution to identify an account. This identification is known by the account owner.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="account-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account resource successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account GET response](#account-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-get-response"></a>
**Account GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Account](#account) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

<a name="account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*optional*|Provides the details to identify an account.|[Account](#account-account)|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Currency**  <br>*required*|Identification of the currency in which the account is held.  Usage: Currency should only be used in case one and the same account number covers several currencies and the initiating party needs to identify which currency needs to be used for settlement on the account.  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**Nickname**  <br>*optional*|The nickname of the account, assigned by the account owner in order to provide an additional means of identification of the account.  <br>**Length** : `1 - 70`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account.|[Servicer](#account-servicer)|

<a name="account-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Identification assigned by an institution to identify an account. This identification is known by the account owner.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="account-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Beneficiaries successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Balances GET response](#balances-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="balances-get-response"></a>
**Balances GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Balance](#balance) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

<a name="balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Amount**  <br>*required*|Amount of money of the cash balance.|[Amount](#balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**CreditLine**  <br>*optional*||[CreditLine](#balance-creditline)|
|**DateTime**  <br>*required*|Indicates the date (and time) of the balance.|string (date-time)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, Expected, ForwardAvailable, Information, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked)|

<a name="balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

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
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Beneficiaries  successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Beneficiaries GET response](#beneficiaries-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="beneficiaries-get-response"></a>
**Beneficiaries GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Beneficiary](#beneficiary) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

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
|**Identification**  <br>*required*|Identification assigned by an institution to identify an account. This identification is known by the account owner.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="beneficiary-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Direct Debits successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account GET response](#account-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-get-response"></a>
**Account GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Direct Debit](#direct-debit) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

<a name="direct-debit"></a>
**Direct Debit**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitId**  <br>*optional*|A unique and immutable identifier used to identify the direct debit resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitStatusCode**  <br>*optional*|Specifies the status of the direct debit in code form.|enum (Active, Inactive)|
|**MandateIdentification**  <br>*required*|Direct Debit reference. For AUDDIS service users provide Core Reference. For non AUDDIS service users provide Core reference if possible or last used reference.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*required*|Name of Service User  <br>**Length** : `1 - 70`|string|
|**PreviousPaymentAmount**  <br>*optional*|The amount of the most recent direct debit collection.|[PreviousPaymentAmount](#direct-debit-previouspaymentamount)|
|**PreviousPaymentDateTime**  <br>*optional*|Date of most recent direct debit collection.|string (date-time)|

<a name="direct-debit-previouspaymentamount"></a>
**PreviousPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Product successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Product GET response](#product-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="product-get-response"></a>
**Product GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Product](#product) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

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
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Standing Orders successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Standing Orders GET response](#standing-orders-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="standing-orders-get-response"></a>
**Standing Orders GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Standing Order](#standing-order) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

<a name="standing-order"></a>
**Standing Order**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|The date on which the first payment for a Standing Order schedule will be made.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*optional*|Provides the details to identify the beneficiary account.|[CreditorAccount](#standing-order-creditoraccount)|
|**FinalPaymentAmount**  <br>*optional*|The amount of the final Standing Order|[FinalPaymentAmount](#standing-order-finalpaymentamount)|
|**FinalPaymentDateTime**  <br>*optional*|The date on which the final payment for a Standing Order schedule will be made.|string (date-time)|
|**FirstPaymentAmount**  <br>*optional*|The amount of the first Standing Order|[FirstPaymentAmount](#standing-order-firstpaymentamount)|
|**FirstPaymentDateTime**  <br>*optional*|The date on which the first payment for a Standing Order schedule will be made.|string (date-time)|
|**Frequency**  <br>*required*|EvryWorkgDay - PSC070 IntrvlWkDay:PSC110:PSC080 (PSC070 code + PSC110 + PSC080) WkInMnthDay:PSC100:PSC080 (PSC070 code + PSC100 + PSC080) IntrvlMnthDay:PSC120:PSC090 (PSC070 code + PSC120 + PSC090) QtrDay: + either (ENGLISH, SCOTTISH or RECEIVED) PSC070 + PSC130 The following response codes may be generated by this data element: PSC070: T221 - Schedule code must be a valid enumeration value. PSC070: T245 - Must be provided for standing order only. PSC080: T222 - Day in week must be within defined bounds (range 1 to 5). PSC080: T229 - Must be present if Schedule Code = IntrvlWkDay. PSC080: T231 - Must be present if Schedule Code = WkInMnthDay. PSC090: T223 - Day in month must be within defined bounds (range -5 to 31 excluding: 0 & 00). PSC090: T233 - Must be present if Schedule Code = IntrvlMnthDay. PSC100: T224 - Week in month must be within defined bounds (range 1 to 5). PSC100: T232 - Must be present if Schedule Code = WkInMnthDay. PSC110: T225 - Interval in weeks must be within defined bounds (range 1 to 9). PSC110: T230 - Must be present if Schedule Code = IntrvlWkDay. PSC120: T226 - Interval in months must be a valid enumeration value (range 1 to 6, 12 and 24). PSC120: T234 - Must be present if Schedule Code = IntrvlMnthDay. PSC130: T227 - Quarter Day must be a valid enumeration value. PSC130: T235 - Must be present if Schedule Code = QtrDay. The regular expression for this element combines five smaller versions for each permitted pattern. To aid legibility - the components are presented individually here: EvryWorkgDay IntrvlWkDay:0[1-9]:0[1-5] WkInMnthDay:0[1-5]:0[1-5] IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]) QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED) Mandatory/Conditional/Optional/Parent/Leaf: OL Type: 35 char string Regular Expression(s): (EvryWorkgDay)\|(IntrvlWkDay:0[1-9]:0[1-5])\|(WkInMnthDay:0[1-5]:0[1-5])\|(IntrvlMnthDay:(0[1- 6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))\|(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED))  <br>**Pattern** : `"^((EvryWorkgDay)\|(IntrvlWkDay:0[1-9]:0[1-5])\|(WkInMnthDay:0[1-5]:0[1-5])\|(IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))\|(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED)))$"`|string|
|**NextPaymentAmount**  <br>*required*|The amount of the next Standing Order|[NextPaymentAmount](#standing-order-nextpaymentamount)|
|**NextPaymentDateTime**  <br>*required*|The date on which the next payment for a Standing Order schedule will be made.|string (date-time)|
|**Reference**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#standing-order-servicer)|
|**StandingOrderId**  <br>*optional*|A unique and immutable identifier used to identify the standing order resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|

<a name="standing-order-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Identification assigned by an institution to identify an account. This identification is known by the account owner.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="standing-order-finalpaymentamount"></a>
**FinalPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="standing-order-firstpaymentamount"></a>
**FirstPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="standing-order-nextpaymentamount"></a>
**NextPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="standing-order-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|
|**Query**|**fromBookingDateTime**  <br>*optional*|The UTC ISO 8601 Date Time to filter transactions FROM - NB Time component is optional - set to 00:00:00 for just Date|string (date-time)|
|**Query**|**toBookingDateTime**  <br>*optional*|The UTC ISO 8601 Date Time to filter transactions TO - NB Time component is optional - set to 00:00:00 for just Date|string (date-time)|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Transactions successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account Transactions GET response](#account-transactions-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-transactions-get-response"></a>
**Account Transactions GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data Section of the Payload|< [Data](#accounts-accountid-transactions-get-data) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta](#meta)|

<a name="accounts-accountid-transactions-get-data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**AddressLine**  <br>*optional*|Information that locates and identifies a specific address, as defined by postal services, that is presented in free format text.  <br>**Length** : `1 - 70`|string|
|**Amount**  <br>*required*|Amount of money in the cash entry.|[Amount](#accounts-accountid-transactions-get-data-amount)|
|**Balance**  <br>*optional*|Set of elements used to define the balance as a numerical representation of the net increases and decreases in an account after a transaction entry is applied to the account.|[Balance](#accounts-accountid-transactions-get-data-balance)|
|**BankTransactionCode**  <br>*optional*|Set of elements used to fully identify the type of underlying transaction resulting in an entry.|[BankTransactionCode](#accounts-accountid-transactions-get-data-banktransactioncode)|
|**BookingDateTime**  <br>*required*|Date and time when a transaction entry is posted to an account on the account servicer's books. Usage: Booking date is the expected booking date, unless the status is booked, in which case it is the actual booking date.|string (date-time)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the transaction is a credit or a debit entry.|enum (Credit, Debit)|
|**MerchantDetails**  <br>*optional*|Details of the merchant involved in the transaction.|[MerchantDetails](#accounts-accountid-transactions-get-data-merchantdetails)|
|**ProprietaryBankTransactionCode**  <br>*optional*|Set of elements to fully identify a proprietary bank transaction code.|[ProprietaryBankTransactionCode](#accounts-accountid-transactions-get-data-proprietarybanktransactioncode)|
|**Status**  <br>*required*|Status of a transaction entry on the books of the account servicer.|enum (Booked, Pending)|
|**TransactionId**  <br>*optional*|Unique identifier for the transaction within an servicing institution. This identifier is both unique and immutable.  <br>**Length** : `1 - 40`|string|
|**TransactionInformation**  <br>*optional*|Further details of the transaction. This is the transaction narrative, which is unstructured text.  <br>**Length** : `1 - 500`|string|
|**TransactionReference**  <br>*optional*|Unique reference for the transaction. This reference is optionally populated, and may as an example be the FPID in the Faster Payments context.  <br>**Length** : `1 - 35`|string|
|**ValueDateTime**  <br>*optional*|Date and time at which assets become available to the account owner in case of a credit entry, or cease to be available to the account owner in case of a debit entry.  Usage: If entry status is pending and value date is present, then the value date refers to an expected/requested value date. For entries subject to availability/float and for which availability information is provided, the value date must not be used. In this case the availability component identifies the  number of availability days.|string (date-time)|

<a name="accounts-accountid-transactions-get-data-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-transactions-get-data-balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|Amount of money of the cash balance after a transaction entry is applied to the account..|[Amount](#accounts-accountid-transactions-get-data-balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, Expected, ForwardAvailable, Information, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked)|

<a name="accounts-accountid-transactions-get-data-balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-transactions-get-data-banktransactioncode"></a>
**BankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Specifies the family within a domain.|string|
|**SubCode**  <br>*required*|Specifies the sub-product family within a specific family.|string|

<a name="accounts-accountid-transactions-get-data-merchantdetails"></a>
**MerchantDetails**

|Name|Description|Schema|
|---|---|---|
|**MerchantCategoryCode**  <br>*optional*|Category code conform to ISO 18245, related to the type of services or goods the merchant provides for the transaction.  <br>**Length** : `3 - 4`|string|
|**MerchantName**  <br>*optional*|Name by which the merchant is known.  <br>**Length** : `1 - 350`|string|

<a name="accounts-accountid-transactions-get-data-proprietarybanktransactioncode"></a>
**ProprietaryBankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Proprietary bank transaction code to identify the underlying transaction.  <br>**Length** : `1 - 35`|string|
|**Issuer**  <br>*optional*|Identification of the issuer of the proprietary bank transaction code.  <br>**Length** : `1 - 35`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta"></a>
**Meta**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Balances successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Balances GET response](#balances-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="balances-get-response"></a>
**Balances GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Balance](#balance) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

<a name="balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Amount**  <br>*required*|Amount of money of the cash balance.|[Amount](#balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**CreditLine**  <br>*optional*||[CreditLine](#balance-creditline)|
|**DateTime**  <br>*required*|Indicates the date (and time) of the balance.|string (date-time)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, Expected, ForwardAvailable, Information, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked)|

<a name="balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

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
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Beneficiaries successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Beneficiaries GET response](#beneficiaries-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="beneficiaries-get-response"></a>
**Beneficiaries GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Beneficiary](#beneficiary) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

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
|**Identification**  <br>*required*|Identification assigned by an institution to identify an account. This identification is known by the account owner.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="beneficiary-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Direct Debits successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account GET response](#account-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-get-response"></a>
**Account GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Direct Debit](#direct-debit) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

<a name="direct-debit"></a>
**Direct Debit**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitId**  <br>*optional*|A unique and immutable identifier used to identify the direct debit resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitStatusCode**  <br>*optional*|Specifies the status of the direct debit in code form.|enum (Active, Inactive)|
|**MandateIdentification**  <br>*required*|Direct Debit reference. For AUDDIS service users provide Core Reference. For non AUDDIS service users provide Core reference if possible or last used reference.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*required*|Name of Service User  <br>**Length** : `1 - 70`|string|
|**PreviousPaymentAmount**  <br>*optional*|The amount of the most recent direct debit collection.|[PreviousPaymentAmount](#direct-debit-previouspaymentamount)|
|**PreviousPaymentDateTime**  <br>*optional*|Date of most recent direct debit collection.|string (date-time)|

<a name="direct-debit-previouspaymentamount"></a>
**PreviousPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Products successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Products GET response](#products-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="products-get-response"></a>
**Products GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Product](#product) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

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
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Standing Orders successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Standing Orders GET response](#standing-orders-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="standing-orders-get-response"></a>
**Standing Orders GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*||< [Standing Order](#standing-order) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta Data](#meta-data)|

<a name="standing-order"></a>
**Standing Order**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|The date on which the first payment for a Standing Order schedule will be made.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*optional*|Provides the details to identify the beneficiary account.|[CreditorAccount](#standing-order-creditoraccount)|
|**FinalPaymentAmount**  <br>*optional*|The amount of the final Standing Order|[FinalPaymentAmount](#standing-order-finalpaymentamount)|
|**FinalPaymentDateTime**  <br>*optional*|The date on which the final payment for a Standing Order schedule will be made.|string (date-time)|
|**FirstPaymentAmount**  <br>*optional*|The amount of the first Standing Order|[FirstPaymentAmount](#standing-order-firstpaymentamount)|
|**FirstPaymentDateTime**  <br>*optional*|The date on which the first payment for a Standing Order schedule will be made.|string (date-time)|
|**Frequency**  <br>*required*|EvryWorkgDay - PSC070 IntrvlWkDay:PSC110:PSC080 (PSC070 code + PSC110 + PSC080) WkInMnthDay:PSC100:PSC080 (PSC070 code + PSC100 + PSC080) IntrvlMnthDay:PSC120:PSC090 (PSC070 code + PSC120 + PSC090) QtrDay: + either (ENGLISH, SCOTTISH or RECEIVED) PSC070 + PSC130 The following response codes may be generated by this data element: PSC070: T221 - Schedule code must be a valid enumeration value. PSC070: T245 - Must be provided for standing order only. PSC080: T222 - Day in week must be within defined bounds (range 1 to 5). PSC080: T229 - Must be present if Schedule Code = IntrvlWkDay. PSC080: T231 - Must be present if Schedule Code = WkInMnthDay. PSC090: T223 - Day in month must be within defined bounds (range -5 to 31 excluding: 0 & 00). PSC090: T233 - Must be present if Schedule Code = IntrvlMnthDay. PSC100: T224 - Week in month must be within defined bounds (range 1 to 5). PSC100: T232 - Must be present if Schedule Code = WkInMnthDay. PSC110: T225 - Interval in weeks must be within defined bounds (range 1 to 9). PSC110: T230 - Must be present if Schedule Code = IntrvlWkDay. PSC120: T226 - Interval in months must be a valid enumeration value (range 1 to 6, 12 and 24). PSC120: T234 - Must be present if Schedule Code = IntrvlMnthDay. PSC130: T227 - Quarter Day must be a valid enumeration value. PSC130: T235 - Must be present if Schedule Code = QtrDay. The regular expression for this element combines five smaller versions for each permitted pattern. To aid legibility - the components are presented individually here: EvryWorkgDay IntrvlWkDay:0[1-9]:0[1-5] WkInMnthDay:0[1-5]:0[1-5] IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]) QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED) Mandatory/Conditional/Optional/Parent/Leaf: OL Type: 35 char string Regular Expression(s): (EvryWorkgDay)\|(IntrvlWkDay:0[1-9]:0[1-5])\|(WkInMnthDay:0[1-5]:0[1-5])\|(IntrvlMnthDay:(0[1- 6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))\|(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED))  <br>**Pattern** : `"^((EvryWorkgDay)\|(IntrvlWkDay:0[1-9]:0[1-5])\|(WkInMnthDay:0[1-5]:0[1-5])\|(IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))\|(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED)))$"`|string|
|**NextPaymentAmount**  <br>*required*|The amount of the next Standing Order|[NextPaymentAmount](#standing-order-nextpaymentamount)|
|**NextPaymentDateTime**  <br>*required*|The date on which the next payment for a Standing Order schedule will be made.|string (date-time)|
|**Reference**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Servicer**  <br>*optional*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#standing-order-servicer)|
|**StandingOrderId**  <br>*optional*|A unique and immutable identifier used to identify the standing order resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|

<a name="standing-order-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Identification assigned by an institution to identify an account. This identification is known by the account owner.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="standing-order-finalpaymentamount"></a>
**FinalPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="standing-order-firstpaymentamount"></a>
**FirstPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="standing-order-nextpaymentamount"></a>
**NextPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="standing-order-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta-data"></a>
**Meta Data**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
|**Header**|**authorization**  <br>*required*|An Authorisation Token as per https://tools.ietf.org/html/rfc6750|string|
|**Header**|**x-fapi-customer-ip-address**  <br>*optional*|The PSU's IP address if the PSU is currently logged in with the TPP.|string|
|**Header**|**x-fapi-customer-last-logged-time**  <br>*optional*|The time when the PSU last logged in with the TPP.|string|
|**Header**|**x-fapi-financial-id**  <br>*required*|The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.|string|
|**Header**|**x-fapi-interaction-id**  <br>*optional*|An RFC4122 UID used as a correlation id.|string|
|**Query**|**fromBookingDateTime**  <br>*optional*|The UTC ISO 8601 Date Time to filter transactions FROM - NB Time component is optional - set to 00:00:00 for just Date|string (date-time)|
|**Query**|**toBookingDateTime**  <br>*optional*|The UTC ISO 8601 Date Time to filter transactions TO - NB Time component is optional - set to 00:00:00 for just Date|string (date-time)|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Transactions successfully retrieved  <br>**Headers** :   <br>`x-jws-signature` (string) : Header containing a detached JWS signature of the body of the payload.  <br>`x-fapi-interaction-id` (string) : An RFC4122 UID used as a correlation id.|[Account Transactions GET response](#account-transactions-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**429**|Too Many Requests|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-transactions-get-response"></a>
**Account Transactions GET response**

|Name|Description|Schema|
|---|---|---|
|**Data**  <br>*required*|Data Section of the Payload|< [Data](#transactions-get-data) > array|
|**Links**  <br>*required*|Links relevant to the payload|[Links](#links)|
|**Meta**  <br>*required*|Meta Data relevant to the payload|[Meta](#meta)|

<a name="transactions-get-data"></a>
**Data**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**AddressLine**  <br>*optional*|Information that locates and identifies a specific address, as defined by postal services, that is presented in free format text.  <br>**Length** : `1 - 70`|string|
|**Amount**  <br>*required*|Amount of money in the cash entry.|[Amount](#transactions-get-data-amount)|
|**Balance**  <br>*optional*|Set of elements used to define the balance as a numerical representation of the net increases and decreases in an account after a transaction entry is applied to the account.|[Balance](#transactions-get-data-balance)|
|**BankTransactionCode**  <br>*optional*|Set of elements used to fully identify the type of underlying transaction resulting in an entry.|[BankTransactionCode](#transactions-get-data-banktransactioncode)|
|**BookingDateTime**  <br>*required*|Date and time when a transaction entry is posted to an account on the account servicer's books. Usage: Booking date is the expected booking date, unless the status is booked, in which case it is the actual booking date.|string (date-time)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the transaction is a credit or a debit entry.|enum (Credit, Debit)|
|**MerchantDetails**  <br>*optional*|Details of the merchant involved in the transaction.|[MerchantDetails](#transactions-get-data-merchantdetails)|
|**ProprietaryBankTransactionCode**  <br>*optional*|Set of elements to fully identify a proprietary bank transaction code.|[ProprietaryBankTransactionCode](#transactions-get-data-proprietarybanktransactioncode)|
|**Status**  <br>*required*|Status of a transaction entry on the books of the account servicer.|enum (Booked, Pending)|
|**TransactionId**  <br>*optional*|Unique identifier for the transaction within an servicing institution. This identifier is both unique and immutable.  <br>**Length** : `1 - 40`|string|
|**TransactionInformation**  <br>*optional*|Further details of the transaction. This is the transaction narrative, which is unstructured text.  <br>**Length** : `1 - 500`|string|
|**TransactionReference**  <br>*optional*|Unique reference for the transaction. This reference is optionally populated, and may as an example be the FPID in the Faster Payments context.  <br>**Length** : `1 - 35`|string|
|**ValueDateTime**  <br>*optional*|Date and time at which assets become available to the account owner in case of a credit entry, or cease to be available to the account owner in case of a debit entry.  Usage: If entry status is pending and value date is present, then the value date refers to an expected/requested value date. For entries subject to availability/float and for which availability information is provided, the value date must not be used. In this case the availability component identifies the  number of availability days.|string (date-time)|

<a name="transactions-get-data-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="transactions-get-data-balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|Amount of money of the cash balance after a transaction entry is applied to the account..|[Amount](#transactions-get-data-balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, Expected, ForwardAvailable, Information, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked)|

<a name="transactions-get-data-balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="transactions-get-data-banktransactioncode"></a>
**BankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Specifies the family within a domain.|string|
|**SubCode**  <br>*required*|Specifies the sub-product family within a specific family.|string|

<a name="transactions-get-data-merchantdetails"></a>
**MerchantDetails**

|Name|Description|Schema|
|---|---|---|
|**MerchantCategoryCode**  <br>*optional*|Category code conform to ISO 18245, related to the type of services or goods the merchant provides for the transaction.  <br>**Length** : `3 - 4`|string|
|**MerchantName**  <br>*optional*|Name by which the merchant is known.  <br>**Length** : `1 - 350`|string|

<a name="transactions-get-data-proprietarybanktransactioncode"></a>
**ProprietaryBankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Proprietary bank transaction code to identify the underlying transaction.  <br>**Length** : `1 - 35`|string|
|**Issuer**  <br>*optional*|Identification of the issuer of the proprietary bank transaction code.  <br>**Length** : `1 - 35`|string|

<a name="links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="meta"></a>
**Meta**

|Name|Schema|
|---|---|
|**total-pages**  <br>*optional*|integer (int32)|


#### Produces

* `application/json`


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
*Token URL* : /token


|Name|Description|
|---|---|
|tpp_client_credential|TPP Client Credential Scope|


<a name="psuoauth2security"></a>
### PSUOAuth2Security
OAuth flow, it is required when the PSU needs to perform SCA with the ASPSP when a TPP wants to access an ASPSP resource owned by the PSU

*Type* : oauth2  
*Flow* : accessCode  
*Token URL* : /authorization  
*Token URL* : /token


|Name|Description|
|---|---|
|accounts|Ability to read Accounts information|



