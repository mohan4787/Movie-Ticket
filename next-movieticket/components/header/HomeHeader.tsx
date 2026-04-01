import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";

const HomeHeader = () => {
  return (
    <header>
      <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 shadow-md">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl">
          <Link href="/" className="flex items-center space-x">
            <Image
              src={logo}
              alt="CineTix Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-red-600">CineTix</span>
          </Link>

          <div className="flex items-center lg:order-2">
            <Link
              href="/login"
              target="_new"
              className="text-gray-700 hover:text-red-600 font-medium text-sm px-4 py-2"
            >
              Login
            </Link>
          </div>

          <div className="hidden lg:flex lg:w-auto lg:order-1">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link href="/" className="text-gray-800 hover:text-red-600">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/movie"
                  className="text-gray-700 hover:text-red-600"
                >
                  Movie
                </Link>
              </li>

              <li>
                <Link
                  href="/upcomingmovie"
                  className="text-gray-700 hover:text-red-600"
                >
                  Upcoming Movie
                </Link>
              </li>

              <li>
                <Link
                  href="/showtimes"
                  className="text-gray-700 hover:text-red-600"
                >
                  Showtimes
                </Link>
              </li>

              <li>
                <Link
                  href="/my-bookings"
                  className="text-gray-700 hover:text-red-600"
                >
                  My Bookings
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-red-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HomeHeader;
