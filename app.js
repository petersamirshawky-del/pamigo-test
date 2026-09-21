/* --- المتغيرات العامة والتنسيق الأساسي --- */
:root {
    --primary-color: #2563eb;
    --primary-hover: #1d4ed8;
    --secondary-color: #f59e0b;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --bg-color: #f8fafc;
    --card-bg: #ffffff;
    --text-color: #0f172a;
    --text-muted: #64748b;
    --border-color: #e2e8f0;
    --radius: 12px;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    direction: rtl;
    padding-bottom: 40px;
}

/* --- الهيدر والتنقل العلوي --- */
.app-header {
    background-color: var(--card-bg);
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 8px;
}

.user-role-toggle {
    display: flex;
    background-color: #f1f5f9;
    padding: 4px;
    border-radius: 20px;
}

.role-btn {
    border: none;
    background: transparent;
    padding: 6px 16px;
    border-radius: 16px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.role-btn.active {
    background-color: var(--primary-color);
    color: white;
}

/* --- شريط التبويبات --- */
.tab-bar {
    display: flex;
    overflow-x: auto;
    background-color: var(--card-bg);
    padding: 10px 15px;
    gap: 10px;
    border-bottom: 1px solid var(--border-color);
}

.tab-btn {
    border: none;
    background: none;
    padding: 8px 16px;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.95rem;
    white-space: nowrap;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;
}

.tab-btn.active {
    background-color: #eff6ff;
    color: var(--primary-color);
    font-weight: bold;
}

/* --- الحاويات والأقسام --- */
.container {
    max-width: 900px;
    margin: 20px auto;
    padding: 0 15px;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.card {
    background-color: var(--card-bg);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);
}

.section-title {
    margin: 20px 0 12px;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-color);
}

/* --- البحث والنطاق الجغرافي والتصنيفات --- */
.search-box {
    display: flex;
    align-items: center;
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 10px 15px;
    margin-bottom: 15px;
    box-shadow: var(--shadow);
}

.search-box input {
    border: none;
    outline: none;
    width: 100%;
    margin-right: 10px;
    font-size: 1rem;
}

.radius-card label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
}

.radius-card input[type="range"] {
    width: 100%;
    accent-color: var(--primary-color);
}

.categories-scroll, .sub-categories-scroll {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 10px;
    margin-bottom: 15px;
}

.category-chip {
    border: 1px solid var(--border-color);
    background-color: var(--card-bg);
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.category-chip.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* --- الخريطة --- */
.map-container {
    height: 300px;
    border-radius: var(--radius);
    margin-bottom: 20px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow);
    z-index: 1;
}

/* --- شبكة الكروت --- */
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 15px;
}

/* --- المدخلات والأزرار --- */
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 0.9rem;
}

.form-group input, .form-group select, .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
}

.form-group textarea {
    height: 90px;
    resize: vertical;
}

.btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
}

.btn-primary { background-color: var(--primary-color); color: white; }
.btn-primary:hover { background-color: var(--primary-hover); }
.btn-success { background-color: var(--success-color); color: white; }
.btn-warning { background-color: var(--secondary-color); color: white; }
.btn-danger { background-color: var(--danger-color); color: white; }

/* --- الإحصائيات وملخص الكاش باك --- */
.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
}

.stat-card {
    background-color: var(--card-bg);
    padding: 15px;
    border-radius: var(--radius);
    text-align: center;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow);
}

.stat-card i {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 6px;
}

.summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 10px;
    font-size: 0.95rem;
}