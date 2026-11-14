# Gratitude Journal

## Updating the Android app

Build the installable APK with `npm run build:internal`. Install the new APK over
the existing app, using the same Expo project and Android signing key for every
build. The preview profile increments Android's build version each time, so the
new APK can replace the previous one while keeping its journal data.

If Android refuses an update, keep the installed app until your entries are
backed up. In the app menu, choose **Export** and save the JSON file outside the
app's storage. After installing the new app, choose **Import** to restore it.
Imported entries are saved to the app's persistent storage.

For the exact installation error, connect the device and run
`adb install -r path/to/new-build.apk`. A signing certificate mismatch requires
building with the original signing key; a version downgrade requires a build
with a higher version code. Uninstalling the existing app deletes its local
journal data.
