document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const trackingModal = document.getElementById('tracking-modal');
    
    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
    }
    
    // Update cart modal
    function updateCartModal() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
            cartTotal.textContent = 'Rp 0';
            return;
        }
        
        let itemsHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="decrease-quantity" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-index="${index}">+</button>
                        <span class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
        cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                saveCart();
                updateCartModal();
                updateCartCount();
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                saveCart();
                updateCartModal();
                updateCartCount();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                saveCart();
                updateCartModal();
                updateCartCount();
            });
        });
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            saveCart();
            updateCartCount();
            
            // Show added to cart feedback
            const originalText = this.textContent;
            this.textContent = 'Ditambahkan!';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1000);
        });
    });
    
    // Modal functionality
    function setupModal(modal, opener) {
        if (opener) {
            opener.addEventListener('click', function(e) {
                e.preventDefault();
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                if (modal === cartModal) {
                    updateCartModal();
                }
            });
        }
        
        const closeButtons = modal.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Setup all modals
    setupModal(cartModal, document.querySelector('a[href="#cart"]'));
    setupModal(checkoutModal, document.getElementById('checkout-btn'));
    setupModal(confirmationModal);
    setupModal(trackingModal, document.querySelector('a[href="#tracking"]'));
    
    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Generate random order ID
            const orderId = 'WM' + Math.floor(100000 + Math.random() * 900000);
            document.getElementById('order-id').textContent = orderId;
            
            // Set WhatsApp link
            const phone = document.getElementById('phone').value;
            const whatsappBtn = document.getElementById('whatsapp-btn');
            whatsappBtn.href = `https://wa.me/6287785341233?text=Halo%20Warung%20Mama%20Miko,%20saya%20baru%20memesan%20dengan%20nomor%20order%20${orderId}`;
            
            // Show confirmation modal
            checkoutModal.style.display = 'none';
            confirmationModal.style.display = 'block';
            
            // Clear cart
            cart = [];
            saveCart();
            updateCartCount();
        });
    }
    
    // Tracking form
    const trackingForm = document.getElementById('tracking-form');
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('tracking-result').style.display = 'block';
        });
    }
    
    // Initialize cart count
    updateCartCount();
});
