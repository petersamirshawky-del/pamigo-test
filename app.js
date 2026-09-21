/* ==========================================================================
   PAMIGO - app.js
   ========================================================================== */

let currentRole = 'customer';
let currentUser = { name: 'عميل زائر', phone: '01000000000', cashback: 0 };
let currentRadius = 5;
let map, userMarker;
let mapMarkers = [];

const mansouraCenter = [31.0409, 31.3785];

let merchants = [
    {
        id: 1,
        name: 'مطعم كرم الشام',
        category: 'مطاعم',
        subCategory: 'شاورما وسوري',
        lat: 31.0430,
        lng: 31.3800,
        cashbackRate: 10,
        bankCode: '1111',
        offers: ['خصم 10% كاش باك على جميع الوجبات العائلية']
    },
    {
        id: 2,
        name: 'مول الجامعة للإلكترونيات',
        category: 'إلكترونيات',
        subCategory: 'موبايلات وأجهزة',
        lat: 31.0380,
        lng: 31.3690,
        cashbackRate: 5,
        bankCode: '2222',
        offers: ['كاش باك 5% عند شراء أي هاتف ذكي']
    },
    {
        id: 3,
        name: 'بوتيك شيك - المشاية',
        category: 'ملابس',
        subCategory: 'ملابس حريمي',
        lat: 31.0450,
        lng: 31.3750,
        cashbackRate: 15,
        bankCode: '3333',
        offers: ['استرد 15% كاش باك فوراً على المجموعات الجديدة']
    },
    {
        id: 4,
        name: 'سوبرماركت الأمانة - قناة السويس',
        category: 'سوبرماركت',
        subCategory: 'بقالة ومواد غذائية',
        lat: 31.0350,
        lng: 31.3850,
        cashbackRate: 3,
        bankCode: '4444',
        offers: ['3% كاش باك على جميع المشتريات فوق 500 جنيه']
    }
];

let specialRequests = [
    {
        id: 101,
        customerPhone: '01012345678',
        category: 'إلكترونيات',
        text: 'مطلوب شاشة كمبيوتر 24 بوصة مستعملة بحالة جيدة في حدود المنصورة',
        status: 'pending',
        responses: []
    }
];

let customerWallets = {
    '01012345678': {
        name: 'أحمد محمود',
        balances: { 1: 50, 3: 30 },
        invoices: [
            { merchantId: 1, amount: 500, cashback: 50, date: '2026-09-15' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initMap();
    renderAll();
    setupEventListeners();
});

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(`tab-${tabId}`);
            if (targetContent) targetContent.classList.add('active');

            if (tabId === 'home' && map) {
                setTimeout(() => map.invalidateSize(), 200);
            }
        });
    });
}

