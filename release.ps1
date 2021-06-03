Set-Location .\android;
./gradlew clean;
Set-Location ..;
Start-Process powershell {npx react-native start};
Set-Location .\android;
./gradlew assembleRelease;