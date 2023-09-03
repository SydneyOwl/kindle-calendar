cd /owlcalendar
if [ -f "/owlcalendar/init" ]; then
    sed -i "s/【请替换000】/$TIANAPI/g" fetch.py && \
    sed -i "s/【请替换001】/$HEFENGAPI/g" fetch.py && \
    sed -i "s/【请替换002】/$CURRPOS/g" fetch.py && \
    sed -i "s/【请替换003】/http:\/\/\/127.0.0.1/g" app/app.json && \
    sed -i "s/【请替换003】/http:\/\/\/127.0.0.1/g" app/index.js && \
    sed -i "s/【请替换004】/$CITY/g" index.html && \
    sed -i "s/【请替换005】/$WIDGETKEY/g" index.html && \
    sed -i "s/【请替换006】/127.0.0.1/g" js/time.js && \
    sed -i "s/【请替换007】/127.0.0.1/g" js/time.js && \
    sed -i "s/【请替换008】/127.0.0.1/g" js/time.js && \
    sed -i "s/【请替换00a】/$WIDGETID/g" index.html && \
    sed -i "s/【请替换00b】/$WIDGETIDS/g" index.html && \
    rm -rf /owlcalendar/init
fi
nginx &
cd /owlcalendar/app
npm start &
cd ..
python3 fetch.py