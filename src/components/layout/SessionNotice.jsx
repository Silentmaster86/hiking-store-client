import { useAuth } from "../../context/auth-context";
export default function SessionNotice() {
  const { status, refresh } = useAuth();
  if (status !== "error") return null;
  return <div role="alert" style={{ padding: "14px 24px", background: "#101b2c", color: "#fca5a5" }}>
    We couldn’t check your sign-in status. Your session may still be active. <button type="button" onClick={refresh}>Retry connection</button>
  </div>;
}
