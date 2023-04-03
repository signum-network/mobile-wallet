#!/bin/bash
# because of duplicate resource errors
rm -r android/app/src/main/res/drawable-*
cd android
./gradlew clean
./gradlew bundleRelease -PMYAPP_UPLOAD_STORE_FILE=signum-network.jks \
  -PMYAPP_UPLOAD_STORE_PASSWORD="$1" \
  -PMYAPP_UPLOAD_KEY_PASSWORD="$1" \
  -PMYAPP_UPLOAD_KEY_ALIAS="$2" \

# in case we want to verify the cert
# jarsigner -verify -verbose -certs ./app/build/outputs/bundle/release/app-release.aab
