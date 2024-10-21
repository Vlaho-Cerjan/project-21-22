'use client';

export default function IsItMobile() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) ||
    window.innerWidth < 768
  ) {
    // true for mobile device
    return true;
  }
  // false for not mobile device
  return false;
}
