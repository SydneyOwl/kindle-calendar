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
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye main contrib non-free\ndeb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-updates main contrib non-free\ndeb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-backports main contrib non-free\ndeb https://mirrors.tuna.tsinghua.edu.cn/debian-security bullseye-security main contrib non-free" > /etc/apt/sources.list && \
    apt update && \
    apt install -y libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2 python3 python3-pip nginx && \
    mv site-config.conf /etc/nginx/sites-enabled && \
    rm -rf /var/lib/apt/lists/*
RUN pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple flask requests flask_cors 
RUN cd app && npm --registry https://registry.npm.taobao.org install
CMD ["/bin/bash","/owlcalendar/start.sh"]