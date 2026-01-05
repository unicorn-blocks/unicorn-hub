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
    // ✅ 线上唯一 VIP 域名（永远不变）
    if (hostname === "vip.unicornblocks.ai") return true;

    // ✅ 仅本地/开发允许的 VIP 域名
    if (process.env.NODE_ENV !== "production") {
        if (hostname === "vip.unicornblocks.local") return true;
        // 你也可以顺手支持 test：
        // if (hostname === "vip.unicornblocks.test") return true;
    }

    return false;

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
