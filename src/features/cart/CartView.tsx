import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';
import { formatPrice } from '../../utils/formatPrice';

const CartView: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <section className="cart-view container">
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p className="muted">Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div className="cart-item" key={item.id}>
                            {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                            <div style={{flex:1}}>
                                <h3 style={{margin:0}}>{item.name}</h3>
                                <div style={{color:'#6b7280'}}>{formatPrice(item.price)}</div>
                                <div>Quantity: {item.quantity}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="cart-summary">
                <div>Total</div>
                <div style={{fontWeight:700}}>{formatPrice(totalAmount)}</div>
            </div>
        </section>
    );
};

export default CartView;