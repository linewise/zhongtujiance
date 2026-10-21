#!/usr/bin/env bash
# 使用 docker 镜像 certbot/certbot 为 zhongtujiance.com 申请 / 续期 Let's Encrypt 证书
# 证书与 ACME 校验文件统一放在 nginx/config/certbot 下
#
# 用法：
#   ./certbot.sh issue            # 首次申请
#   ./certbot.sh issue --staging  # 先用测试环境演练，不消耗正式额度
#   ./certbot.sh issue --force    # 强制重签（staging 演练转正式时用）
#   ./certbot.sh renew            # 续期（建议加入 crontab）
#   ./certbot.sh status           # 查看当前证书有效期
#
# 可用环境变量：
#   APP_DIR   服务器上的项目根目录，默认 /data/www/zhongtujiance
#   DOMAIN    主域名，默认 zhongtujiance.com（证书名也用它）
#   DOMAINS   额外域名，空格分隔，默认 www.<主域名>，设为空字符串则只签主域名
#   EMAIL     Let's Encrypt 账号邮箱，默认 516364218@qq.com
#   STAGING   1 = 使用测试环境
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

APP_DIR="${APP_DIR:-/data/www/zhongtujiance}"
[[ -d "${APP_DIR}/nginx" ]] || APP_DIR="${ROOT_DIR}"

DOMAIN="${DOMAIN:-zhongtujiance.com}"
DOMAINS="${DOMAINS-www.${DOMAIN}}"   # 额外域名，设为空字符串则只申请主域名
EMAIL="${EMAIL:-516364218@qq.com}"
STAGING="${STAGING:-0}"

CERTBOT_IMAGE="${CERTBOT_IMAGE:-certbot/certbot:latest}"

CERTS_DIR="${APP_DIR}/nginx/config/certbot"
WWW_DIR="${CERTS_DIR}/www"
LIVE_DIR="${CERTS_DIR}/live/${DOMAIN}"
RENEWAL_CONF="${CERTS_DIR}/renewal/${DOMAIN}.conf"

log() { printf '[certbot] %s\n' "$*"; }
die() { printf '[certbot] 错误: %s\n' "$*" >&2; exit 1; }

# 容器内 /etc/letsencrypt 对应 nginx/config/certbot，
# /var/www/certbot 对应 nginx/config/certbot/www（nginx 侧的 ACME 校验目录）
certbot_run() {
    docker run --rm \
        -v "${CERTS_DIR}:/etc/letsencrypt" \
        -v "${WWW_DIR}:/var/www/certbot" \
        "${CERTBOT_IMAGE}" "$@"
}

ensure_dirs() {
    mkdir -p "${WWW_DIR}/.well-known/acme-challenge"
}

# 判断现有证书是否已覆盖全部待申请域名（用于追加 www 等域名时自动重签）
cert_covers_domains() {
    local san host
    san=$(docker run --rm -v "${CERTS_DIR}:/etc/letsencrypt:ro" --entrypoint sh "${CERTBOT_IMAGE}" -c \
        "openssl x509 -in '/etc/letsencrypt/live/${DOMAIN}/fullchain.pem' -noout -ext subjectAltName" 2>/dev/null \
        | grep -oE 'DNS:[^,[:space:]]+' | sed 's/^DNS://' || true)
    for host in "$@"; do
        grep -qx -- "${host}" <<<"${san}" || return 1
    done
}

cmd_issue() {
    local staging="${STAGING}" force=0
    for arg in "$@"; do
        case "${arg}" in
            --staging) staging=1 ;;
            --force)   force=1 ;;
            *) die "未知参数: ${arg}" ;;
        esac
    done

    ensure_dirs

    if [[ -f "${LIVE_DIR}/fullchain.pem" && -f "${RENEWAL_CONF}" ]]; then
        if cert_covers_domains "${DOMAIN}" ${DOMAINS}; then
            log "已存在 ${DOMAIN} 的证书，本次仅按需续期（未临近到期不会重新签发）"
        else
            force=1
            log "现有证书未包含 ${DOMAIN} ${DOMAINS} 的全部域名，将重新签发"
        fi
    fi

    local args=(certonly
        --webroot -w /var/www/certbot
        --cert-name "${DOMAIN}"
        -d "${DOMAIN}"
        --email "${EMAIL}"
        --agree-tos --no-eff-email
        --non-interactive
        --keep-until-expiring)
    local d
    for d in ${DOMAINS}; do
        args+=(-d "${d}")
    done
    [[ "${staging}" == "1" ]] && args+=(--staging)
    [[ "${force}" == "1" ]] && args+=(--force-renewal)

    log "开始申请证书：${DOMAIN} ${DOMAINS}"
    certbot_run "${args[@]}"

    log "完成，证书位于 ${LIVE_DIR}"
    cmd_status
}

cmd_renew() {
    ensure_dirs
    [[ -f "${RENEWAL_CONF}" ]] || die "尚未申请过证书，请先执行 issue"

    log "检查并续期证书"
    certbot_run renew --non-interactive
    log "续期检查完成"
}

cmd_status() {
    [[ -f "${LIVE_DIR}/fullchain.pem" ]] || die "证书不存在：${LIVE_DIR}"
    docker run --rm -v "${CERTS_DIR}:/etc/letsencrypt:ro" --entrypoint sh "${CERTBOT_IMAGE}" -c \
        "openssl x509 -in '/etc/letsencrypt/live/${DOMAIN}/fullchain.pem' -noout -subject -issuer -dates"
}

case "${1:-}" in
    issue)  shift; cmd_issue "$@" ;;
    renew)  cmd_renew ;;
    status) cmd_status ;;
    *)
        sed -n '2,17p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
        exit 1
        ;;
esac
