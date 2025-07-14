import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 mt-16">
      {/* Top 4 Columns */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-4">Need Help</h3>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link className="hover:text-red-700" href="/contact">
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/returns">
                Returns and Refunds
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/track-order">
                Track Order
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/faqs">
                FAQs
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/account">
                My Account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link className="hover:text-red-700" href="/about">
                About Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/careers">
                Careers
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/investors">
                Investors Relation
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/gift-voucher">
                Gift Voucher
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/community">
                Community Initiatives
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">More Info</h3>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link className="hover:text-red-700" href="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/terms">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/sitemap">
                Sitemap
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/notifications">
                Get Notified
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/blog">
                Blogs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Store Near Me</h3>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link className="hover:text-red-700" href="/stores/mumbai">
                Mumbai
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/stores/delhi">
                Delhi
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/stores/bangalore">
                Bangalore
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/stores/hyderabad">
                Hyderabad
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/stores/kolkata">
                Kolkata
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-700" href="/stores/gurgaon">
                Gurgaon
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* App Download Buttons */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10 flex flex-col items-center justify-between gap-4">
        <span className="text-sm font-medium text-gray-700 uppercase">
        experience the StayDrippy app
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/badge/play-store-badge.png"
              alt="Get it on Google Play"
              className="h-10 "
            />
          </a>
          <a
            href="https://www.apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/badge/app-store-badge.png"
              alt="Download on the App Store"
              className="h-10  "
            />
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300 py-6 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Payment Methods */}
          <div className="hidden md:flex items-center gap-3">
            <span className="font-medium text-gray-800">Payment Methods:</span>
            <img
              src="/payment/phonepa.png"
              alt="PhonePe"
              className="h-6"
            />
            <img
              src="/payment/gpay.webp"
              alt="GPay"
              className="h-6"
            />
            <img
              src="/payment/paytm.png"
              alt="Paytm"
              className="h-4"
            />
          </div>

          {/* All Rights Reserved */}
          <div className="text-center text-gray-600 text-sm">
            Made by Binay {new Date().getFullYear()}. All Rights Reserved
          </div>

          {/* Shipping Partners */}
          <div className="hidden md:flex items-center gap-3">
            <span className="font-medium text-gray-800">
              Shipping Partners:
            </span>
            <img
              src="/deliveryPtr/delhivery.png"
              alt="Delhivery"
              className="h-6"
            />
            <img
              src="/deliveryPtr/ekart.png"
              alt="Ekart"
              className="h-6"
            />
            <img
              src="/deliveryPtr/xpress.webp"
              alt="Xpressbees"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
