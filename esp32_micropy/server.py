from binascii import hexlify
from bluetooth import BLE
from micropython import const
from time import localtime,sleep
import urequests
import gc
co=0
_IRQ_SCAN_RESULT = const(5)
_IRQ_SCAN_DONE = const(6)
oTemp,oHumi,iTemp,iHumi,oBatt,oLeng = '--','--','--','--','--','--'
from struct import unpack
def parse_adv_data(hexvalue):
    vlength = len(hexvalue)
    if vlength == 19:
        firmware = "PVVX (No encryption)"
        sensor_type = "CUSTOM"
        (temp, humi, volt, batt, packet_id, trg) = unpack("<hHHBBB", hexvalue[10:])
        result = {
            "t": temp / 100,
            "h": humi / 100,
            "v": volt / 1000,
            "b": batt,
            "s": (trg >> 1) & 1,
            "o": (trg ^ 1) & 1}
        return result
    return {}


def printAll():
    print("in")
def log(*args):
    y, mo, d, h, mi, s, wkd, yd = localtime()
    print("[{:04d}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}]".format(y, mo, d, h, mi, s), *args)
    

def handle_scan(ev, data):
    global oTemp,oHumi,oBatt,oLeng,co
    if ev == _IRQ_SCAN_RESULT:
        try:
            addr = hexlify(data[1], ":").decode()
            typeSens = "inside"
            if addr=="INSIDE_MAC" or addr=="OUTSIDE_MAC":
                if addr=="OUTSIDE_MAC":
                    typeSens="outside"
                rssi = str(data[3])
                parsed = parse_adv_data(data[4])
                if parsed=={}:
                    pass
                else:
                    oTemp=str(parsed["t"])
                    oHumi=str(parsed["h"])
                    oBatt = str(parsed["b"])
                    oLeng=rssi
                    printAll()
                    gc.collect()
                    urequests.get("http://YOUR_ADDR/weather?name={}&temp={}&hum={}&bat={}".format(typeSens,oTemp,oHumi,oBatt))
                    log("Device {0} (RSSI {1}):".format(addr, rssi), parsed)
        except Exception as e:
            print(repr(e))
    elif ev == _IRQ_SCAN_DONE:
        log("Scan done.")
    else:
        log("Unexpected event: {0}".format(ev))

def goMiScan():
    BLE().active(True)
    BLE().irq(handle_scan)
    BLE().gap_scan(0, 55_000, 25_250)
