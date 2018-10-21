## Inspiration

IATA has ruled out to implement RFID bag tacking from 2020. We mock implemented this as a bluetooth protocol network.

## What it does

Project Hermes scans bags and updates the location throughout the network on to the node.js server running MongoDB. The bags are tracked with bluetooth and whenever it is near the scanner, it updates the location.

## How we built it

We used Arduino 101s to build the bluetooth communication network which interfaces with PCs( we attempted the Qualcomm boards but they couldn't connect to the Wifi). Those commands get sent through python to the node.js server which interprets the commands and updates the MongoDB database. From there, the client side using react and redux gets the updates and displays them. The database is hosted in Azure.

## Challenges we ran into

The qualcomm DragonBoard 410c cannot connect to the venue's WiFi network due to having to agree to a terms and conditions. We attempted several workarounds but due to the location in the building, we couldn't get cellular signal. Therefore, we couldn't even use hotspots to make it work. The RFID sensors that we initially planned to use was not soldered and we were not allowed to use it due to health hazards. Thus, we ended up using bluetooth. The bluetooth protocol, while robust, is not ideal for this situation due to its focus on sustained connections not momentary ones. This made programming with Arduinos as bluetooth devices exceedingly challenging. Also, the clock speed is slower  in Arduino than Qualcomm boards. Additionally, a few of the boards had issues with their boot loaders which had to be redone. 

## Accomplishments that we're proud of
We got the hardware to work in the end. The user-client tracking side works as well.

## What we learned
The bluetooth protocol, how to host a domain and cloud platform. 

## What's next for Project Hermes
 Next we plan to use RFID chips and scanners to track the bags instead of bluetooth.