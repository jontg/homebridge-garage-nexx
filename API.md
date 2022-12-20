POST /api/Domain/NexxGarage/DeviceState HTTP/1.1
Host: nexx-domain.simpaltek.com
Content-Type: application/json

{"postType":"GET","DeviceId":"df3aa0097f332b97da8432b97da845050"}
=> {"StatusCode":200,"Status":0,"Result":{"DeviceId":"df3aa0097f332b97da8432b97da845050","DeviceStatus":1,"DeviceStatusName":"Last Open Status","LastOperationTimestamp":"2022-12-18T22:09:42.74877","IsOnline":true,"SharingOpenNotifyAllowed":true,"SharingCloseNotifyAllowed":true,"SharingOpenReminderAllowed":true,"TemperatureColorIndicator":null,"COColorIndicator":null,"AccessoryDetails":null,"TemperatureSetting":{"Good":{"from":32.0,"to":90.0},"Attention":[{"from":21.0,"to":31.0},{"from":91.0,"to":109.0}],"Warning":{"below":20.0,"above":110.0},"PreferredUnit":"F"},"COSetting":{"Good":{"below":35.0,"above":0.0},"Attention":{"from":36.0,"to":149.0},"Warning":{"below":0.0,"above":150.0}},"ProductCode":"NXG-200","DeviceNickName":"Garage","IsWirelessSensorLowBattery":null,"GestureActionType":20,"Model":null,"ActivityTimeStamp":"12/18/2022 02:09 PM"},"Message":"Device status is currently open"}



POST /api/Domain/NexxGarage/ActivateDevice HTTP/1.1
Host: nexx-domain.simpaltek.com
Content-Type: application/json

{"AdditionalData":{"deviceType":"iOS","network":"WiFi"},"Longitude":0,"SentDateTimeOffSet":"","SentDateTime":"2022-12-18 22:09:49.5500","AppVersion":"3.8.2","BypassZones":"","Activation":"OPEN","MobileDeviceUUID":"3B3F5B69-DA88-4506-AB7F-09D3FDBC889D","ActivationType":"MANUAL","SentLocalDateTime":"12-18-2022 14:09:49.5480","Latitude":0,"DeviceId":"df3aa0097f332b97da8432b97da845050","ProductCode":"NXG-200","DeviceNickName":"Garage"}
=> {"StatusCode":200,"Status":0,"Result":null,"Message":"Garage have been activated to OPEN"}
