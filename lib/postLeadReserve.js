export const INDEX_POSTLEAD_RESERVE_MODE_KEY = 'ub_index_postlead_reserve_mode_v1';
export const INDEX_POSTLEAD_RESERVE_MODE_EVENT = 'ub:index-postlead-reserve-mode';
export const INDEX_POSTLEAD_RESERVE_CLICK_EVENT = 'ub:index-postlead-reserve-click';
export const INDEX_POSTLEAD_RESERVE_RESULT_EVENT = 'ub:index-postlead-reserve-result';
export const INDEX_POSTLEAD_VIP_LEAD_EVENT = 'ub:index-postlead-vip-lead';

export function isIndexPostLeadReserveMode() {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(INDEX_POSTLEAD_RESERVE_MODE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setIndexPostLeadReserveMode(enabled) {
  if (typeof window === 'undefined') return;
  try {
    if (enabled) {
      sessionStorage.setItem(INDEX_POSTLEAD_RESERVE_MODE_KEY, '1');
    } else {
      sessionStorage.removeItem(INDEX_POSTLEAD_RESERVE_MODE_KEY);
    }
  } catch {
    // Ignore storage failures in private mode or restricted environments.
  }
  window.dispatchEvent(new CustomEvent(INDEX_POSTLEAD_RESERVE_MODE_EVENT, { detail: { enabled: !!enabled } }));
}

export function emitIndexPostLeadReserveClick(origin = 'unknown') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(INDEX_POSTLEAD_RESERVE_CLICK_EVENT, { detail: { origin } }));
}

export function emitIndexPostLeadReserveResult(status = 'ok') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(INDEX_POSTLEAD_RESERVE_RESULT_EVENT, { detail: { status } }));
}

export function emitIndexPostLeadVipLead(payload = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(INDEX_POSTLEAD_VIP_LEAD_EVENT, { detail: payload }));
}
