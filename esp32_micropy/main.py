import _thread
import network
import utime
import server
from machine import reset#,Timer
def reseter():
    utime.sleep(24*60*60*1000)
    reset()
ip='192.168.1.60'
def connect():
    wifi = network.WLAN(network.STA_IF)
    wifi.active(False)
    wifi.active(True)
    if not wifi.isconnected():
        wifi.active(True)
        wifi.connect('SSID', 'PSWD')
        while not wifi.isconnected():
            utime.sleep(10)
    print('network config:',wifi.ifconfig())
connect()
_thread.start_new_thread(server.goMiScan,())
_thread.start_new_thread(reseter,())
while True:
    utime.sleep_ms(100)
