import { Component } from "react";
export default class AppErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main style={{ margin: "48px auto", padding: 24, maxWidth: 700 }}>
      <h1>We couldn’t display this page</h1><p>Please reload the page to try again.</p>
      <button type="button" onClick={() => window.location.reload()}>Reload page</button> <a href="/">Go to home</a>
    </main>;
    return this.props.children;
  }
}
