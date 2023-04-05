# Environment setup for MacOS

## for iOS

Install `XCode` 12+ from AppStore.
Next you need `Command Line Tools`, install them from `XCode => Preferences => Locations`

## for Android

Install `Oracle JDK 11`

> brew install --cask zulu11

Install `Android Studio`

- Android SDK
- Android SDK Platform
- Android Virtual Device

Next, you need to install `Android SDK 13` (Tiramisu) and select `Android SDK Platform 34`

Then you need to configure your ANDROID_HOME environment.

For standard macOS terminal you can make `~/.bash_profile` (or `~/.profile`) and put next lines:

```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then start Android Studio

### Setup Android SDK and Emulation Device

Next, you need to setup the correct SDK and create an emulation device:

In SDK Manager choose Android 13 (Tiramisu) and show package details. Select the SDK itself and check `Google APIs Intel x86 Atom System Image`. Then install and wait.
Once ready add/create the emulation device, select a phone device of your choice and assign the SDK 10(Q) to it.

### General

Install `Homebrew` and `NodeJS` 12+, then run following commands

```
brew install watchman
goi
npm i
```

## Development

Install [Flipper](https://fbflipper.com/) as your debugger

You should be able to run `npm start` without issues, which will start:

- React Native Metro Server
- React Native Developer Tools
- Starts the Mobile Emulator
- Builds and run the app

# XCode

Run `npx pod install`

> You cannot use `npm run ios` at the time of writing with XCode 13+

Open `Phoenix.xcworkspace` in XCode and hit the Play button (and wait)
