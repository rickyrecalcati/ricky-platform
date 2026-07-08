import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        <div className="logoCircle">R</div>
        <span>Ricky Recalcati</span>
      </Link>

      <div className="navLinks">
        <Link href="/books">Books</Link>
        <Link href="/articles">Articles</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  );
}
