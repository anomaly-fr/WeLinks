param ($one);
if($one.Length -ne 0){
    adb connect 192.168.1${one}:5555;
    #Write-Output 192.168.0.${one}:5555;
}
adb wait-for-device;
adb reverse tcp:8081 tcp:8081;
npx react-native start;