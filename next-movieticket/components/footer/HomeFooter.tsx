import Image from "next/image";
import Link from "next/link";

const logo = "/logo.png";
const khaltilogo = "/khaltilogo.png";

export default function HomeFooter() {
  return (
    <footer className="bg-[#f5f1e8] text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="logo"
              width={80}
              height={80}
              className="w-20 h-auto"
            />
            <h2 className="text-xl font-bold">CineTix</h2>
          </div>
        </div>

        <div>
          <h3 className="text-orange-500 font-semibold mb-3">ABOUT</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">About Us</Link>
            </li>
            <li>
              <Link href="#">Terms And Conditions</Link>
            </li>
            <li>
              <Link href="#">Careers</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-orange-500 font-semibold mb-3">HELP & SUPPORT</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">Contact Us</Link>
            </li>
            <li>
              <Link href="#">FAQs</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-orange-500 font-semibold mb-3">
            CUSTOMER SUPPORT & INQUIRIES
          </h3>
          <ul className="space-y-2 text-sm">
            <li>+977-9817847087</li>
            <li>+977-9761526757</li>
          </ul>

          <div className="mt-4">
            <h4 className="text-orange-500 font-semibold mb-2">
              PAYMENT PARTNER
            </h4>
            <Image
              src="/khaltilogo.png"
              alt="khalti"
              width={120}
              height={50}
              className="w-28 h-auto"
            />
          </div>
        </div>
      </div>
      <div className="text-center text-sm py-4 border-t">
        © {new Date().getFullYear()} CineTix | All rights reserved
      </div>
    </footer>
  );
}
