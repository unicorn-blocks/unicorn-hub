/**
 * 域名检测工具
 * 用于区分 VIP 域名和主站域名
 */

/**
 * 检测是否为 VIP 域名
 * @param {string} host - 请求的 host header (例如 "vip.unicornblocks.ai" 或 "vip.unicornblocks.ai:3000")
 * @returns {boolean} - 是否为 VIP 域名
 */
export function isVipHost(host = "") {
    // 移除端口号，转小写，精确匹配
    const hostname = host.split(":")[0].toLowerCase();
    return hostname === "vip.unicornblocks.ai";
}

/**
 * 检测是否为主站域名
 * @param {string} host - 请求的 host header
 * @returns {boolean} - 是否为主站域名
 */
export function isMainHost(host = "") {
    const hostname = host.split(":")[0].toLowerCase();
    return hostname === "unicornblocks.ai" || hostname === "www.unicornblocks.ai";
}
