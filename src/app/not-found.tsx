import Image from 'next/image';
import Link from 'next/link';
import './not-found.css';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="background-image">
        <Image src="/images/NotFound/andrej-lisakov-kw6UuM73OjM-unsplash 1-1.png" alt="404 Background" fill style={{ objectFit: 'cover' }} priority />
        <div className="overlay" />
      </div>
      <div className="content">
        <h1>404</h1>
        <h2>Oh no! Page Not Found!</h2>
        <p>The page is under maintenance.<br />While you&apos;re here, let&apos;s see which product is right for you!</p>
        <Link href="/products" className="view-product-btn">View product</Link>
      </div>
    </div>
  );
}
