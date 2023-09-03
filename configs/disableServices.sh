sleep 15
# Disable screensaver
lipc-set-prop com.lab126.powerd preventScreenSaver 1

# # Disable wireless
# lipc-set-prop com.lab126.cmd wirelessEnable 0

# Disable useless services
stop lab126_gui
stop x
# stop framework
stop otaupd
stop phd
stop tmd
stop todo
#stop mcsd
stop archive
stop dynconfig
stop dpmd
stop appmgrd
stop stackdumpd
eips -g /mnt/us/booting.png
