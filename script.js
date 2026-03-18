document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for explore buttons
    const exploreButtons = {
        'explore-tiffins': 'tiffins-section',
        'explore-bakery': 'bakery-section'
    };

    Object.entries(exploreButtons).forEach(([btnId, sectionId]) => {
        const btn = document.getElementById(btnId);
        const section = document.getElementById(sectionId);

        if (btn && section) {
            btn.addEventListener('click', () => {
                // Add a little splash effect or feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                    section.scrollIntoView({ behavior: 'smooth' });
                    showFeedback(`Sizzling into ${btn.innerText}...`);
                }, 150);
            });
        }
    });

    // Special redirect for Explore Food
    const exploreFoodBtn = document.getElementById('explore-food');
    if (exploreFoodBtn) {
        exploreFoodBtn.addEventListener('click', () => {
            exploreFoodBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                exploreFoodBtn.style.transform = '';
                window.location.href = 'explore-food.html';
            }, 150);
        });
    }

    // Simple feedback notification
    function showFeedback(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-feedback';
        toast.innerText = message;
        document.body.appendChild(toast);

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%) translateY(100px)',
            background: '#F68B1E',
            color: 'white',
            padding: '12px 25px',
            borderRadius: '12px',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            zIndex: '5000',
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });

        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }

    // Theme toggle mock
    const themeBtn = document.querySelector('.theme-toggle');
    themeBtn.addEventListener('click', () => {
        const icon = themeBtn.querySelector('i');
        if (icon.classList.contains('fa-moon')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            document.body.style.backgroundColor = '#121212';
            document.body.style.color = '#ffffff';
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#1a1a1a';
        }
    });

    // Expose mock order globally so index.html can call it
    window.placeMockOrder = function (restaurantName, itemsDesc, price) {
        const orders = JSON.parse(localStorage.getItem('nrteats_orders') || '[]');
        const newOrder = {
            id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
            customerName: "Demo User",
            phone: "+91 9876543210",
            items: itemsDesc,
            total: price,
            status: "Pending",
            time: "Just now"
        };
        orders.unshift(newOrder); // Add to beginning
        localStorage.setItem('nrteats_orders', JSON.stringify(orders));

        showFeedback(`Order placed at ${restaurantName}! Check Admin dashboard.`);
    };

});
