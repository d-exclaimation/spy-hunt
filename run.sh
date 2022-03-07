#!/bin/bash

cd web/

yarn dev&

cd ../server/

sbt run
