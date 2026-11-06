import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageMetadata } from "../../utils/pageMetadata";
export default function PageMetadata({ title, description }) {
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (/^\/products\/[^/]+$/.test(pathname) && !title) return;
    const metadata = pageMetadata(pathname, search);
    document.title = title || metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description || metadata.description);
  }, [pathname, search, title, description]);
  return null;
}
