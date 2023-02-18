import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main id="content">
      <h1>My Notes App</h1>
      <Link to="/notes">Notes</Link>
    </main>
  );
}
