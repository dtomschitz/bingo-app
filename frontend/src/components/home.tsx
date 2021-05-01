import {
  Link
} from "react-router-dom";

export default function Home() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/app">app</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}