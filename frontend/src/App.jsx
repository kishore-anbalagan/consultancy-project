import { useMemo, useState } from 'react';
import products from './data/products';

const testimonials = [
  { name: 'Ramlal Patil', text: 'Agriclinic transformed my farming! Their products are top-notch.' },
  { name: 'Radhakisan Kale', text: 'The expert advice helped me boost my crop yield significantly.' },
  { name: 'Malanbai Sanap', text: 'Great variety of products and easy online ordering experience!' },
  { name: 'Bappusaheb Gayakwad', text: 'I love the quality! They really care about sustainable farming.' },
];

const whyChooseUs = [
  { title: 'Wide Product Range', desc: 'From pesticides to fertilizers, all agricultural needs in one place.' },
  { title: 'Expert Advice', desc: 'Professional guidance tailored to your farming needs.' },
  { title: 'Quality Assured', desc: 'Premium products sourced from trusted manufacturers.' },
  { title: 'Sustainable Practices', desc: 'Eco-friendly solutions to enhance productivity.' },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?auto=format&fit=crop&w=400&q=60',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=400&q=60',
  'https://images.unsplash.com/photo-1500382017468-7049fae79eab?auto=format&fit=crop&w=400&q=60',
  'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=400&q=60',
  'https://images.unsplash.com/photo-1621249903875-34575b92b0c5?auto=format&fit=crop&w=400&q=60',
  'https://images.unsplash.com/photo-1576526214881-9b2b6c0e1c0f?auto=format&fit=crop&w=400&q=60',
];

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map((p) => p.category)))], []);

  const filtered = products.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase()),
  );

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const addToCart = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } else {
      setCart((prev) => ({
        ...prev,
        [productId]: qty,
      }));
    }
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ ...products.find((p) => p.id === id), quantity: qty }))
    .filter(Boolean);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#059669', fontWeight: 700, cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
            🌾 Agri-Clinic
          </h1>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => scrollToSection('home')} style={{ background: 'none', border: 'none', color: activeSection === 'home' ? '#059669' : '#6b7280', fontWeight: activeSection === 'home' ? 700 : 500, cursor: 'pointer', fontSize: '1rem' }}>Home</button>
            <button onClick={() => scrollToSection('about')} style={{ background: 'none', border: 'none', color: activeSection === 'about' ? '#059669' : '#6b7280', fontWeight: activeSection === 'about' ? 700 : 500, cursor: 'pointer', fontSize: '1rem' }}>About Us</button>
            <button onClick={() => scrollToSection('explore')} style={{ background: 'none', border: 'none', color: activeSection === 'explore' ? '#059669' : '#6b7280', fontWeight: activeSection === 'explore' ? 700 : 500, cursor: 'pointer', fontSize: '1rem' }}>Explore</button>
            <button onClick={() => scrollToSection('reviews')} style={{ background: 'none', border: 'none', color: activeSection === 'reviews' ? '#059669' : '#6b7280', fontWeight: activeSection === 'reviews' ? 700 : 500, cursor: 'pointer', fontSize: '1rem' }}>Reviews</button>
            <button onClick={() => scrollToSection('gallery')} style={{ background: 'none', border: 'none', color: activeSection === 'gallery' ? '#059669' : '#6b7280', fontWeight: activeSection === 'gallery' ? 700 : 500, cursor: 'pointer', fontSize: '1rem' }}>Gallery</button>
            <button onClick={() => scrollToSection('contact')} style={{ background: 'none', border: 'none', color: activeSection === 'contact' ? '#059669' : '#6b7280', fontWeight: activeSection === 'contact' ? 700 : 500, cursor: 'pointer', fontSize: '1rem' }}>Contact</button>
            <button
              type="button"
              onClick={() => setShowCart(!showCart)}
              style={{
                position: 'relative',
                padding: '0.6rem 1rem',
                borderRadius: '0.5rem',
                background: '#059669',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              🛒
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#dc2626',
                    color: '#fff',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Modal */}
      {showCart && (
        <div style={{ padding: '1rem 2rem', marginBottom: '2rem', maxWidth: '1200px', margin: '0 auto 2rem', border: '2px solid #059669', borderRadius: '0.75rem', background: '#ecfdf5' }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#059669' }}>Shopping Cart ({cartCount} items)</h2>
          {cartItems.length === 0 ? (
            <p style={{ color: '#059669', margin: 0 }}>Your cart is empty. Start shopping!</p>
          ) : (
            <>
              <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#fff', borderRadius: '0.5rem', border: '1px solid #d1fae5' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>{item.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>INR {item.price} each</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button type="button" onClick={() => updateCartQty(item.id, item.quantity - 1)} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.3rem', border: '1px solid #059669', background: '#fff', color: '#059669', cursor: 'pointer', fontWeight: 600 }}>
                        −
                      </button>
                      <span style={{ width: '30px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                      <button type="button" onClick={() => updateCartQty(item.id, item.quantity + 1)} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.3rem', border: '1px solid #059669', background: '#fff', color: '#059669', cursor: 'pointer', fontWeight: 600 }}>
                        +
                      </button>
                    </div>
                    <div style={{ width: '100px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>INR {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #d1fae5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#059669' }}>Total: INR {cartTotal.toFixed(2)}</div>
                <button type="button" style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', background: '#059669', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* HOME SECTION */}
      <section id="home" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#fff', padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>Welcome to Agri-Clinic</h2>
          <p style={{ fontSize: '1.1rem', margin: '0 0 1.5rem 0', lineHeight: 1.6 }}>
            Your one-stop solution for premium pesticides, herbicides, and fertilizers. Empower your farm with quality products and expert guidance.
          </p>
          <button onClick={() => scrollToSection('explore')} style={{ padding: '0.8rem 2rem', background: '#fff', color: '#059669', border: 'none', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}>
            Shop Now
          </button>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" style={{ padding: '4rem 2rem', background: '#fff', marginBottom: '3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1f2937', textAlign: 'center' }}>About Agri-Clinic</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#059669' }}>🎯 Our Mission</h3>
              <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>To empower farmers with the best agricultural products and expert advice for sustainable farming.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#059669' }}>👁️ Our Vision</h3>
              <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>To be India's leading agricultural e-commerce platform, transforming farming practices.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#059669' }}>💚 Our Values</h3>
              <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>Integrity, Sustainability, Community, Innovation — every product and service reflects these values.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE / PRODUCTS SECTION */}
      <section id="explore" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>Explore Our Products</h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            style={{ flex: 1, minWidth: '250px', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '1rem' }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '1rem', minWidth: '150px' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ background: '#fff', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
              <div style={{ height: 200, background: '#f3f4f6', overflow: 'hidden' }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, marginBottom: '0.5rem' }}>{p.category}</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1f2937' }}>{p.name}</h3>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.5 }}>{p.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>INR {p.price}</div>
                    <div style={{ fontSize: '0.85rem', color: p.stock > 0 ? '#059669' : '#dc2626', fontWeight: 500 }}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button type="button" style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #059669', background: '#fff', color: '#059669', cursor: 'pointer', fontWeight: 600 }}>
                    View more
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(p.id)}
                    disabled={p.stock === 0}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '0.5rem',
                      background: p.stock > 0 ? '#059669' : '#d1d5db',
                      color: '#fff',
                      border: 'none',
                      cursor: p.stock > 0 ? 'pointer' : 'not-allowed',
                      fontWeight: 600,
                    }}
                  >
                    Buy now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ background: '#f3f4f6', padding: '3rem 2rem', marginBottom: '3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1f2937', textAlign: 'center' }}>Why Choose Agri-Clinic?</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>We are committed to providing quality products and expert services to farmers.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {whyChooseUs.map((item, i) => (
              <div key={i} style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#059669', fontSize: '1.1rem' }}>{item.title}</h3>
                <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" style={{ padding: '3rem 2rem', marginBottom: '3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1f2937', textAlign: 'center' }}>What Our Customers Say</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>Real experiences from farmers who trust us.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #059669' }}>
                <p style={{ margin: '0 0 1rem 0', color: '#4b5563', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.text}"</p>
                <p style={{ margin: 0, fontWeight: 700, color: '#059669' }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" style={{ padding: '3rem 2rem', background: '#f3f4f6', marginBottom: '3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1f2937', textAlign: 'center' }}>Gallery</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>A glimpse of our farming solutions in action.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {galleryImages.map((img, i) => (
              <div key={i} style={{ height: 250, borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <img src={img} alt={`gallery-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section style={{ background: '#059669', color: '#fff', padding: '3rem 2rem', marginBottom: '3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>25000+</div>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>Happy Farmers</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>30+</div>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>Expert Advisors</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>12</div>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>Quality Products</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" style={{ padding: '3rem 2rem', background: '#fff', marginBottom: '3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937', textAlign: 'center' }}>Contact Us</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>📱</p>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#059669' }}>Phone</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>9876543210</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>📧</p>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#059669' }}>Email</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>info@agriclinic.com</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>📍</p>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#059669' }}>Location</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>Pune, Maharashtra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1f2937', color: '#9ca3af', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#fff' }}>🌾 Agri-Clinic</h3>
              <p>Empowering farmers with quality products and expert advice.</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.75rem 0', color: '#fff' }}>Quick Links</h4>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#home" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#about" style={{ color: '#9ca3af', textDecoration: 'none' }}>About</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#explore" style={{ color: '#9ca3af', textDecoration: 'none' }}>Products</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.75rem 0', color: '#fff' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: '#9ca3af', fontSize: '1.2rem' }}>📘</a>
                <a href="#" style={{ color: '#9ca3af', fontSize: '1.2rem' }}>🐦</a>
                <a href="#" style={{ color: '#9ca3af', fontSize: '1.2rem' }}>📷</a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #374151', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>© 2025 Agri-Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
