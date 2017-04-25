#!/bin/sh
# arg1 = version number to compile
rm -rf ../compiled/schemas/$1
mkdir ../compiled/schemas/$1

node flatten-json.js ../schemas/$1 ../compiled/schemas/$1 ../
