charge=$(cat /sys/class/power_supply/max77696-battery/status)
batt=$(gasgauge-info -s)
curl --connect-timeout 3 http://【修改】:4000?batt=${batt}\&charge=${charge} -o /mnt/us/status.png
if [ $? -ne 0 ]; then
   eips -g /mnt/us/noconn.png
   return 1
fi
load=$(uptime | sed 's/ //g' | awk -F: '{print $NF}')
temp_str=$(cat /sys/devices/system/wario_battery/wario_battery0/battery_temperature)
celsius=$(( ($temp_str - 32) * 5 / 9 ))
eips -g /mnt/us/status.png
eips 13 59 "MrOwlKindleAvgLoad:"$load" temp:"$celsius
