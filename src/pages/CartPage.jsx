import React from "react";
import { useCartStore } from "../stores/cartStore";
import { create } from "zustand";

function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10">
      <h1 className="text-3xl font-bold mb-8">장바구니</h1>
      {cart.length === 0 ? (
        <p className="text-lg text-gray-600">
          아직 장바구니에 담긴 상품이 없습니다.
        </p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white rounded-lg shadow p-4 gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-lg">{item.name}</div>
                <div className="text-gray-500">{item.price}</div>
                <div className="text-sm text-gray-400">
                  수량: {item.quantity}
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline text-red-500 border-red-300 hover:bg-red-50"
                onClick={() => removeFromCart(item.id)}
              >
                제거
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CartPage;
