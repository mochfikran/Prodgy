/**
 * checkout.js - Simulasi checkout dan pesanan
 */

class CheckoutManager {
    constructor() {
        this.init();
    }

    init() {
        this.attachCartCheckoutFlow();
    }

    attachCartCheckoutFlow() {
        document.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'go-checkout') {
                const items = cart.items;
                if (!items.length) {
                    ui.showToast('Keranjang Anda masih kosong', 'error');
                    return;
                }
                this.renderCheckoutPage(items, cart.getTotal());
                ui.navigateTo('checkout-page');
            }
        });
    }

    renderCheckoutPage(items, total) {
        const container = document.getElementById('checkout-content');
        if (!container) return;

        const paymentMethods = CONFIG.PAYMENT_METHODS;

        const itemsHtml = items.map(item => `
            <div class="cart-item">
                <div class="cart-thumb">${item.gameIcon || '🎮'}</div>
                <div class="cart-item-info">
                    <h3>${item.gameName}</h3>
                    <p>${item.productName}</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">ID Pemain: ${item.playerId}</p>
                </div>
                <div style="text-align: right; min-width: 120px;">
                    <div class="product-price">${formatCurrency(item.price * item.quantity)}</div>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.4rem;">${item.quantity}x item</p>
                </div>
            </div>
        `).join('');

        const paymentHtml = paymentMethods.map(method => `
            <label class="radio-option">
                <input type="radio" name="payment-method" value="${method.id}" ${method.id === 'bank_transfer' ? 'checked' : ''} />
                <span>${method.icon} ${method.name}</span>
            </label>
        `).join('');

        container.innerHTML = `
            <div class="checkout-grid">
                <div class="form-section">
                    <div class="checkout-card">
                        <h3>Ringkasan Pesanan</h3>
                        ${itemsHtml}
                    </div>

                    <div class="checkout-card">
                        <h3>Konfirmasi ID Pemain</h3>
                        <div class="form-grid">
                            ${items.map(item => `
                                <div class="field-group">
                                    <label>${item.gameName} - ${item.productName}</label>
                                    <input class="input-field" value="${item.playerId}" readonly />
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="checkout-card">
                        <h3>Metode Pembayaran</h3>
                        <div class="payment-methods">
                            ${paymentHtml}
                        </div>
                    </div>

                    <div class="checkout-card">
                        <h3>Persetujuan</h3>
                        <label class="checkbox-row">
                            <input type="checkbox" id="terms-check" />
                            <span>Saya menyetujui syarat layanan dan memahami bahwa pembayaran ini adalah simulasi demo.</span>
                        </label>
                    </div>
                </div>

                <aside class="summary-box">
                    <h3>Rincian Pembayaran</h3>
                    <div class="price-line"><span>Subtotal</span><span>${formatCurrency(total)}</span></div>
                    <div class="price-line"><span>Biaya Simulasi</span><span>Rp 0</span></div>
                    <div class="price-line total"><span>Total</span><span>${formatCurrency(total)}</span></div>
                    <button id="confirm-order" class="primary-button full-width" type="button" style="margin-top: 1rem;">
                        Konfirmasi Pesanan
                    </button>
                    <button id="cancel-checkout" class="secondary-button full-width" type="button" style="margin-top: 0.75rem;">
                        Kembali ke Keranjang
                    </button>
                </aside>
            </div>
        `;

        const confirmBtn = document.getElementById('confirm-order');
        const cancelBtn = document.getElementById('cancel-checkout');

        confirmBtn?.addEventListener('click', () => {
            const termsChecked = document.getElementById('terms-check')?.checked;
            if (!termsChecked) {
                ui.showToast('Anda harus menyetujui syarat layanan', 'error');
                return;
            }

            const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'bank_transfer';
            this.createOrder(items, total, paymentMethod);
        });

        cancelBtn?.addEventListener('click', () => {
            ui.navigateTo('cart-page');
        });
    }

    createOrder(items, total, paymentMethod) {
        const orderId = generateOrderId();
        const transactionId = generateTransactionId();
        const createdAt = new Date().toISOString();

        const order = {
            id: orderId,
            transaction_id: transactionId,
            user_id: 'demo-user-1',
            status: 'pending_payment',
            payment_method: paymentMethod,
            total_price: total,
            created_at: createdAt,
            updated_at: createdAt,
            items: items.map(item => ({
                id: item.id,
                game_id: item.gameId,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
                player_id: item.playerId,
                item_name: item.productName,
                game_name: item.gameName,
                created_at: createdAt
            }))
        };

        const previousOrders = JSON.parse(localStorage.getItem('rusherId_orders') || '[]');
        previousOrders.unshift(order);
        localStorage.setItem('rusherId_orders', JSON.stringify(previousOrders));

        ui.showToast('Pesanan berhasil dibuat', 'success');

        setTimeout(() => {
            this.simulatePayment(orderId, paymentMethod);
        }, 1000);
    }

    simulatePayment(orderId, paymentMethod) {
        const orders = JSON.parse(localStorage.getItem('rusherId_orders') || '[]');
        const index = orders.findIndex(order => order.id === orderId);
        if (index === -1) return;

        orders[index].status = 'completed';
        orders[index].payment_method = paymentMethod;
        orders[index].payment_status = 'simulated_success';
        orders[index].updated_at = new Date().toISOString();
        orders[index].payment_note = 'Pembayaran simulasi berhasil diproses. Status ini hanya untuk demo.';
        localStorage.setItem('rusherId_orders', JSON.stringify(orders));

        const order = orders[index];
        const container = document.getElementById('checkout-content');

        if (container) {
            container.innerHTML = `
                <div class="summary-box">
                    <h3>Transaksi Berhasil (Simulasi)</h3>
                    <p>Nomor Pesanan: <strong>${order.id}</strong></p>
                    <p>Metode Pembayaran: ${paymentMethod}</p>
                    <p>Total: <strong>${formatCurrency(order.total_price)}</strong></p>
                    <p style="color: var(--text-secondary); margin-top: 0.8rem;">Status ini hanya simulasi demo dan belum merupakan pembayaran asli.</p>
                    <button type="button" class="primary-button full-width" data-action="view-order" data-order-id="${order.id}" style="margin-top: 1rem;">
                        Lihat Pesanan
                    </button>
                </div>
            `;
        }

        document.querySelector('[data-action="view-order"]')?.addEventListener('click', () => {
            ordersManager.showOrderDetail(orderId);
            ui.navigateTo('order-page');
        });
    }
}

const checkout = new CheckoutManager();
