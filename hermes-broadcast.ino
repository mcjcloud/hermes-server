

/*
 * Copyright (c) 2016 Intel Corporation.  All rights reserved.
 * See the bottom of this file for the license terms.
 */

/*
 * Sketch: led.ino
 *
 * Description:
 *   This is a Peripheral sketch that works with a connected Central.
 *   It allows the Central to write a value and set/reset the led
 *   accordingly.
 */

#include <CurieBLE.h>
#include <Streaming.h>
#include <String>


String genUUID(String userID);



BLEService bagService("2dfffffffffd0101");
// BLE Bag and User Characteristic - custom 128-bit UUID, read and writable by central
BLEUnsignedCharCharacteristic bagCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
BLEUnsignedCharCharacteristic userCharacteristic("123",BLERead | BLEWrite);

 
const int ledPin = 13; // pin to use for the LED




void setup() {
  Serial.begin(9600);
  Serial.println(genUUID("2dfffffffffd0101"));
  // set LED pin to output mode
  pinMode(ledPin, OUTPUT);
  ///BLEService bagService(genUUID("2dfffffffffd0101"));
  // begin initialization
  BLE.begin();

  // set advertised local name and service UUID:
  BLE.setLocalName("AA-TAG");
  BLE.setAdvertisedService(bagService);

  // add the characteristic to the service
  bagService.addCharacteristic(bagCharacteristic);
  bagService.addCharacteristic(userCharacteristic);

  // add service
  BLE.addService(bagService);

  // set the initial value for the characeristic:
  bagCharacteristic.setValue(1);
  userCharacteristic.setValue(15);
  
  // start advertising
  BLE.advertise();

  Serial.println("BLE LED Peripheral");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

    // while the central is still connected to peripheral:
    while (central.connected()) {
      // if the remote device wrote to the characteristic,
      // use the value to control the LED:
      
    }

    // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
  }
}
String genUUID(String userID)
{
  String uuid="";
  for(int i=0; i<16;i++)
  {
    uuid+=String(random(16),HEX);
  }
  uuid+=userID;
  return uuid;
}
/*
   Copyright (c) 2016 Intel Corporation.  All rights reserved.

   This library is free software; you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public
   License as published by the Free Software Foundation; either
   version 2.1 of the License, or (at your option) any later version.

   This library is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
   Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public
   License along with this library; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*/
