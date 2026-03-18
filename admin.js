/* admin.js */

// Initial Fresh Data for Nrteats from localStorage
// Initial Fresh Data for Nrteats from localStorage
let mockOrders = JSON.parse(localStorage.getItem('nrteats_orders') || '[]');

// Auto-inject a test order if local storage is completely empty
if (mockOrders.length === 0) {
    const testOrder = {
        id: "ORD-12345",
        customerName: "Demo Verification",
        phone: "+91 9988776655",
        items: "1x Chicken Biryani, 1x Sprite",
        total: 350,
        status: "Pending",
        time: "Just now"
    };
    mockOrders.push(testOrder);
    localStorage.setItem('nrteats_orders', JSON.stringify(mockOrders));
}

document.addEventListener('DOMContentLoaded', () => {
    // Login Logic
    const loginBtn = document.getElementById('admin-login-btn');
    const passwordInput = document.getElementById('admin-password');
    const loginOverlay = document.getElementById('admin-login-overlay');
    const dashboard = document.getElementById('admin-dashboard');
    const errorMsg = document.getElementById('login-error');

    function checkLogin() {
        if (passwordInput.value === 'admin') {
            loginOverlay.style.display = 'none';
            dashboard.style.display = 'flex';
            initDashboard();
        } else {
            errorMsg.innerText = 'Incorrect password. Try "admin"';
            passwordInput.value = '';
            
            // Shake effect
            const loginBox = document.querySelector('.login-box');
            loginBox.style.transform = 'translateX(-10px)';
            setTimeout(() => loginBox.style.transform = 'translateX(10px)', 100);
            setTimeout(() => loginBox.style.transform = 'translateX(-10px)', 200);
            setTimeout(() => loginBox.style.transform = 'translateX(0)', 300);
        }
    }

    loginBtn.addEventListener('click', checkLogin);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkLogin();
    });

    // Dashboard Logic
    function initDashboard() {
        renderOrders(mockOrders);
        updateStats(mockOrders);

        // Filter Logic
        const statusFilter = document.getElementById('status-filter');
        statusFilter.addEventListener('change', (e) => {
            const status = e.target.value;
            if (status === 'all') {
                renderOrders(mockOrders);
            } else {
                const filtered = mockOrders.filter(order => order.status === status);
                renderOrders(filtered);
            }
        });
    }

    function renderOrders(orders) {
        const tbody = document.getElementById('orders-tbody');
        tbody.innerHTML = '';

        orders.forEach(order => {
            const tr = document.createElement('tr');
            
            // Status Class
            let statusClass = order.status.toLowerCase();
            
            tr.innerHTML = `
                <td>
                    <span class="order-id">${order.id}</span>
                    <br>
                    <small style="color: var(--admin-text-light)">${order.time}</small>
                </td>
                <td class="customer-info">
                    <strong>${order.customerName}</strong>
                    <span>${order.phone}</span>
                </td>
                <td class="items-list" title="${order.items}">
                    ${order.items}
                </td>
                <td class="order-total">
                    ₹${order.total}
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${order.status}</span>
                </td>
                <td>
                    <select class="action-select" onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="" disabled selected>Change Status</option>
                        <option value="Pending">Mark Pending</option>
                        <option value="Preparing">Mark Preparing</option>
                        <option value="Delivered">Mark Delivered</option>
                        <option value="Cancelled">Cancel Order</option>
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function updateStats(orders) {
        document.getElementById('stat-total').innerText = orders.length;
        
        const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
        document.getElementById('stat-pending').innerText = pending;
        
        const completed = orders.filter(o => o.status === 'Delivered').length;
        document.getElementById('stat-completed').innerText = completed;
        
        const revenue = orders
            .filter(o => o.status === 'Delivered')
            .reduce((sum, o) => sum + o.total, 0);
        document.getElementById('stat-revenue').innerText = '₹' + revenue;
    }

    // Expose update function to global scope for the inline onchange handler
    window.updateOrderStatus = function(orderId, newStatus) {
        const order = mockOrders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            localStorage.setItem('nrteats_orders', JSON.stringify(mockOrders));
            
            // Re-render current view based on filter
            const filterValue = document.getElementById('status-filter').value;
            if (filterValue === 'all') {
                renderOrders(mockOrders);
            } else {
                renderOrders(mockOrders.filter(o => o.status === filterValue));
            }
            
            // Update stats
            updateStats(mockOrders);
            
            // Show feedback
            showToast(`Order ${orderId} updated to ${newStatus}`);
        }
    };

    function showToast(message) {
        const toast = document.createElement('div');
        toast.innerText = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: 'var(--success)',
            color: 'white',
            padding: '12px 25px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            zIndex: '1000',
            fontWeight: '600',
            opacity: '0',
            transition: 'opacity 0.3s'
        });
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
