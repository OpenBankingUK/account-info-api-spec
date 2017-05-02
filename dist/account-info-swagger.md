# Account Information APIs


<a name="overview"></a>
## Overview
Swagger specification for Account Information APIs


### Version information
*Version* : v0.1


### Contact information
*Contact* : Claudio Viola  
*Contact Email* : claudio.viola@openbanking.org.uk


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


#### Body parameter
Create an Account Request

*Name* : body  
*Flags* : required


|Name|Description|Schema|
|---|---|---|
|**Permissions**  <br>*required*|Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.|< enum (ReadAccounts, ReadAccountsSensitive, ReadBalances, ReadBeneficiaries, ReadBeneficiariesSensitive, ReadDirectDebits, ReadStandingOrders, ReadStandingOrdersSensitive, ReadTransactions, ReadTransactionsCredits, ReadTransactionsDebits, ReadTransactionsSensitive, ReadProducts) > array|
|**PermissionsExpirationDateTime**  <br>*optional*|Specified date and time the permissions will expire. If this is not populated, the permissions will be open ended.|string (date-time)|
|**SelectedAccounts**  <br>*optional*|Provides account and servicer identification details for the account information request.|< [SelectedAccounts](#createaccountrequest-selectedaccounts) > array|
|**TransactionFromDateTime**  <br>*optional*|Specified start date and time for the transaction query period. If this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction.|string (date-time)|
|**TransactionToDateTime**  <br>*optional*|Specified end date and time for the transaction query period. If this is not populated, the end date will be open ended, and data will be returned to the latest available transaction.|string (date-time)|

<a name="createaccountrequest-selectedaccounts"></a>
**SelectedAccounts**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*required*||[Account](#account-requests-post-account)|
|**Servicer**  <br>*required*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#account-requests-post-servicer)|

<a name="account-requests-post-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*required*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="account-requests-post-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**201**|Account Request resource successfully created|[Account Request POST response](#account-request-post-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**409**|Conflict|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-request-post-response"></a>
**Account Request POST response**

|Name|Description|Schema|
|---|---|---|
|**AccountIds**  <br>*optional*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.|< string > array|
|**AccountRequestId**  <br>*required*|Unique identification as assigned to identify the account request resource.  <br>**Length** : `1 - 40`|string|
|**Permissions**  <br>*required*|Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.|< enum (ReadAccounts, ReadAccountsSensitive, ReadBalances, ReadBeneficiaries, ReadBeneficiariesSensitive, ReadDirectDebits, ReadStandingOrders, ReadStandingOrdersSensitive, ReadTransactions, ReadTransactionsCredits, ReadTransactionsDebits, ReadTransactionsSensitive, ReadProducts) > array|
|**PermissionsExpirationDateTime**  <br>*optional*|Specified date and time the permissions will expire. If this is not populated, the permissions will be open ended.|string (date-time)|
|**SelectedAccounts**  <br>*optional*|Provides account and servicer identification details for the account information request.|< [SelectedAccounts](#account-requests-post-selectedaccounts) > array|
|**Status**  <br>*optional*|Specifies the status of the account request resource in code form.|enum (AwaitingAuthorisation, Authenticated, Rejected)|
|**TransactionFromDateTime**  <br>*optional*|Specified start date and time for the transaction query period. If this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction.|string (date-time)|
|**TransactionToDateTime**  <br>*optional*|Specified end date and time for the transaction query period. If this is not populated, the end date will be open ended, and data will be returned to the latest available transaction.|string (date-time)|

<a name="account-requests-post-selectedaccounts"></a>
**SelectedAccounts**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*required*||[Account](#account-requests-post-selectedaccounts-account)|
|**Servicer**  <br>*required*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#account-requests-post-selectedaccounts-servicer)|

<a name="account-requests-post-selectedaccounts-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*required*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="account-requests-post-selectedaccounts-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|


#### Consumes

* `application/json`


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|account_requests:manage|


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
|**Path**|**AccountRequestId**  <br>*required*|Unique identification as assigned by the ASPSP to uniquely identify the account request resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Request resource successfully retrieved|[Account Request GET response](#account-request-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-request-get-response"></a>
**Account Request GET response**

|Name|Description|Schema|
|---|---|---|
|**AccountIds**  <br>*optional*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.|< string > array|
|**AccountRequestId**  <br>*optional*|Unique identification as assigned to identify the account request resource.  <br>**Length** : `1 - 40`|string|
|**Permissions**  <br>*required*|Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.|< enum (ReadAccounts, ReadAccountsSensitive, ReadBalances, ReadBeneficiaries, ReadBeneficiariesSensitive, ReadDirectDebits, ReadStandingOrders, ReadStandingOrdersSensitive, ReadTransactions, ReadTransactionsCredits, ReadTransactionsDebits, ReadTransactionsSensitive, ReadProducts) > array|
|**PermissionsExpirationDateTime**  <br>*optional*|Specified date and time the permissions will expire. If this is not populated, the permissions will be open ended.|string (date-time)|
|**SelectedAccounts**  <br>*optional*|Provides account and servicer identification details for the account information request.|< [SelectedAccounts](#account-requests-accountrequestid-get-selectedaccounts) > array|
|**Status**  <br>*optional*|Specifies the status of the account request resource in code form.|enum (AwaitingAuthorisation, Authenticated, Rejected)|
|**TransactionFromDateTime**  <br>*optional*|Specified start date and time for the transaction query period. If this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction.|string (date-time)|
|**TransactionToDateTime**  <br>*optional*|Specified end date and time for the transaction query period. If this is not populated, the end date will be open ended, and data will be returned to the latest available transaction.|string (date-time)|

<a name="account-requests-accountrequestid-get-selectedaccounts"></a>
**SelectedAccounts**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*required*||[Account](#account-requests-accountrequestid-get-selectedaccounts-account)|
|**Servicer**  <br>*required*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#account-requests-accountrequestid-get-selectedaccounts-servicer)|

<a name="account-requests-accountrequestid-get-selectedaccounts-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*required*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="account-requests-accountrequestid-get-selectedaccounts-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[TPPOAuth2Security](#tppoauth2security)**|tpp_client_credential|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|account_requests:manage|


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
|**Path**|**AccountRequestId**  <br>*required*|Unique identification as assigned by the ASPSP to uniquely identify the account request resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**204**|Account Request resource successfully deleted|No Content|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|account_requests:manage|


***

<a name="getaccounts"></a>
### Get Accounts
```
GET /accounts
```


#### Description
Get a list of accounts


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Accounts successfully retrieved|[Accounts GET response](#accounts-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="accounts-get-response"></a>
**Accounts GET response**

|Name|Schema|
|---|---|
|**Accounts**  <br>*required*|< [Accounts](#accounts-get-accounts) > array|
|**Links**  <br>*optional*|[Links](#accounts-get-links)|

<a name="accounts-get-accounts"></a>
**Accounts**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*required*|Provides the details to identify an account.|[Account](#accounts-get-accounts-account)|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Currency**  <br>*required*|Identification of the currency in which the account is held.  Usage: Currency should only be used in case one and the same account number covers several currencies and the initiating party needs to identify which currency needs to be used for settlement on the account.  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**Nickname**  <br>*optional*|The nickname of the account, assigned by the account owner in order to provide an additional means of identification of the account.  <br>**Length** : `1 - 70`|string|
|**Servicer**  <br>*required*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account.|[Servicer](#accounts-get-accounts-servicer)|

<a name="accounts-get-accounts-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*required*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="accounts-get-accounts-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|

<a name="accounts-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts:read|


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
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account resource successfully retrieved|[Account GET response](#account-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-get-response"></a>
**Account GET response**

|Name|Description|Schema|
|---|---|---|
|**Account**  <br>*required*|Provides the details to identify an account.|[Account](#accounts-accountid-get-account)|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Currency**  <br>*required*|Identification of the currency in which the account is held.  Usage: Currency should only be used in case one and the same account number covers several currencies and the initiating party needs to identify which currency needs to be used for settlement on the account.  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**Nickname**  <br>*optional*|The nickname of the account, assigned by the account owner in order to provide an additional means of identification of the account.  <br>**Length** : `1 - 70`|string|
|**Servicer**  <br>*required*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account.|[Servicer](#accounts-accountid-get-servicer)|

<a name="accounts-accountid-get-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*required*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="accounts-accountid-get-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts:read|


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
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Beneficiaries  successfully retrieved|[Balances GET response](#balances-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="balances-get-response"></a>
**Balances GET response**

|Name|Description|Schema|
|---|---|---|
|**Balances**  <br>*required*|Array of Balances|< [Balances](#accounts-accountid-balances-get-balances) > array|
|**Links**  <br>*optional*||[Links](#accounts-accountid-balances-get-links)|

<a name="accounts-accountid-balances-get-balances"></a>
**Balances**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Amount**  <br>*required*|Amount of money of the cash balance.|[Amount](#accounts-accountid-balances-get-balances-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**CreditLine**  <br>*optional*||[CreditLine](#accounts-accountid-balances-get-balances-creditline)|
|**Date**  <br>*optional*|Indicates the date (and time) of the balance.|[Date](#accounts-accountid-balances-get-balances-date)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, ForwardAvailable, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked, Expected)|

<a name="accounts-accountid-balances-get-balances-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-balances-get-balances-creditline"></a>
**CreditLine**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*optional*|Active Or Historic Currency Code and Amount|[Amount](#accounts-accountid-balances-get-balances-creditline-amount)|
|**Included**  <br>*required*|Indicates whether or not the credit line is included in the balance of the account. Usage: If not present, credit line is not included in the balance amount of the account.|boolean|
|**Type**  <br>*optional*|Limit type, in a coded form.|string|

<a name="accounts-accountid-balances-get-balances-creditline-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-balances-get-balances-date"></a>
**Date**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="accounts-accountid-balances-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|balances:read|


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
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Beneficiaries  successfully retrieved|[Beneficiaries GET response](#beneficiaries-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="beneficiaries-get-response"></a>
**Beneficiaries GET response**

|Name|Description|Schema|
|---|---|---|
|**Beneficiaries**  <br>*required*|Array of Beneficiaries|< [Beneficiaries](#accounts-accountid-beneficiaries-get-beneficiaries) > array|
|**Links**  <br>*optional*||[Links](#accounts-accountid-beneficiaries-get-links)|

<a name="accounts-accountid-beneficiaries-get-beneficiaries"></a>
**Beneficiaries**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**BeneficiaryId**  <br>*optional*|A unique and immutable identifier used to identify the beneficiary resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*required*||[CreditorAccount](#accounts-accountid-beneficiaries-get-beneficiaries-creditoraccount)|
|**CreditorReferenceInformation**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Servicer**  <br>*required*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#accounts-accountid-beneficiaries-get-beneficiaries-servicer)|

<a name="accounts-accountid-beneficiaries-get-beneficiaries-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*required*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="accounts-accountid-beneficiaries-get-beneficiaries-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|

<a name="accounts-accountid-beneficiaries-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|beneficiaries:read|


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
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Direct Debits successfully retrieved|[Direct Debits GET response](#direct-debits-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="direct-debits-get-response"></a>
**Direct Debits GET response**

|Name|Description|Schema|
|---|---|---|
|**DirectDebits**  <br>*required*|Array of Direct Debits|< [DirectDebits](#accounts-accountid-direct-debits-get-directdebits) > array|
|**Links**  <br>*optional*||[Links](#accounts-accountid-direct-debits-get-links)|

<a name="accounts-accountid-direct-debits-get-directdebits"></a>
**DirectDebits**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Currency**  <br>*optional*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**DirectDebitId**  <br>*optional*|A unique and immutable identifier used to identify the direct debit resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitStatusCode**  <br>*optional*|Specifies the status of the direct debit in code form.|enum (Active, Inactive)|
|**MandateIdentification**  <br>*required*|Direct Debit reference. For AUDDIS service users provide Core Reference. For non AUDDIS service users provide Core reference if possible or last used reference.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*required*|Name of Service User  <br>**Length** : `1 - 70`|string|
|**PreviousPaymentAmount**  <br>*optional*|The amount of the most recent direct debit collection.|[PreviousPaymentAmount](#accounts-accountid-direct-debits-get-directdebits-previouspaymentamount)|
|**PreviousPaymentDate**  <br>*optional*|Date of most recent direct debit collection.  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|

<a name="accounts-accountid-direct-debits-get-directdebits-previouspaymentamount"></a>
**PreviousPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-direct-debits-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|direct_debits:read|


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
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Product successfully retrieved|[Product GET response](#product-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="product-get-response"></a>
**Product GET response**

|Name|Description|Schema|
|---|---|---|
|**Links**  <br>*optional*||< [Links](#accounts-accountid-product-get-links) > array|
|**Product**  <br>*required*|Product|[Product](#accounts-accountid-product-get-product)|

<a name="accounts-accountid-product-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**href**  <br>*optional*|string (uri)|
|**method**  <br>*optional*|enum (GET)|
|**rel**  <br>*optional*|enum (self)|

<a name="accounts-accountid-product-get-product"></a>
**Product**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**ProductIdentifier**  <br>*required*|Identifier within the parent organisation for the product. Must be unique in the organisation.|string|
|**ProductName**  <br>*optional*|The name of the product used for marketing purposes from a customer perspective. I.e. what the customer would recognise.|string|
|**ProductType**  <br>*required*|Descriptive code for the product category.|enum (BCA, PCA)|
|**SecondaryProductIdentifier**  <br>*optional*|Identifier within the parent organisation for the product. Must be unique in the organisation.|string|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|products:read|


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
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Standing Orders successfully retrieved|[Standing Orders GET response](#standing-orders-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="standing-orders-get-response"></a>
**Standing Orders GET response**

|Name|Description|Schema|
|---|---|---|
|**Links**  <br>*optional*||[Links](#accounts-accountid-standing-orders-get-links)|
|**StandingOrders**  <br>*required*|Array of Standing Orders|< [StandingOrders](#accounts-accountid-standing-orders-get-standingorders) > array|

<a name="accounts-accountid-standing-orders-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="accounts-accountid-standing-orders-get-standingorders"></a>
**StandingOrders**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*required*|Provides the details to identify the beneficiary account.|[CreditorAccount](#accounts-accountid-standing-orders-get-standingorders-creditoraccount)|
|**CreditorReferenceInformation**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Currency**  <br>*required*|Identification of the currency of the standing order  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**FinalPaymentAmount**  <br>*optional*|The amount of the final Standing Order|[FinalPaymentAmount](#accounts-accountid-standing-orders-get-standingorders-finalpaymentamount)|
|**FinalPaymentDate**  <br>*optional*|The date on which the final payment for a Standing Order schedule will be made.  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**FirstPaymentAmount**  <br>*optional*|The amount of the first Standing Order|[FirstPaymentAmount](#accounts-accountid-standing-orders-get-standingorders-firstpaymentamount)|
|**FirstPaymentDate**  <br>*optional*|The date on which the first payment for a Standing Order schedule will be made.  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**Frequency**  <br>*required*|EvryWorkgDay - PSC070 IntrvlWkDay:PSC110:PSC080 (PSC070 code + PSC110 + PSC080) WkInMnthDay:PSC100:PSC080 (PSC070 code + PSC100 + PSC080) IntrvlMnthDay:PSC120:PSC090 (PSC070 code + PSC120 + PSC090) QtrDay: + either (ENGLISH, SCOTTISH or RECEIVED) PSC070 + PSC130 The following response codes may be generated by this data element: PSC070: T221 - Schedule code must be a valid enumeration value. PSC070: T245 - Must be provided for standing order only. PSC080: T222 - Day in week must be within defined bounds (range 1 to 5). PSC080: T229 - Must be present if Schedule Code = IntrvlWkDay. PSC080: T231 - Must be present if Schedule Code = WkInMnthDay. PSC090: T223 - Day in month must be within defined bounds (range -5 to 31 excluding: 0 & 00). PSC090: T233 - Must be present if Schedule Code = IntrvlMnthDay. PSC100: T224 - Week in month must be within defined bounds (range 1 to 5). PSC100: T232 - Must be present if Schedule Code = WkInMnthDay. PSC110: T225 - Interval in weeks must be within defined bounds (range 1 to 9). PSC110: T230 - Must be present if Schedule Code = IntrvlWkDay. PSC120: T226 - Interval in months must be a valid enumeration value (range 1 to 6, 12 and 24). PSC120: T234 - Must be present if Schedule Code = IntrvlMnthDay. PSC130: T227 - Quarter Day must be a valid enumeration value. PSC130: T235 - Must be present if Schedule Code = QtrDay. The regular expression for this element combines five smaller versions for each permitted pattern. To aid legibility - the components are presented individually here: EvryWorkgDay IntrvlWkDay:0[1-9]:0[1-5] WkInMnthDay:0[1-5]:0[1-5] IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]) QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED) Mandatory/Conditional/Optional/Parent/Leaf: OL Type: 35 char string Regular Expression(s): (EvryWorkgDay)\|(IntrvlWkDay:0[1-9]:0[1-5])\|(WkInMnthDay:0[1-5]:0[1-5])\|(IntrvlMnthDay:(0[1- 6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))\|(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED))  <br>**Pattern** : `"^((EvryWorkgDay)\|(IntrvlWkDay:0[1-9]:0[1-5])\|(WkInMnthDay:0[1-5]:0[1-5])\|(IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))\|(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED)))$"`|string|
|**NextPaymentAmount**  <br>*required*|The amount of the next Standing Order|[NextPaymentAmount](#accounts-accountid-standing-orders-get-standingorders-nextpaymentamount)|
|**NextPaymentDate**  <br>*required*|The date on which the next payment for a Standing Order schedule will be made.  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**Servicer**  <br>*required*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#accounts-accountid-standing-orders-get-standingorders-servicer)|
|**StandingOrderId**  <br>*optional*|A unique and immutable identifier used to identify the standing order resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|

<a name="accounts-accountid-standing-orders-get-standingorders-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*required*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="accounts-accountid-standing-orders-get-standingorders-finalpaymentamount"></a>
**FinalPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-standing-orders-get-standingorders-firstpaymentamount"></a>
**FirstPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-standing-orders-get-standingorders-nextpaymentamount"></a>
**NextPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-standing-orders-get-standingorders-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|standing_orders:read|


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
|**Path**|**AccountId**  <br>*required*|A unique identifier used to identify the account resource.|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Account Transactions successfully retrieved|[Account Transactions GET response](#account-transactions-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-transactions-get-response"></a>
**Account Transactions GET response**

|Name|Description|Schema|
|---|---|---|
|**Links**  <br>*optional*||[Links](#accounts-accountid-transactions-get-links)|
|**Transactions**  <br>*required*|Array of Transactions|< [Transactions](#accounts-accountid-transactions-get-transactions) > array|

<a name="accounts-accountid-transactions-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="accounts-accountid-transactions-get-transactions"></a>
**Transactions**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**AddressLine**  <br>*optional*|Information that locates and identifies a specific address, as defined by postal services, that is presented in free format text.  <br>**Length** : `1 - 70`|string|
|**Amount**  <br>*required*|Amount of money in the cash entry.|[Amount](#accounts-accountid-transactions-get-transactions-amount)|
|**Balance**  <br>*required*|Set of elements used to define the balance as a numerical representation of the net increases and decreases in an account after a transaction entry is applied to the account.|[Balance](#accounts-accountid-transactions-get-transactions-balance)|
|**BankTransactionCode**  <br>*optional*|Set of elements used to fully identify the type of underlying transaction resulting in an entry.|[BankTransactionCode](#accounts-accountid-transactions-get-transactions-banktransactioncode)|
|**BookingDate**  <br>*optional*|Date and time when an entry is posted to an account on the account servicer's books. Usage: Booking date is the expected booking date, unless the status is booked, in which case it is the actual booking date.|[BookingDate](#accounts-accountid-transactions-get-transactions-bookingdate)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the entry is a credit or a debit entry|enum (Credit, Debit)|
|**MerchantDetails**  <br>*optional*|Details of the merchant involved in the transaction.|[MerchantDetails](#accounts-accountid-transactions-get-transactions-merchantdetails)|
|**ProprietaryBankTransactionCode**  <br>*optional*|Set of elements to fully identify a proprietary bank transaction code.|[ProprietaryBankTransactionCode](#accounts-accountid-transactions-get-transactions-proprietarybanktransactioncode)|
|**Status**  <br>*required*|Status of an entry on the books of the account servicer|enum (Booked, Pending)|
|**TransactionId**  <br>*optional*|maxLength 40 text  <br>**Length** : `1 - 40`|string|
|**TransactionInformation**  <br>*optional*|Further details of the transaction. This is the transaction narrative, which in unstructured text.  <br>**Length** : `1 - 500`|string|
|**TransactionReference**  <br>*optional*|Unique reference for the transaction. This reference is optionally populated, and may as an example be the FPID in the Faster Payments context.  <br>**Length** : `1 - 35`|string|
|**ValueDate**  <br>*optional*|Date and time at which assets become available to the account owner in case of a credit entry, or cease to be available  to the account owner in case of a debit entry.  Usage: If entry status is pending and value date is present, then the value date refers to an expected/requested value date. For entries subject to availability/float and for which availability information is provided, the value date must not be used. In this case the availability component identifies the  number of availability days.|[ValueDate](#accounts-accountid-transactions-get-transactions-valuedate)|

<a name="accounts-accountid-transactions-get-transactions-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-transactions-get-transactions-balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|Amount of money of the cash balance after a transaction entry is applied to the account..|[Amount](#accounts-accountid-transactions-get-transactions-balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, ForwardAvailable, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked, Expected)|

<a name="accounts-accountid-transactions-get-transactions-balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-transactions-get-transactions-banktransactioncode"></a>
**BankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Specifies the family within a domain.|string|
|**SubCode**  <br>*required*|Specifies the sub-product family within a specific family.|string|

<a name="accounts-accountid-transactions-get-transactions-bookingdate"></a>
**BookingDate**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="accounts-accountid-transactions-get-transactions-merchantdetails"></a>
**MerchantDetails**

|Name|Description|Schema|
|---|---|---|
|**MerchantCategoryCode**  <br>*optional*|Category code conform to ISO 18245, related to the type of services or goods the merchant provides for the transaction.  <br>**Length** : `3 - 4`|string|
|**Name**  <br>*required*|Name by which the merchant is known.  <br>**Length** : `1 - 350`|string|

<a name="accounts-accountid-transactions-get-transactions-proprietarybanktransactioncode"></a>
**ProprietaryBankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Proprietary bank transaction code to identify the underlying transaction.  <br>**Length** : `1 - 35`|string|
|**Issuer**  <br>*optional*|Identification of the issuer of the proprietary bank transaction code.  <br>**Length** : `1 - 35`|string|

<a name="accounts-accountid-transactions-get-transactions-valuedate"></a>
**ValueDate**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|transactions:read|


***

<a name="getbalances"></a>
### Get Balances
```
GET /balances
```


#### Description
Get Balances


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Balances successfully retrieved|[Balances GET response](#balances-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="balances-get-response"></a>
**Balances GET response**

|Name|Description|Schema|
|---|---|---|
|**Balances**  <br>*required*|Array of Balances|< [Balances](#balances-get-balances) > array|
|**Links**  <br>*optional*||[Links](#balances-get-links)|

<a name="balances-get-balances"></a>
**Balances**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Amount**  <br>*required*|Amount of money of the cash balance.|[Amount](#balances-get-balances-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**CreditLine**  <br>*optional*||[CreditLine](#balances-get-balances-creditline)|
|**Date**  <br>*optional*|Indicates the date (and time) of the balance.|[Date](#balances-get-balances-date)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, ForwardAvailable, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked, Expected)|

<a name="balances-get-balances-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="balances-get-balances-creditline"></a>
**CreditLine**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*optional*|Active Or Historic Currency Code and Amount|[Amount](#balances-get-balances-creditline-amount)|
|**Included**  <br>*required*|Indicates whether or not the credit line is included in the balance of the account. Usage: If not present, credit line is not included in the balance amount of the account.|boolean|
|**Type**  <br>*optional*|Limit type, in a coded form.|string|

<a name="balances-get-balances-creditline-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="balances-get-balances-date"></a>
**Date**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="balances-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|balances:read|


***

<a name="getbeneficiaries"></a>
### Get Beneficiaries
```
GET /beneficiaries
```


#### Description
Get Beneficiaries


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Beneficiaries successfully retrieved|[Beneficiaries GET response](#beneficiaries-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="beneficiaries-get-response"></a>
**Beneficiaries GET response**

|Name|Description|Schema|
|---|---|---|
|**Beneficiaries**  <br>*required*|Array of Beneficiaries|< [Beneficiaries](#beneficiaries-get-beneficiaries) > array|
|**Links**  <br>*optional*||[Links](#beneficiaries-get-links)|

<a name="beneficiaries-get-beneficiaries"></a>
**Beneficiaries**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**BeneficiaryId**  <br>*optional*|A unique and immutable identifier used to identify the beneficiary resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*required*||[CreditorAccount](#beneficiaries-get-beneficiaries-creditoraccount)|
|**CreditorReferenceInformation**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Servicer**  <br>*required*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#beneficiaries-get-beneficiaries-servicer)|

<a name="beneficiaries-get-beneficiaries-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*required*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="beneficiaries-get-beneficiaries-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|

<a name="beneficiaries-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|beneficiaries:read|


***

<a name="getdirectdebits"></a>
### Get Direct Debits
```
GET /direct-debits
```


#### Description
Get Direct Debits


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Direct Debits successfully retrieved|[Direct Debits GET response](#direct-debits-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="direct-debits-get-response"></a>
**Direct Debits GET response**

|Name|Description|Schema|
|---|---|---|
|**DirectDebits**  <br>*required*|Array of Direct Debits|< [DirectDebits](#direct-debits-get-directdebits) > array|
|**Links**  <br>*optional*||[Links](#direct-debits-get-links)|

<a name="direct-debits-get-directdebits"></a>
**DirectDebits**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**Currency**  <br>*optional*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**DirectDebitId**  <br>*optional*|A unique and immutable identifier used to identify the direct debit resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**DirectDebitStatusCode**  <br>*optional*|Specifies the status of the direct debit in code form.|enum (Active, Inactive)|
|**MandateIdentification**  <br>*required*|Direct Debit reference. For AUDDIS service users provide Core Reference. For non AUDDIS service users provide Core reference if possible or last used reference.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*required*|Name of Service User  <br>**Length** : `1 - 70`|string|
|**PreviousPaymentAmount**  <br>*optional*|The amount of the most recent direct debit collection.|[PreviousPaymentAmount](#direct-debits-get-directdebits-previouspaymentamount)|
|**PreviousPaymentDate**  <br>*optional*|Date of most recent direct debit collection.  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|

<a name="direct-debits-get-directdebits-previouspaymentamount"></a>
**PreviousPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="direct-debits-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|direct_debits:read|


***

<a name="getproducts"></a>
### Get Products
```
GET /products
```


#### Description
Get Products


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Products successfully retrieved|[Products GET response](#products-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="products-get-response"></a>
**Products GET response**

|Name|Description|Schema|
|---|---|---|
|**Links**  <br>*optional*||[Links](#products-get-links)|
|**Products**  <br>*required*|Array of Products|< [Products](#products-get-products) > array|

<a name="products-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="products-get-products"></a>
**Products**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**ProductIdentifier**  <br>*required*|Identifier within the parent organisation for the product. Must be unique in the organisation.|string|
|**ProductName**  <br>*optional*|The name of the product used for marketing purposes from a customer perspective. I.e. what the customer would recognise.|string|
|**ProductType**  <br>*required*|Descriptive code for the product category.|enum (BCA, PCA)|
|**SecondaryProductIdentifier**  <br>*optional*|Identifier within the parent organisation for the product. Must be unique in the organisation.|string|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|products:read|


***

<a name="getstandingorders"></a>
### Get Standing Orders
```
GET /standing-orders
```


#### Description
Get Standing Orders


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Standing Orders successfully retrieved|[Standing Orders GET response](#standing-orders-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="standing-orders-get-response"></a>
**Standing Orders GET response**

|Name|Description|Schema|
|---|---|---|
|**Links**  <br>*optional*||[Links](#standing-orders-get-links)|
|**StandingOrders**  <br>*required*|Array of Standing Orders|< [StandingOrders](#standing-orders-get-standingorders) > array|

<a name="standing-orders-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="standing-orders-get-standingorders"></a>
**StandingOrders**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**CreditorAccount**  <br>*required*|Provides the details to identify the beneficiary account.|[CreditorAccount](#standing-orders-get-standingorders-creditoraccount)|
|**CreditorReferenceInformation**  <br>*optional*|Unique reference, as assigned by the creditor, to unambiguously refer to the payment transaction. Usage: If available, the initiating party should provide this reference in the structured remittance information, to enable reconciliation by the creditor upon receipt of the amount of money. If the business context requires the use of a creditor reference or a payment remit identification, and only one identifier can be passed through the end-to-end chain, the creditor's reference or payment remittance identification should be quoted in the end-to-end transaction identification.  <br>**Length** : `1 - 35`|string|
|**Currency**  <br>*required*|Identification of the currency of the standing order  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**FinalPaymentAmount**  <br>*optional*|The amount of the final Standing Order|[FinalPaymentAmount](#standing-orders-get-standingorders-finalpaymentamount)|
|**FinalPaymentDate**  <br>*optional*|The date on which the final payment for a Standing Order schedule will be made.  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**FirstPaymentAmount**  <br>*optional*|The amount of the first Standing Order|[FirstPaymentAmount](#standing-orders-get-standingorders-firstpaymentamount)|
|**FirstPaymentDate**  <br>*optional*|The date on which the first payment for a Standing Order schedule will be made.  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**Frequency**  <br>*required*|EvryWorkgDay - PSC070 IntrvlWkDay:PSC110:PSC080 (PSC070 code + PSC110 + PSC080) WkInMnthDay:PSC100:PSC080 (PSC070 code + PSC100 + PSC080) IntrvlMnthDay:PSC120:PSC090 (PSC070 code + PSC120 + PSC090) QtrDay: + either (ENGLISH, SCOTTISH or RECEIVED) PSC070 + PSC130 The following response codes may be generated by this data element: PSC070: T221 - Schedule code must be a valid enumeration value. PSC070: T245 - Must be provided for standing order only. PSC080: T222 - Day in week must be within defined bounds (range 1 to 5). PSC080: T229 - Must be present if Schedule Code = IntrvlWkDay. PSC080: T231 - Must be present if Schedule Code = WkInMnthDay. PSC090: T223 - Day in month must be within defined bounds (range -5 to 31 excluding: 0 & 00). PSC090: T233 - Must be present if Schedule Code = IntrvlMnthDay. PSC100: T224 - Week in month must be within defined bounds (range 1 to 5). PSC100: T232 - Must be present if Schedule Code = WkInMnthDay. PSC110: T225 - Interval in weeks must be within defined bounds (range 1 to 9). PSC110: T230 - Must be present if Schedule Code = IntrvlWkDay. PSC120: T226 - Interval in months must be a valid enumeration value (range 1 to 6, 12 and 24). PSC120: T234 - Must be present if Schedule Code = IntrvlMnthDay. PSC130: T227 - Quarter Day must be a valid enumeration value. PSC130: T235 - Must be present if Schedule Code = QtrDay. The regular expression for this element combines five smaller versions for each permitted pattern. To aid legibility - the components are presented individually here: EvryWorkgDay IntrvlWkDay:0[1-9]:0[1-5] WkInMnthDay:0[1-5]:0[1-5] IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]) QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED) Mandatory/Conditional/Optional/Parent/Leaf: OL Type: 35 char string Regular Expression(s): (EvryWorkgDay)\|(IntrvlWkDay:0[1-9]:0[1-5])\|(WkInMnthDay:0[1-5]:0[1-5])\|(IntrvlMnthDay:(0[1- 6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))\|(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED))  <br>**Pattern** : `"^((EvryWorkgDay)\|(IntrvlWkDay:0[1-9]:0[1-5])\|(WkInMnthDay:0[1-5]:0[1-5])\|(IntrvlMnthDay:(0[1-6]\|12\|24):(-0[1-5]\|0[1-9]\|[12][0-9]\|3[01]))\|(QtrDay:(ENGLISH\|SCOTTISH\|RECEIVED)))$"`|string|
|**NextPaymentAmount**  <br>*required*|The amount of the next Standing Order|[NextPaymentAmount](#standing-orders-get-standingorders-nextpaymentamount)|
|**NextPaymentDate**  <br>*required*|The date on which the next payment for a Standing Order schedule will be made.  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**Servicer**  <br>*required*|Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account. This is the servicer of the beneficiary account|[Servicer](#standing-orders-get-standingorders-servicer)|
|**StandingOrderId**  <br>*optional*|A unique and immutable identifier used to identify the standing order resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|

<a name="standing-orders-get-standingorders-creditoraccount"></a>
**CreditorAccount**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 34`|string|
|**Name**  <br>*required*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BBAN, IBAN)|
|**SecondaryIdentification**  <br>*optional*|This is secondary identification of the account, as assigned by the account servicing institution.  This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).  <br>**Length** : `1 - 34`|string|

<a name="standing-orders-get-standingorders-finalpaymentamount"></a>
**FinalPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="standing-orders-get-standingorders-firstpaymentamount"></a>
**FirstPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="standing-orders-get-standingorders-nextpaymentamount"></a>
**NextPaymentAmount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="standing-orders-get-standingorders-servicer"></a>
**Servicer**

|Name|Description|Schema|
|---|---|---|
|**Identification**  <br>*required*|Unique and unambiguous identification of the servicing institution.  <br>**Length** : `1 - 35`|string|
|**SchemeName**  <br>*required*|Name of the identification scheme, in a coded form as published in an external list.|enum (BICFI, UKSortCode)|


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|standing_orders:read|


***

<a name="gettransactions"></a>
### Get Transactions
```
GET /transactions
```


#### Description
Get Transactions


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Transactions successfully retrieved|[Account Transactions GET response](#account-transactions-get-response)|
|**400**|Bad Request|No Content|
|**401**|Unauthorized|No Content|
|**403**|Forbidden|No Content|
|**404**|Not Found|No Content|
|**500**|Internal Server Error|No Content|

<a name="account-transactions-get-response"></a>
**Account Transactions GET response**

|Name|Description|Schema|
|---|---|---|
|**Links**  <br>*optional*||[Links](#transactions-get-links)|
|**Transactions**  <br>*required*|Array of Transactions|< [Transactions](#transactions-get-transactions) > array|

<a name="transactions-get-links"></a>
**Links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="transactions-get-transactions"></a>
**Transactions**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource. This identifier has no meaning to the account owner.  <br>**Length** : `1 - 40`|string|
|**AddressLine**  <br>*optional*|Information that locates and identifies a specific address, as defined by postal services, that is presented in free format text.  <br>**Length** : `1 - 70`|string|
|**Amount**  <br>*required*|Amount of money in the cash entry.|[Amount](#transactions-get-transactions-amount)|
|**Balance**  <br>*required*|Set of elements used to define the balance as a numerical representation of the net increases and decreases in an account after a transaction entry is applied to the account.|[Balance](#transactions-get-transactions-balance)|
|**BankTransactionCode**  <br>*optional*|Set of elements used to fully identify the type of underlying transaction resulting in an entry.|[BankTransactionCode](#transactions-get-transactions-banktransactioncode)|
|**BookingDate**  <br>*optional*|Date and time when an entry is posted to an account on the account servicer's books. Usage: Booking date is the expected booking date, unless the status is booked, in which case it is the actual booking date.|[BookingDate](#transactions-get-transactions-bookingdate)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the entry is a credit or a debit entry|enum (Credit, Debit)|
|**MerchantDetails**  <br>*optional*|Details of the merchant involved in the transaction.|[MerchantDetails](#transactions-get-transactions-merchantdetails)|
|**ProprietaryBankTransactionCode**  <br>*optional*|Set of elements to fully identify a proprietary bank transaction code.|[ProprietaryBankTransactionCode](#transactions-get-transactions-proprietarybanktransactioncode)|
|**Status**  <br>*required*|Status of an entry on the books of the account servicer|enum (Booked, Pending)|
|**TransactionId**  <br>*optional*|maxLength 40 text  <br>**Length** : `1 - 40`|string|
|**TransactionInformation**  <br>*optional*|Further details of the transaction. This is the transaction narrative, which in unstructured text.  <br>**Length** : `1 - 500`|string|
|**TransactionReference**  <br>*optional*|Unique reference for the transaction. This reference is optionally populated, and may as an example be the FPID in the Faster Payments context.  <br>**Length** : `1 - 35`|string|
|**ValueDate**  <br>*optional*|Date and time at which assets become available to the account owner in case of a credit entry, or cease to be available  to the account owner in case of a debit entry.  Usage: If entry status is pending and value date is present, then the value date refers to an expected/requested value date. For entries subject to availability/float and for which availability information is provided, the value date must not be used. In this case the availability component identifies the  number of availability days.|[ValueDate](#transactions-get-transactions-valuedate)|

<a name="transactions-get-transactions-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="transactions-get-transactions-balance"></a>
**Balance**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|Amount of money of the cash balance after a transaction entry is applied to the account..|[Amount](#transactions-get-transactions-balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, ForwardAvailable, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked, Expected)|

<a name="transactions-get-transactions-balance-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="transactions-get-transactions-banktransactioncode"></a>
**BankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Specifies the family within a domain.|string|
|**SubCode**  <br>*required*|Specifies the sub-product family within a specific family.|string|

<a name="transactions-get-transactions-bookingdate"></a>
**BookingDate**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="transactions-get-transactions-merchantdetails"></a>
**MerchantDetails**

|Name|Description|Schema|
|---|---|---|
|**MerchantCategoryCode**  <br>*optional*|Category code conform to ISO 18245, related to the type of services or goods the merchant provides for the transaction.  <br>**Length** : `3 - 4`|string|
|**Name**  <br>*required*|Name by which the merchant is known.  <br>**Length** : `1 - 350`|string|

<a name="transactions-get-transactions-proprietarybanktransactioncode"></a>
**ProprietaryBankTransactionCode**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Proprietary bank transaction code to identify the underlying transaction.  <br>**Length** : `1 - 35`|string|
|**Issuer**  <br>*optional*|Identification of the issuer of the proprietary bank transaction code.  <br>**Length** : `1 - 35`|string|

<a name="transactions-get-transactions-valuedate"></a>
**ValueDate**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|


#### Consumes

* `application/json`


#### Produces

* `application/json`


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|transactions:read|






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
|account_requests:manage|Ability to manage account-requests|
|accounts:read|Ability to read basic account information|
|balances:read|Ability to read balance information|
|beneficiaries:read|Ability to read basic beneficiary details|
|direct_debits:read|Ability to read direct debit information|
|standing_orders:read|Ability to read standing order information|
|transactions:read|Ability to read basic transaction information|
|products:read|Ability to read product information relating to the account|



