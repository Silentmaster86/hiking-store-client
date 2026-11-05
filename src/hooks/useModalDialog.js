import { useEffect, useRef } from "react";
const focusable = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
export function useModalDialog(open) {
  const ref = useRef(null), trigger = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) { dialog.close(); trigger.current?.focus(); }
      return;
    }
    if (!dialog.open) {
      trigger.current = document.activeElement;
      dialog.showModal();
      dialog.querySelector(focusable)?.focus();
    }
    function containFocus(event) {
      if (event.key !== "Tab") return;
      const controls = [...dialog.querySelectorAll(focusable)].filter((element) => element.getClientRects().length && !element.closest("[inert]"));
      const first = controls[0], last = controls.at(-1), current = document.activeElement;
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      if (event.shiftKey && (current === first || !dialog.contains(current))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (current === last || !dialog.contains(current))) { event.preventDefault(); first.focus(); }
    }
    dialog.addEventListener("keydown", containFocus);
    return () => dialog.removeEventListener("keydown", containFocus);
  }, [open]);
  return ref;
}
export function closeOnBackdrop(event, close) {
  if (event.target !== event.currentTarget) return;
  const rect = event.currentTarget.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
}
