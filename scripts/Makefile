# Let's Encrypt 证书操作入口（实际逻辑在 certbot.sh）
# 在服务器上执行：cd /data/www/zhongtujiance/scripts && make cert

APP_DIR ?= /data/www/zhongtujiance
DOMAIN  ?= zhongtujiance.com
DOMAINS ?= www.$(DOMAIN)
EMAIL   ?= 516364218@qq.com

export APP_DIR DOMAIN DOMAINS EMAIL

CERTBOT := ./certbot.sh

.DEFAULT_GOAL := help

.PHONY: help cert cert-staging cert-force renew cert-status

help:
	@echo "用法:"
	@echo "  make cert            首次申请（已存在则按需续期）"
	@echo "  make cert-staging    测试环境演练，不消耗正式额度"
	@echo "  make cert-force      强制重签（staging 转正式时用）"
	@echo "  make renew           续期，可加入 crontab"
	@echo "  make cert-status     查看证书有效期"
	@echo ""
	@echo "可用变量: APP_DIR=$(APP_DIR) DOMAIN=$(DOMAIN) DOMAINS=$(DOMAINS) EMAIL=$(EMAIL)"

cert:
	$(CERTBOT) issue

cert-staging:
	$(CERTBOT) issue --staging

cert-force:
	$(CERTBOT) issue --force

renew:
	$(CERTBOT) renew

cert-status:
	$(CERTBOT) status
