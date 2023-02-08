#get batt info here...
batt=$(gasgauge-info -s)
curl http://YOUR_SERVER?batt=$batt -o status.png
load=$(uptime | sed 's/ //g' | awk -F: '{print $4}')
eips -g status.png
eips 19 59 "KindleAvgLoad:"$load
