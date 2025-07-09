import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { useEffect, useState } from "react";
import { supabase } from "../libs/supabase";

function HomePage() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        setError("상품을 불러오는 데 실패했습니다.");
        setProducts([]);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: "전자제품", icon: "📱", color: "bg-blue-500" },
    { name: "패션", icon: "👕", color: "bg-pink-500" },
    { name: "가구", icon: "🪑", color: "bg-green-500" },
    { name: "가전제품", icon: "🏠", color: "bg-purple-500" },
    { name: "스포츠", icon: "⚽", color: "bg-orange-500" },
    { name: "뷰티", icon: "💄", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6">ShopHub</h1>
            <p className="text-xl mb-8">
              최고의 제품들을 만나보세요. 품질과 가격을 모두 만족하는
              쇼핑몰입니다.
            </p>
            <Link to="/posts" className="btn btn-primary btn-lg">
              쇼핑 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="card-body text-center p-6">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-semibold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">인기 상품</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-10">
              상품을 불러오는 중...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="card bg-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <figure className="px-4 pt-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-xl w-full h-48 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <div className="badge badge-primary mb-2">
                      {product.category}
                    </div>
                    <h3 className="card-title text-lg">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {product.price}
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          addToCart(product);
                          navigate("/cart");
                        }}
                      >
                        장바구니
                      </button>
                      <button className="btn btn-outline btn-sm">
                        상세보기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">빠른 배송</h3>
              <p className="text-gray-600">전국 어디든 1-2일 내 배송</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">안전한 결제</h3>
              <p className="text-gray-600">SSL 암호화로 안전한 결제</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">↩️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">쉬운 반품</h3>
              <p className="text-gray-600">7일 내 무료 반품 가능</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">특별한 혜택을 받아보세요</h2>
          <p className="text-xl mb-8">신규 가입 시 10% 할인 쿠폰을 드립니다!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              className="input input-bordered w-full max-w-md"
            />
            <button className="btn btn-secondary">구독하기</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
