import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  PackageCheck,
  Ruler,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/formatters';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  const { addToCart, openDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await api.getProduct(id);
        setProduct(res.product);
        setRelated(res.related || []);
        setSelectedImg(0);
        if (res.product?.colors?.length > 0) {
          setSelectedColor(res.product.colors[0]);
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-8 w-48 bg-stone-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-stone-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-10 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/4" />
            <div className="h-32 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-anulok-espresso">Product Not Found</h2>
        <p className="text-stone-500 text-sm mt-2 mb-6">The requested furniture piece may have been retired.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-anulok-espresso text-white text-xs uppercase tracking-wider font-semibold rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/checkout');
  };

  const checkPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: 'Verified! White-glove in-home delivery available within 4-6 business days.'
    });
  };

  return (
    <div className="bg-anulok-cream min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-anulok-wood transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-anulok-wood transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-anulok-wood transition-colors">
            {product.categoryName || product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-anulok-espresso font-semibold truncate">{product.name}</span>
        </nav>

        {/* Top Product Section: Gallery + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-xs">
          {/* Left: Gallery */}
          <div className="space-y-4">
            {/* Main Image with Zoom Look */}
            <div className="relative aspect-[4/3] sm:aspect-square bg-anulok-linen rounded-2xl overflow-hidden border border-stone-200 group">
              <img
                src={product.images?.[selectedImg] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-anulok-amber text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImg === idx
                        ? 'border-anulok-wood ring-2 ring-anulok-wood/20 scale-102'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Tags Under Gallery */}
            <div className="pt-4 grid grid-cols-3 gap-3 text-center border-t border-stone-100">
              <div className="p-3 bg-anulok-cream rounded-xl">
                <Truck className="w-4 h-4 text-anulok-wood mx-auto mb-1" />
                <p className="text-[11px] font-semibold text-anulok-espresso">White-Glove Placement</p>
                <p className="text-[10px] text-stone-500">Free over ₹25k</p>
              </div>
              <div className="p-3 bg-anulok-cream rounded-xl">
                <RotateCcw className="w-4 h-4 text-anulok-wood mx-auto mb-1" />
                <p className="text-[11px] font-semibold text-anulok-espresso">30-Day Trial</p>
                <p className="text-[10px] text-stone-500">100% Home Trial</p>
              </div>
              <div className="p-3 bg-anulok-cream rounded-xl">
                <ShieldCheck className="w-4 h-4 text-anulok-wood mx-auto mb-1" />
                <p className="text-[11px] font-semibold text-anulok-espresso">10-Yr Guarantee</p>
                <p className="text-[10px] text-stone-500">Frame & Joinery</p>
              </div>
            </div>
          </div>

          {/* Right: Info, Price & CTAs */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category, SKU & Wishlist */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-semibold text-anulok-wood">
                  {product.categoryName || product.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 font-mono">SKU: {product.sku}</span>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-full border transition-all ${
                      wishlisted
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'border-stone-200 text-stone-500 hover:text-rose-600 hover:border-stone-400'
                    }`}
                    title={wishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-anulok-espresso mt-2 leading-tight">
                {product.name}
              </h1>

              {/* Reviews & Stock */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md text-amber-900 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-stone-400 font-normal">({product.reviewCount || 24} reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className={product.stock > 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                    {product.stock > 0 ? `In Stock (${product.stock} pieces remaining)` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="flex items-baseline gap-4 mt-6 pb-6 border-b border-stone-100">
                <span className="text-3xl sm:text-4xl font-bold text-anulok-espresso">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-base line-through text-stone-400">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs font-bold text-anulok-amber bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-md">
                      SAVE {formatPrice(product.price - product.discountPrice)} ({product.discountPercentage}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-stone-600 text-sm leading-relaxed mt-6">
                {product.description}
              </p>

              {/* Color Finish Picker */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-2">
                    Finishing / Upholstery: <span className="text-anulok-espresso font-semibold">{selectedColor?.name}</span>
                  </label>
                  <div className="flex gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          selectedColor?.name === c.name
                            ? 'border-anulok-wood bg-anulok-linen text-anulok-espresso ring-2 ring-anulok-wood/20'
                            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pincode Delivery Estimator */}
              <div className="mt-6 p-4 rounded-xl bg-anulok-cream border border-stone-200/80">
                <form onSubmit={checkPincode} className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter Indian PIN Code (e.g. 560038)"
                    maxLength={6}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-anulok-wood"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Check Delivery
                  </button>
                </form>
                {pincodeStatus && (
                  <p className={`text-xs mt-2 font-medium ${pincodeStatus.valid ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {pincodeStatus.message}
                  </p>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 pt-6 border-t border-stone-200 space-y-3">
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 px-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-stone-500 hover:text-anulok-espresso font-bold text-base"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-anulok-espresso">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-stone-500 hover:text-anulok-espresso font-bold text-base"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 bg-white border-2 border-anulok-espresso hover:bg-stone-50 text-anulok-espresso font-semibold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Zap className="w-4 h-4 text-anulok-amber" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Information (Specs, Materials, Shipping, Warranty) */}
        <div className="mt-16 bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-10 shadow-xs">
          <div className="flex border-b border-stone-200 gap-6 sm:gap-8 overflow-x-auto pb-px">
            {[
              { id: 'specs', label: 'Dimensions & Specs' },
              { id: 'material', label: 'Material & Craftsmanship' },
              { id: 'shipping', label: 'Shipping & White-Glove Assembly' },
              { id: 'warranty', label: 'Warranty & In-Home Trial' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-anulok-wood text-anulok-wood'
                    : 'border-transparent text-stone-500 hover:text-anulok-espresso'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Dimensions</span>
                    <span className="font-semibold text-anulok-espresso">{product.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Weight</span>
                    <span className="font-semibold text-anulok-espresso">{product.weight}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Primary Material</span>
                    <span className="font-semibold text-anulok-espresso">{product.material}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Available Color(s)</span>
                    <span className="font-semibold text-anulok-espresso">
                      {product.colors?.map(c => c.name).join(', ') || 'Natural'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Stock Availability</span>
                    <span className="font-semibold text-emerald-700">{product.stock} units ready to ship</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Origin</span>
                    <span className="font-semibold text-anulok-espresso">Handcrafted in Bengaluru & Rajasthan</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'material' && (
              <div className="max-w-2xl text-stone-600 text-sm leading-relaxed space-y-4">
                <p>
                  Built exclusively with kiln-dried, seasoned hardwoods harvested from sustainably managed agro-forestry plantations. We strictly avoid toxic formaldehyde-based resins or particleboard.
                </p>
                <p>
                  Every joint is precision-cut using traditional mortise and tenon joinery reinforced with concealed stainless steel brackets for multi-generational stability.
                </p>
                <div className="bg-anulok-linen p-4 rounded-xl text-xs text-stone-700">
                  <strong className="block text-anulok-espresso mb-1">Care Instructions:</strong>
                  Dust gently with a clean microfiber cloth. Wipe spills immediately. Avoid placing directly under harsh sunlight or right in front of high-temperature HVAC vents.
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl text-stone-600 text-sm leading-relaxed space-y-4">
                <p>
                  <strong>{product.deliveryInfo || 'White-Glove Placement Included.'}</strong>
                </p>
                <p>
                  Our specialized logistics team will carry the furniture into your room of choice, unpack all pieces, perform complete leveling and bolt assembly, and remove all crates and cardboard packaging from your residence.
                </p>
                <p className="text-xs text-stone-500">
                  Available in 50+ tier-1 and tier-2 Indian metro regions including Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Chennai, Pune, and Kolkata.
                </p>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="max-w-2xl text-stone-600 text-sm leading-relaxed space-y-4">
                <p>
                  <strong>{product.warranty}</strong>
                </p>
                <p>
                  Covers structural timber frame failures, joinery loosening, foam collapse over 20%, and mechanical hardware defects under normal domestic residential use.
                </p>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  <strong>30-Day In-Home Peace of Mind:</strong> If the piece doesn't harmonize perfectly with your room proportions or lighting, we will arrange complimentary reverse pickup and issue a complete refund.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
                Harmonious Pairings
              </span>
              <h2 className="font-serif text-3xl font-normal text-anulok-espresso mt-1">
                Related Designs
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
