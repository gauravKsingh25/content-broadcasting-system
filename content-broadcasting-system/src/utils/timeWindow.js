/**
 * Converts a Date or ISO date string to a Date instance.
 * @param {Date|string} value
 * @returns {Date}
 */
function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

/**
 * Checks whether current time is within an inclusive start-end window.
 * @param {Date|string|null|undefined} startTime
 * @param {Date|string|null|undefined} endTime
 * @returns {boolean}
 */
export function isWithinTimeWindow(startTime, endTime) {
  if (!startTime || !endTime) {
    return false;
  }

  const now = new Date();
  const start = toDate(startTime);
  const end = toDate(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }

  return now >= start && now <= end;
}

/**
 * Picks the active content item based on rotational durations.
 * @param {Array<{id: number, title: string, duration: number, rotation_order: number, start_time: Date|string, end_time: Date|string, [key: string]: any}>} contentItems
 * @param {Date|string} [referenceTime]
 * @returns {object|null}
 */
export function getActiveContentByRotation(contentItems, referenceTime = new Date()) {
  try {
    if (!Array.isArray(contentItems) || contentItems.length === 0) {
      return null;
    }

    const windowFiltered = contentItems.filter((item) => isWithinTimeWindow(item.start_time, item.end_time));
    if (windowFiltered.length === 0) {
      return null;
    }

    const sorted = [...windowFiltered].sort((a, b) => Number(a.rotation_order) - Number(b.rotation_order));
    const totalCycleDuration = sorted.reduce((total, item) => {
      const itemDurationMs = Number(item.duration) * 60 * 1000;
      return total + (Number.isFinite(itemDurationMs) ? itemDurationMs : 0);
    }, 0);

    if (totalCycleDuration <= 0) {
      return null;
    }

    const epochMs = Math.min(...sorted.map((item) => toDate(item.start_time).getTime()));
    if (!Number.isFinite(epochMs)) {
      return null;
    }

    const referenceDate = toDate(referenceTime);
    if (Number.isNaN(referenceDate.getTime())) {
      return null;
    }

    const elapsedMs = referenceDate.getTime() - epochMs;
    const positionInCycle = ((elapsedMs % totalCycleDuration) + totalCycleDuration) % totalCycleDuration;

    let accumulated = 0;
    for (const item of sorted) {
      const itemDurationMs = Number(item.duration) * 60 * 1000;
      if (!Number.isFinite(itemDurationMs) || itemDurationMs <= 0) {
        continue;
      }

      accumulated += itemDurationMs;
      if (positionInCycle < accumulated) {
        return item;
      }
    }

    return sorted[0] || null;
  } catch (_error) {
    return null;
  }
}