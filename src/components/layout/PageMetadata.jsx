import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageMetadata } from "../../utils/pageMetadata";
export default function PageMetadata() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const metadata = pageMetadata(pathname, search);
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
  }, [pathname, search]);
  return null;
}
