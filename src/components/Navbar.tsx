import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 rounded-br-xl rounded-bl-xl mx-auto bg-white/30 backdrop-blur-lg">
  <div className="flex m">
    <Link href="/">
      <span className="text-3xl font-bold text-blue-700">Crypto</span>
      <span className="text-3xl font-bold text-green-700">Tracker</span>
    </Link>
  </div>
  <ul className="flex gap-15 absolute left-1/2 transform -translate-x-1/2 list-none p-0 m-0 justify-center items-center">
    <li className="border-transparent hover:border-blue-200 border-b-2 hover:text-blue-200 transition duration-300 ease-in-out font-semibold">
      <Link href="/news">NEWS</Link>
    </li>
  </ul>
  <ModeToggle />
</nav>
  );
}

export default Navbar;
