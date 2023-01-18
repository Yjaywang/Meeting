FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY /cert/certificate.crt /etc/ssl/certificate.crt
COPY /cert/private.key /etc/ssl/private.key