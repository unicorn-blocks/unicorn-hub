import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function CartSidebar() {
    const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const router = useRouter();

    useEffect(() => {
        // Disable body scroll when cart is open
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    const handleCheckout = () => {
        // Reuse existing checkout logic logic but perhaps iterate through items?
        // For now, since it's likely single product flow, we can just redirect to stripe checkout 
        // OR call the API.
        // However, Amazon Add to Cart usually leads to a Cart page or stays on page.
        // "Proceed to checkout" usually leads to address/payment.

        // Simplification for this task: We trigger the same checkout flow as "Buy Now" for the total amount
        // But wait, the existing API takes an amount.
        // Let's assume for this specific task we just calculate total and pass it.

        // Actually, Amazon cart "Proceed to checkout" goes to a checkout page.
        // We don't have a multi-step checkout page in this app, just Stripe.
        // So we'll call the stripe session creator with the cart total.

        const amount = getCartTotal();

        fetch('/api/payment/stripe/checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sourcePage: 'order',
                leadId: 'cart_' + Date.now(),
                returnUrl: window.location.origin,
                amount: amount,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    alert('Something went wrong. Please try again.');
                }
            })
            .catch((err) => {
                console.error('Checkout error:', err);
                alert('Connection error. Please try again.');
            });
    };

    if (!isCartOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-[1000] transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            <div className={`fixed top-0 right-0 h-full w-[350px] max-w-[90vw] bg-white z-[1001] shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </span>
                            Added to Cart
                        </h2>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                Your cart is empty.
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b pb-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                        <div className="text-sm text-gray-500 mt-1">${item.price}</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <select
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                className="border rounded px-2 py-1 text-sm bg-gray-50"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                    <option key={n} value={n}>Qty: {n}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-xs text-[#DC2626] underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer / Subtotal */}
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-medium">Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
                            <span className="text-xl font-bold text-[#DC2626]">${getCartTotal()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full text-white font-medium py-3 rounded-md shadow-sm transition-all mb-2 hover:brightness-105 hover:shadow-md"
                            style={{ background: 'linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%)' }}
                        >
                            Proceed to checkout
                        </button>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-md shadow-sm transition-colors text-sm"
                        >
                            Keep Shopping
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
