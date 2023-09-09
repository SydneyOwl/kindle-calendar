FROM node:lts-bullseye
WORKDIR /owlcalendar
COPY fonts/fonts/* /usr/share/fonts/
COPY backend ./
COPY frontend ./
COPY start.sh ./
COPY site-config.conf ./
ENV TZ Asia/Shanghai
ENV LANG C.UTF-8
RUN chmod 755 start.sh && \
    touch init && \
    apt update && \
    apt install -y libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2 python3 python3-pip nginx && \
    mv site-config.conf /etc/nginx/sites-enabled && \
    rm -rf /var/lib/apt/lists/* && pip3 install flask requests flask_cors && cd app && npm install
CMD ["/bin/bash","/owlcalendar/start.sh"]