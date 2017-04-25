# Account Information APIs


<a name="overview"></a>
## Overview
Draft Swagger specification for Account Information APIs


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


### Tags

* Accounts : Account related endpoints


### Produces

* `application/json`




<a name="paths"></a>
## Paths

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
|**data**  <br>*required*|< [data](#accounts-get-data) > array|
|**links**  <br>*optional*|[links](#accounts-get-links)|
|**meta**  <br>*required*|[meta](#accounts-get-meta)|

<a name="accounts-get-data"></a>
**data**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource  <br>**Length** : `1 - 35`|string|
|**Currency**  <br>*optional*|Identification of the currency in which the account is held.  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**Identification**  <br>*optional*|Unique and unambiguous identification for the account between the account owner and the account servicer.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account.  <br>**Length** : `1 - 70`|string|
|**UKBankSortCode**  <br>*optional*|UK Domestic Sort Code Identifier  <br>**Pattern** : `"^SC[0-9]{6,6}$"`|string|

<a name="accounts-get-links"></a>
**links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="accounts-get-meta"></a>
**meta**

|Name|Schema|
|---|---|
|**TotalResults**  <br>*optional*|integer|


#### Produces

* `application/json`


#### Tags

* Accounts


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[PSUOAuth2Security](#psuoauth2security)**|accounts|


***

<a name="createaccountrequest"></a>
### Create an account request resource
```
POST /accounts-requests
```


#### Description
Create an account request  resource


#### Body parameter
Create an Account Request

*Name* : body  
*Flags* : required


|Name|Description|Schema|
|---|---|---|
|**ExpiresAt**  <br>*required*|Date time when the access to the account information will expire|string (date-time)|
|**Permissions**  <br>*required*||[Permissions](#createaccountrequest-permissions)|

<a name="createaccountrequest-permissions"></a>
**Permissions**

|Name|Schema|
|---|---|
|**Account**  <br>*optional*|[Account](#accounts-requests-post-account)|
|**Transactions**  <br>*optional*|[Transactions](#accounts-requests-post-transactions)|

<a name="accounts-requests-post-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**readBalances**  <br>*optional*|Allow read access to balances for authorised accounts|boolean|
|**readBasic**  <br>*optional*|Allow read permission on basic accounts information for authorised accounts|boolean|
|**readBeneficiaries**  <br>*optional*|Allow read access to beneficiaries for authorised accounts|boolean|
|**readBeneficiariesIdentities**  <br>*optional*|Allow read access to beneficiaries identities (account number) for one or more accounts|boolean|
|**readIdentities**  <br>*optional*|Allow read permission on sort-code, account number and name for authorised accounts|boolean|
|**readProducts**  <br>*optional*|Allow read access to product details for authorised accounts|boolean|

<a name="accounts-requests-post-transactions"></a>
**Transactions**

|Name|Description|Schema|
|---|---|---|
|**readAll**  <br>*optional*|Allow read access on all transactions resources for one or more accounts|boolean|
|**readCredits**  <br>*optional*|Allow read access to credit transactions for one or more accounts|boolean|
|**readDebits**  <br>*optional*|Allow read access to debit transactions for one or more accounts|boolean|
|**readDescriptions**  <br>*optional*|Allow read access to transactions descriptions for one or more accounts|boolean|
|**readFromDate**  <br>*required*|Allow read access to all transactions starting from the specified date|string (date-time)|
|**readToDate**  <br>*required*|Allow read access to all transactions ending on the specified date, if not provided|string (date-time)|


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
|**AccountRequestId**  <br>*required*|Unique identification as assigned by the ASPSP to uniquely identify the account request resource.  <br>**Length** : `1 - 35`|string|
|**CreatedAt**  <br>*required*|Date and time at which the resource was created.|string (date-time)|
|**ExpiresAt**  <br>*required*|Date time when the access to the account information will expire|string (date-time)|
|**Permissions**  <br>*required*||[Permissions](#accounts-requests-post-permissions)|
|**Status**  <br>*required*||enum (AwaitingAuthorisation, Authorised, NotAuthorised, Expired)|

<a name="accounts-requests-post-permissions"></a>
**Permissions**

|Name|Schema|
|---|---|
|**Account**  <br>*optional*|[Account](#accounts-requests-post-permissions-account)|
|**Transactions**  <br>*optional*|[Transactions](#accounts-requests-post-permissions-transactions)|

<a name="accounts-requests-post-permissions-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**readBalances**  <br>*optional*|Allow read access to balances for authorised accounts|boolean|
|**readBasic**  <br>*optional*|Allow read permission on basic accounts information for authorised accounts|boolean|
|**readBeneficiaries**  <br>*optional*|Allow read access to beneficiaries for authorised accounts|boolean|
|**readBeneficiariesIdentities**  <br>*optional*|Allow read access to beneficiaries identities (account number) for one or more accounts|boolean|
|**readIdentities**  <br>*optional*|Allow read permission on sort-code, account number and name for authorised accounts|boolean|
|**readProducts**  <br>*optional*|Allow read access to product details for authorised accounts|boolean|

<a name="accounts-requests-post-permissions-transactions"></a>
**Transactions**

|Name|Description|Schema|
|---|---|---|
|**readAll**  <br>*optional*|Allow read access on all transactions resources for one or more accounts|boolean|
|**readCredits**  <br>*optional*|Allow read access to credit transactions for one or more accounts|boolean|
|**readDebits**  <br>*optional*|Allow read access to debit transactions for one or more accounts|boolean|
|**readDescriptions**  <br>*optional*|Allow read access to transactions descriptions for one or more accounts|boolean|
|**readFromDate**  <br>*required*|Allow read access to all transactions starting from the specified date|string (date-time)|
|**readToDate**  <br>*required*|Allow read access to all transactions ending on the specified date, if not provided|string (date-time)|


#### Consumes

* `application/json`


#### Produces

* `application/json`


#### Tags

* Accounts


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[TPPOAuth2Security](#tppoauth2security)**|tpp_client_credential|


***

<a name="getaccountrequest"></a>
### Get an account request resource
```
GET /accounts-requests/{AccountRequestId}
```


#### Description
Get an account request  resource


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
|**AccountRequestId**  <br>*required*|Unique identification as assigned by the ASPSP to uniquely identify the account request resource.  <br>**Length** : `1 - 35`|string|
|**CreatedAt**  <br>*required*|Date and time at which the resource was created.|string (date-time)|
|**ExpiresAt**  <br>*required*|Date time when the access to the account information will expire|string (date-time)|
|**Permissions**  <br>*required*||[Permissions](#accounts-requests-accountrequestid-get-permissions)|
|**Status**  <br>*required*||enum (AwaitingAuthorisation, Authorised, NotAuthorised, Expired)|

<a name="accounts-requests-accountrequestid-get-permissions"></a>
**Permissions**

|Name|Schema|
|---|---|
|**Account**  <br>*optional*|[Account](#accounts-requests-accountrequestid-get-permissions-account)|
|**Transactions**  <br>*optional*|[Transactions](#accounts-requests-accountrequestid-get-permissions-transactions)|

<a name="accounts-requests-accountrequestid-get-permissions-account"></a>
**Account**

|Name|Description|Schema|
|---|---|---|
|**readBalances**  <br>*optional*|Allow read access to balances for authorised accounts|boolean|
|**readBasic**  <br>*optional*|Allow read permission on basic accounts information for authorised accounts|boolean|
|**readBeneficiaries**  <br>*optional*|Allow read access to beneficiaries for authorised accounts|boolean|
|**readBeneficiariesIdentities**  <br>*optional*|Allow read access to beneficiaries identities (account number) for one or more accounts|boolean|
|**readIdentities**  <br>*optional*|Allow read permission on sort-code, account number and name for authorised accounts|boolean|
|**readProducts**  <br>*optional*|Allow read access to product details for authorised accounts|boolean|

<a name="accounts-requests-accountrequestid-get-permissions-transactions"></a>
**Transactions**

|Name|Description|Schema|
|---|---|---|
|**readAll**  <br>*optional*|Allow read access on all transactions resources for one or more accounts|boolean|
|**readCredits**  <br>*optional*|Allow read access to credit transactions for one or more accounts|boolean|
|**readDebits**  <br>*optional*|Allow read access to debit transactions for one or more accounts|boolean|
|**readDescriptions**  <br>*optional*|Allow read access to transactions descriptions for one or more accounts|boolean|
|**readFromDate**  <br>*required*|Allow read access to all transactions starting from the specified date|string (date-time)|
|**readToDate**  <br>*required*|Allow read access to all transactions ending on the specified date, if not provided|string (date-time)|


#### Produces

* `application/json`


#### Tags

* Accounts


#### Security

|Type|Name|Scopes|
|---|---|---|
|**oauth2**|**[TPPOAuth2Security](#tppoauth2security)**|tpp_client_credential|


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
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource  <br>**Length** : `1 - 35`|string|
|**Currency**  <br>*optional*|Identification of the currency in which the account is held.  <br>**Pattern** : `"^[A-Z]{3}$"`|string|
|**Identification**  <br>*optional*|Unique and unambiguous identification for the account between the account owner and the account servicer.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account.  <br>**Length** : `1 - 70`|string|
|**UKBankSortCode**  <br>*optional*|UK Domestic Sort Code Identifier  <br>**Pattern** : `"^SC[0-9]{6,6}$"`|string|


#### Produces

* `application/json`


#### Tags

* Accounts


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
|**data**  <br>*required*|Array of Balances|< [data](#accounts-accountid-balances-get-data) > array|
|**links**  <br>*optional*||[links](#accounts-accountid-balances-get-links)|
|**meta**  <br>*required*||[meta](#accounts-accountid-balances-get-meta)|

<a name="accounts-accountid-balances-get-data"></a>
**data**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource  <br>**Length** : `1 - 35`|string|
|**Amount**  <br>*required*|Amount of money of the cash balance.|[Amount](#accounts-accountid-balances-get-data-amount)|
|**CreditLine**  <br>*optional*||[CreditLine](#accounts-accountid-balances-get-data-creditline)|
|**Date**  <br>*required*|Indicates the date (and time) of the balance.|[Date](#accounts-accountid-balances-get-data-date)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, ForwardAvailable, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked, Expected)|

<a name="accounts-accountid-balances-get-data-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-balances-get-data-creditline"></a>
**CreditLine**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*optional*|Active Or Historic Currency Code and Amount|[Amount](#accounts-accountid-balances-get-data-creditline-amount)|
|**Included**  <br>*required*||boolean|

<a name="accounts-accountid-balances-get-data-creditline-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="accounts-accountid-balances-get-data-date"></a>
**Date**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="accounts-accountid-balances-get-links"></a>
**links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="accounts-accountid-balances-get-meta"></a>
**meta**

|Name|Schema|
|---|---|
|**TotalResults**  <br>*optional*|integer|


#### Produces

* `application/json`


#### Tags

* Accounts


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
|**data**  <br>*required*|Array of Beneficiaries|< [data](#accounts-accountid-beneficiaries-get-data) > array|
|**links**  <br>*optional*||[links](#accounts-accountid-beneficiaries-get-links)|
|**meta**  <br>*required*||[meta](#accounts-accountid-beneficiaries-get-meta)|

<a name="accounts-accountid-beneficiaries-get-data"></a>
**data**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource  <br>**Length** : `1 - 35`|string|
|**BeneficiaryType**  <br>*required*|Indicates whether the entry is a credit or a debit entry|enum (DirectDebit, StandingOrder)|
|**Identification**  <br>*optional*|Unique and unambiguous identification for the account between the account owner and the account servicer.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**UKBankSortCode**  <br>*optional*|UK Domestic Sort Code Identifier  <br>**Pattern** : `"^SC[0-9]{6,6}$"`|string|

<a name="accounts-accountid-beneficiaries-get-links"></a>
**links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="accounts-accountid-beneficiaries-get-meta"></a>
**meta**

|Name|Schema|
|---|---|
|**TotalResults**  <br>*optional*|integer|


#### Produces

* `application/json`


#### Tags

* Accounts


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
|**data**  <br>*required*|Array of Transactions|< [data](#accounts-accountid-transactions-get-data) > array|
|**links**  <br>*optional*||[links](#accounts-accountid-transactions-get-links)|
|**meta**  <br>*required*||[meta](#accounts-accountid-transactions-get-meta)|

<a name="accounts-accountid-transactions-get-data"></a>
**data**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource  <br>**Length** : `1 - 35`|string|
|**AdditionalEntryInformation**  <br>*optional*|Further details of the entry.  <br>**Length** : `1 - 500`|string|
|**AddressLine**  <br>*optional*|Information that locates and identifies a specific address, as defined by postal services, that is presented in free format text.  <br>**Length** : `1 - 70`|string|
|**Amount**  <br>*required*|Amount of money in the cash entry.|[Amount](#accounts-accountid-transactions-get-data-amount)|
|**Balance**  <br>*required*||[Balance](#accounts-accountid-transactions-get-data-balance)|
|**BankTransactionCode**  <br>*required*|Set of elements used to fully identify the type of underlying transaction resulting in an entry.|[BankTransactionCode](#accounts-accountid-transactions-get-data-banktransactioncode)|
|**BookingDate**  <br>*optional*|Date and time when an entry is posted to an account on the account servicer's books. Usage: Booking date is the expected booking date, unless the status is booked, in which case it is the actual booking date.|[BookingDate](#accounts-accountid-transactions-get-data-bookingdate)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the entry is a credit or a debit entry|enum (Credit, Debit)|
|**EntryReference**  <br>*optional*|Unique reference for the entry.  <br>**Length** : `1 - 35`|string|
|**MerchantDetails**  <br>*optional*||[MerchantDetails](#accounts-accountid-transactions-get-data-merchantdetails)|
|**Status**  <br>*required*|Status of an entry on the books of the account servicer|enum (Booked, Pending, Information)|
|**ValueDate**  <br>*optional*|Date and time at which assets become available to the account owner in case of a credit entry, or cease to be available  to the account owner in case of a debit entry.  Usage: If entry status is pending and value date is present, then the value date refers to an expected/requested value date. For entries subject to availability/float and for which availability information is provided, the value date must not be used. In this case the availability component identifies the  number of availability days.|[ValueDate](#accounts-accountid-transactions-get-data-valuedate)|

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
|**Amount**  <br>*required*|Amount of money of the cash balance|[Amount](#accounts-accountid-transactions-get-data-balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**Type**  <br>*required*|Balance type, in a coded form|enum (Interim, Booked)|

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
|**Family**  <br>*optional*|Set of elements used to provide the domain, the family and the sub-family of the bank transaction code, in a structured and hierarchical format. Usage: If a specific family or sub-family code cannot be provided, the generic family code defined for the domain or the generic sub-family code defined for the family should be provided.|[Family](#accounts-accountid-transactions-get-data-banktransactioncode-family)|
|**Proprietary**  <br>*optional*|Bank transaction code in a proprietary form, as defined by the issuer.|[Proprietary](#accounts-accountid-transactions-get-data-banktransactioncode-proprietary)|

<a name="accounts-accountid-transactions-get-data-banktransactioncode-family"></a>
**Family**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Specifies the family within a domain. Type: ExternalBankTransactionFamily1Code|string|
|**SubFamilyCode**  <br>*required*|Specifies the sub-product family within a specific family. Type ExternalBankTransactionSubFamily1Code|string|

<a name="accounts-accountid-transactions-get-data-banktransactioncode-proprietary"></a>
**Proprietary**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Proprietary bank transaction code to identify the underlying transaction.  <br>**Length** : `1 - 35`|string|
|**Issuer**  <br>*optional*|Identification of the issuer of the proprietary bank transaction code.  <br>**Length** : `1 - 35`|string|

<a name="accounts-accountid-transactions-get-data-bookingdate"></a>
**BookingDate**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="accounts-accountid-transactions-get-data-merchantdetails"></a>
**MerchantDetails**

|Name|Description|Schema|
|---|---|---|
|**MerchantCategoryCode**  <br>*optional*|Category code conform to ISO 18245, related to the type of services or goods the merchant provides for the transaction.  <br>**Length** : `3 - 4`|string|
|**Name**  <br>*required*|Name by which the party is known and which is usually used to identify that party.  <br>**Length** : `1 - 350`|string|

<a name="accounts-accountid-transactions-get-data-valuedate"></a>
**ValueDate**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="accounts-accountid-transactions-get-links"></a>
**links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="accounts-accountid-transactions-get-meta"></a>
**meta**

|Name|Schema|
|---|---|
|**TotalResults**  <br>*optional*|integer|


#### Produces

* `application/json`


#### Tags

* Accounts


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
|**data**  <br>*required*|Array of Balances|< [data](#balances-get-data) > array|
|**links**  <br>*optional*||[links](#balances-get-links)|
|**meta**  <br>*required*||[meta](#balances-get-meta)|

<a name="balances-get-data"></a>
**data**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource  <br>**Length** : `1 - 35`|string|
|**Amount**  <br>*required*|Amount of money of the cash balance.|[Amount](#balances-get-data-amount)|
|**CreditLine**  <br>*optional*||[CreditLine](#balances-get-data-creditline)|
|**Date**  <br>*required*|Indicates the date (and time) of the balance.|[Date](#balances-get-data-date)|
|**Type**  <br>*required*|Balance type, in a coded form.|enum (ClosingAvailable, ClosingBooked, ForwardAvailable, InterimAvailable, InterimBooked, OpeningAvailable, OpeningBooked, PreviouslyClosedBooked, Expected)|

<a name="balances-get-data-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="balances-get-data-creditline"></a>
**CreditLine**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*optional*|Active Or Historic Currency Code and Amount|[Amount](#balances-get-data-creditline-amount)|
|**Included**  <br>*required*||boolean|

<a name="balances-get-data-creditline-amount"></a>
**Amount**

|Name|Description|Schema|
|---|---|---|
|**Amount**  <br>*required*|**Pattern** : `"^-?\\d{1,13}\\.\\d{1,5}$"`|string|
|**Currency**  <br>*required*|A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 'Codes for the representation of currencies and funds'  <br>**Pattern** : `"^[A-Z]{3}$"`|string|

<a name="balances-get-data-date"></a>
**Date**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="balances-get-links"></a>
**links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="balances-get-meta"></a>
**meta**

|Name|Schema|
|---|---|
|**TotalResults**  <br>*optional*|integer|


#### Produces

* `application/json`


#### Tags

* Balances


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
|**data**  <br>*required*|Array of Beneficiaries|< [data](#beneficiaries-get-data) > array|
|**links**  <br>*optional*||[links](#beneficiaries-get-links)|
|**meta**  <br>*required*||[meta](#beneficiaries-get-meta)|

<a name="beneficiaries-get-data"></a>
**data**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource  <br>**Length** : `1 - 35`|string|
|**BeneficiaryType**  <br>*required*|Indicates whether the entry is a credit or a debit entry|enum (DirectDebit, StandingOrder)|
|**Identification**  <br>*optional*|Unique and unambiguous identification for the account between the account owner and the account servicer.  <br>**Length** : `1 - 35`|string|
|**Name**  <br>*optional*|Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account. Usage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.  <br>**Length** : `1 - 70`|string|
|**UKBankSortCode**  <br>*optional*|UK Domestic Sort Code Identifier  <br>**Pattern** : `"^SC[0-9]{6,6}$"`|string|

<a name="beneficiaries-get-links"></a>
**links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="beneficiaries-get-meta"></a>
**meta**

|Name|Schema|
|---|---|
|**TotalResults**  <br>*optional*|integer|


#### Produces

* `application/json`


#### Tags

* Beneficiaries


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
|**data**  <br>*required*|Array of Transactions|< [data](#transactions-get-data) > array|
|**links**  <br>*optional*||[links](#transactions-get-links)|
|**meta**  <br>*required*||[meta](#transactions-get-meta)|

<a name="transactions-get-data"></a>
**data**

|Name|Description|Schema|
|---|---|---|
|**AccountId**  <br>*required*|A unique identifier used to identify the account resource  <br>**Length** : `1 - 35`|string|
|**AdditionalEntryInformation**  <br>*optional*|Further details of the entry.  <br>**Length** : `1 - 500`|string|
|**AddressLine**  <br>*optional*|Information that locates and identifies a specific address, as defined by postal services, that is presented in free format text.  <br>**Length** : `1 - 70`|string|
|**Amount**  <br>*required*|Amount of money in the cash entry.|[Amount](#transactions-get-data-amount)|
|**Balance**  <br>*required*||[Balance](#transactions-get-data-balance)|
|**BankTransactionCode**  <br>*required*|Set of elements used to fully identify the type of underlying transaction resulting in an entry.|[BankTransactionCode](#transactions-get-data-banktransactioncode)|
|**BookingDate**  <br>*optional*|Date and time when an entry is posted to an account on the account servicer's books. Usage: Booking date is the expected booking date, unless the status is booked, in which case it is the actual booking date.|[BookingDate](#transactions-get-data-bookingdate)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the entry is a credit or a debit entry|enum (Credit, Debit)|
|**EntryReference**  <br>*optional*|Unique reference for the entry.  <br>**Length** : `1 - 35`|string|
|**MerchantDetails**  <br>*optional*||[MerchantDetails](#transactions-get-data-merchantdetails)|
|**Status**  <br>*required*|Status of an entry on the books of the account servicer|enum (Booked, Pending, Information)|
|**ValueDate**  <br>*optional*|Date and time at which assets become available to the account owner in case of a credit entry, or cease to be available  to the account owner in case of a debit entry.  Usage: If entry status is pending and value date is present, then the value date refers to an expected/requested value date. For entries subject to availability/float and for which availability information is provided, the value date must not be used. In this case the availability component identifies the  number of availability days.|[ValueDate](#transactions-get-data-valuedate)|

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
|**Amount**  <br>*required*|Amount of money of the cash balance|[Amount](#transactions-get-data-balance-amount)|
|**CreditDebitIndicator**  <br>*required*|Indicates whether the balance is a credit or a debit balance. Usage: A zero balance is considered to be a credit balance.|enum (Credit, Debit)|
|**Type**  <br>*required*|Balance type, in a coded form|enum (Interim, Booked)|

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
|**Family**  <br>*optional*|Set of elements used to provide the domain, the family and the sub-family of the bank transaction code, in a structured and hierarchical format. Usage: If a specific family or sub-family code cannot be provided, the generic family code defined for the domain or the generic sub-family code defined for the family should be provided.|[Family](#transactions-get-data-banktransactioncode-family)|
|**Proprietary**  <br>*optional*|Bank transaction code in a proprietary form, as defined by the issuer.|[Proprietary](#transactions-get-data-banktransactioncode-proprietary)|

<a name="transactions-get-data-banktransactioncode-family"></a>
**Family**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Specifies the family within a domain. Type: ExternalBankTransactionFamily1Code|string|
|**SubFamilyCode**  <br>*required*|Specifies the sub-product family within a specific family. Type ExternalBankTransactionSubFamily1Code|string|

<a name="transactions-get-data-banktransactioncode-proprietary"></a>
**Proprietary**

|Name|Description|Schema|
|---|---|---|
|**Code**  <br>*required*|Proprietary bank transaction code to identify the underlying transaction.  <br>**Length** : `1 - 35`|string|
|**Issuer**  <br>*optional*|Identification of the issuer of the proprietary bank transaction code.  <br>**Length** : `1 - 35`|string|

<a name="transactions-get-data-bookingdate"></a>
**BookingDate**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="transactions-get-data-merchantdetails"></a>
**MerchantDetails**

|Name|Description|Schema|
|---|---|---|
|**MerchantCategoryCode**  <br>*optional*|Category code conform to ISO 18245, related to the type of services or goods the merchant provides for the transaction.  <br>**Length** : `3 - 4`|string|
|**Name**  <br>*required*|Name by which the party is known and which is usually used to identify that party.  <br>**Length** : `1 - 350`|string|

<a name="transactions-get-data-valuedate"></a>
**ValueDate**

|Name|Description|Schema|
|---|---|---|
|**Date**  <br>*optional*|ISODate YYYY-MM-DD  <br>**Pattern** : `"^[0-9]{4}-(0[1-9]\|(1[0\|1\|2]))-((0[1-9])\|((1\|2)[0-9])\|(30\|31))$"`|string|
|**DateTime**  <br>*optional*||string (date-time)|

<a name="transactions-get-links"></a>
**links**

|Name|Schema|
|---|---|
|**first**  <br>*optional*|string (uri)|
|**last**  <br>*optional*|string (uri)|
|**next**  <br>*optional*|string (uri)|
|**prev**  <br>*optional*|string (uri)|
|**self**  <br>*required*|string (uri)|

<a name="transactions-get-meta"></a>
**meta**

|Name|Schema|
|---|---|
|**TotalResults**  <br>*optional*|integer|


#### Consumes

* `application/json`


#### Produces

* `application/json`


#### Tags

* Transactions


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
|accounts|Generic Account scope|



