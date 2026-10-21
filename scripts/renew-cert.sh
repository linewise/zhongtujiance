#!/bin/bash
# Let's Encrypt 证书续期（webroot 模式，校验目录挂载在 nginx 的 /data/www/certbot）
docker run --rm \
  -v /data/www/zhongtujiance/certbot:/var/www/certbot \
  -v /etc/letsencrypt:/etc/letsencrypt \
  quay.io/letsencrypt/letsencrypt:latest renew --webroot -w /var/www/certbot --non-interactive
# 续期后重载 nginx 使新证书生效
docker exec nginx nginx -s reload