function setRole(role) {
    currentRole = role;
    const roleCustBtn = document.getElementById('roleCustomer');
    const roleMerBtn = document.getElementById('roleMerchant');
    if (roleCustBtn) roleCustBtn.classList.toggle('active', role === 'customer');
    if (roleMerBtn) roleMerBtn.classList.toggle('active', role === 'merchant');

    const isMerchant = role === 'merchant';
    const tabDash = document.getElementById('tabDashboard');
    const bankGroup = document.getElementById('bankCodeGroup');
    if (tabDash) tabDash.style.display = isMerchant ? 'flex' : 'none';
    if (bankGroup) bankGroup.style.display = isMerchant ? 'block' : 'none';

    renderAll();
}

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    map = L.map('map').setView(mansouraCenter, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    userMarker = L.marker(mansouraCenter, { draggable: true })
        .addTo(map)
        .bindPopup('موقعك الحالي (يمكنك سحبه لتغييره)')
        .openPopup();

    userMarker.on('dragend', function () {
        renderAll();
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function renderAll() {
    renderDealsAndMap();
    renderOffersTab();
    renderSpecialRequests();
    renderDashboard();
    renderAccountInfo();
}

function renderDealsAndMap() {
    const dealsList = document.getElementById('dealsList');
    if (!dealsList) return;
    
    dealsList.innerHTML = '';

    mapMarkers.forEach(m => map && map.removeLayer(m));
    mapMarkers = [];

    const userPos = userMarker ? userMarker.getLatLng() : { lat: mansouraCenter[0], lng: mansouraCenter[1] };
    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';

    merchants.forEach(merchant => {
        const dist = calculateDistance(userPos.lat, userPos.lng, merchant.lat, merchant.lng);
        
        if (dist <= currentRadius && merchant.name.toLowerCase().includes(searchQuery)) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4><i class="fa-solid fa-store"></i> ${merchant.name}</h4>
                <p><small>${merchant.category} - ${merchant.subCategory}</small></p>
                <p style="color: var(--success-color); font-weight: bold; margin: 8px 0;">
                    <i class="fa-solid fa-coins"></i> كاش باك: ${merchant.cashbackRate}%
                </p>
                <p><small><i class="fa-solid fa-route"></i> تبعد عنك: ${dist.toFixed(1)} كم</small></p>
                <hr style="margin: 10px 0; border: 0; border-top: 1px solid var(--border-color);">
                <p><strong>العرض:</strong> ${merchant.offers[0] || 'لا يوجد عروض حالياً'}</p>
            `;
            dealsList.appendChild(card);

            if (map) {
                const m = L.marker([merchant.lat, merchant.lng])
                    .addTo(map)
                    .bindPopup(`<b>${merchant.name}</b><br>كاش باك ${merchant.cashbackRate}%`);
                mapMarkers.push(m);
            }
        }
    });
}

function renderOffersTab() {
    const allOffersList = document.getElementById('allOffersList');
    if (!allOffersList) return;

    allOffersList.innerHTML = '';
    merchants.forEach(m => {
        m.offers.forEach(offer => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4><i class="fa-solid fa-tag" style="color:var(--secondary-color)"></i> ${offer}</h4>
                <p><strong>التاجر:</strong> ${m.name} (${m.category})</p>
                <p><span class="category-chip" style="display:inline-block; margin-top:8px;">كاش باك ${m.cashbackRate}%</span></p>
            `;
            allOffersList.appendChild(card);
        });
    });
}

function submitSpecialRequest() {
    const category = document.getElementById('reqCategory').value;
    const text = document.getElementById('reqText').value;

    if (!text.trim()) {
        alert('برجاء كتابة تفاصيل الطلب!');
        return;
    }

    const newReq = {
        id: Date.now(),
        customerPhone: currentUser.phone,
        category: category,
        text: text,
        status: 'pending',
        responses: []
    };

    specialRequests.unshift(newReq);
    document.getElementById('reqText').value = '';
    alert('تم إرسال طلبك بنجاح للتجار القريبين!');
    renderSpecialRequests();
}

function renderSpecialRequests() {
    const requestsList = document.getElementById('requestsList');
    if (!requestsList) return;

    requestsList.innerHTML = '';

    specialRequests.forEach(req => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4><i class="fa-solid fa-bullhorn"></i> طلب ${req.category}</h4>
                <span class="category-chip" style="background:#eff6ff; color:var(--primary-color)">${req.status === 'pending' ? 'قيد الانتظار' : 'تم الرد'}</span>
            </div>
            <p style="margin: 10px 0;">${req.text}</p>
            <p><small>رقم الهاتف: ${req.customerPhone}</small></p>
        `;
        requestsList.appendChild(card);
    });
}

function addInvoice() {
    const phone = document.getElementById('invPhone').value;
    const amount = parseFloat(document.getElementById('invAmount').value);

    if (!phone || isNaN(amount) || amount <= 0) {
        alert('برجاء أدخل رقم هاتف ومبلغ صحيح!');
        return;
    }

    if (!customerWallets[phone]) {
        customerWallets[phone] = { name: 'عميل جديد', balances: {}, invoices: [] };
    }

    const merchantId = 1;
    const cashbackRate = merchants[0].cashbackRate;
    const cashbackEarned = (amount * cashbackRate) / 100;

    customerWallets[phone].balances[merchantId] = (customerWallets[phone].balances[merchantId] || 0) + cashbackEarned;
    customerWallets[phone].invoices.push({ merchantId, amount, cashback: cashbackEarned, date: new Date().toISOString().split('T')[0] });

    alert(`تم إضافة الفاتورة بنجاح! تم إضافة كاش باك قدره ${cashbackEarned} ج للعميل.`);
    document.getElementById('invPhone').value = '';
    document.getElementById('invAmount').value = '';
    renderDashboard();
}

function redeemCashback() {
    const phone = document.getElementById('redeemPhone').value;
    const amount = parseFloat(document.getElementById('redeemAmount').value);
    const bankCode = document.getElementById('redeemBankCode').value;

    if (bankCode !== merchants[0].bankCode) {
        alert('البنكود غير صحيح!');
        return;
    }

    const currentBal = customerWallets[phone]?.balances[1] || 0;
    if (amount > currentBal) {
        alert(`رصيد العميل غير كافٍ! الرصيد المتاح: ${currentBal} ج`);
        return;
    }

    customerWallets[phone].balances[1] -= amount;
    alert(`تم خصم واسترداد ${amount} ج بنجاح! الرصيد المتبقي للعميل: ${customerWallets[phone].balances[1]} ج`);
    document.getElementById('redeemPhone').value = '';
    document.getElementById('redeemAmount').value = '';
    document.getElementById('redeemBankCode').value = '';
    renderDashboard();
}

function renderDashboard() {
    let totalSales = 0;
    let totalCashbackGiven = 0;
    let customerCount = Object.keys(customerWallets).length;

    Object.values(customerWallets).forEach(w => {
        w.invoices.forEach(inv => {
            totalSales += inv.amount;
            totalCashbackGiven += inv.cashback;
        });
    });

    if (document.getElementById('dashCust')) document.getElementById('dashCust').innerText = customerCount;
    if (document.getElementById('dashSales')) document.getElementById('dashSales').innerText = totalSales + ' ج';
    if (document.getElementById('dashCashbackGiven')) document.getElementById('dashCashbackGiven').innerText = totalCashbackGiven + ' ج';
}

function renderAccountInfo() {
    if (document.getElementById('accName')) document.getElementById('accName').innerText = currentUser.name;
    if (document.getElementById('accPhone')) document.getElementById('accPhone').innerText = currentUser.phone;
}

function setupEventListeners() {
    const slider = document.getElementById('radiusSlider');
    if (slider) {
        slider.addEventListener('input', (e) => {
            currentRadius = parseFloat(e.target.value);
            const radVal = document.getElementById('radiusValue');
            if (radVal) radVal.innerText = currentRadius;
            renderDealsAndMap();
        });
    }
}