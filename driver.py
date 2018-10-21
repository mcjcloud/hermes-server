import serial
import time
import requests

ser = serial.Serial('/dev/tty.usbmodem14201', 9600)  #change ACM number as found from ls /dev/tty/ACM*

print 'connected'

while True:
    line = ser.readline().replace("-", "")
    half_one = line[:16]
    half_two = line[16:32]
    station_num = line[33]
    print half_one
    print half_two
    print station_num
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        'bag': {
            'bag_id': half_one,
            'user_id': half_two
        },
        'scanner_id': station_num
    }
    print data
    r = requests.post(url = "http://localhost:3000/bags/" + str(half_one), headers = headers, json = data)
    print r.text

