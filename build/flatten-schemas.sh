#!/bin/sh

set -e
node versions.js

echo   "*****************************************"
echo   "*********   Building Version   **********"
printf "*********   $VERSION               **********\n"
echo   "*****************************************"

rm -rf ../compiled/schemas/$VERSION
mkdir ../compiled/schemas/$VERSION

node flatten-json.js ../schemas/$VERSION ../compiled/schemas/$VERSION ../
