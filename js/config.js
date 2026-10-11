/**
 * RUSHER ID - GLOBAL CONFIGURATION
 * Konfigurasi global aplikasi, Supabase, dan settings umum
 */

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const CONFIG = {
    // Supabase URL dan Key - WAJIB diatur di .env atau langsung di sini
    SUPABASE_URL: import.meta?.env?.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: import.meta?.env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here',

    // App Info
    APP_NAME: 'Rusher ID',
    APP_VERSION: '1.0.0',
    DEMO_MODE: true, // Set ke false saat production

    // User Settings
    THEME_KEY: 'rusherId_theme',
    AUTH_KEY: 'rusherId_auth',
    CART_KEY: 'rusherId_cart',
    LANGUAGE_KEY: 'rusherId_language',

    // API Endpoints (untuk masa depan)
    PAYMENT_API_URL: import.meta?.env?.VITE_PAYMENT_API_URL || '',
    GAME_API_URL: import.meta?.env?.VITE_GAME_API_URL || '',

    // Constants
    CURRENCY: 'IDR',
    TIMEZONE: 'Asia/Jakarta',
    DEMO_LABEL: '[DEMO VERSION]',

    // Validation Rules
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 6,
        MAX_CART_ITEMS: 100,
        ORDER_ID_PREFIX: 'ORD',
        TRANSACTION_ID_PREFIX: 'TXN',
    },

    // Demo Settings
    DEMO: {
        PAYMENT_DELAY_MS: 2000, // Delay simulasi pembayaran
        AUTO_SUCCESS_RATE: 0.9, // 90% pembayaran berhasil
    },

    // API Response Status
    API_STATUS: {
        SUCCESS: 'success',
        ERROR: 'error',
        PENDING: 'pending',
        LOADING: 'loading',
    },

    // Order Status
    ORDER_STATUS: {
        PENDING_PAYMENT: 'pending_payment',
        PROCESSING: 'processing',
        COMPLETED: 'completed',
        FAILED: 'failed',
        CANCELLED: 'cancelled',
    },

    // Payment Methods (Demo)
    PAYMENT_METHODS: [
        {
            id: 'bank_transfer',
            name: 'Transfer Bank (Simulasi)',
            description: 'Simulasi transfer antar bank',
            icon: '🏦',
            demo: true,
        },
        {
            id: 'qris',
            name: 'QRIS (Simulasi)',
            description: 'Simulasi pembayaran QRIS',
            icon: '📱',
            demo: true,
        },
    ],

    // Game Categories
    CATEGORIES: [
        { id: 'moba', name: 'MOBA' },
        { id: 'rpg', name: 'RPG' },
        { id: 'fps', name: 'FPS' },
        { id: 'strategy', name: 'Strategy' },
        { id: 'simulation', name: 'Simulasi' },
        { id: 'casual', name: 'Casual' },
    ],
};

/**
 * Utility: Format Mata Uang IDR
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

/**
 * Utility: Generate Unique ID
 */
function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}${random}`.toUpperCase();
}

/**
 * Utility: Generate Order ID
 */
function generateOrderId() {
    return generateId(CONFIG.VALIDATION.ORDER_ID_PREFIX + '-');
}

/**
 * Utility: Generate Transaction ID
 */
function generateTransactionId() {
    return generateId(CONFIG.VALIDATION.TRANSACTION_ID_PREFIX + '-');
}

/**
 * Utility: Format Tanggal
 */
function formatDate(date, format = 'id-ID') {
    return new Intl.DateTimeFormat(format, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

/**
 * Utility: Log Demo Warning
 */
function logDemoWarning(feature) {
    if (CONFIG.DEMO_MODE) {
        console.warn(`[${CONFIG.DEMO_LABEL}] ${feature} adalah simulasi demo`);
    }
}

/**
 * Utility: Validate Email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Utility: Validate Password Strength
 */
function validatePasswordStrength(password) {
    const strength = {
        isValid: password.length >= CONFIG.VALIDATION.MIN_PASSWORD_LENGTH,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumbers: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*]/.test(password),
    };

    strength.score = Object.values(strength).filter(Boolean).length;
    return strength;
}

/**
 * Utility: Clone Object (Deep Copy)
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Utility: Debounce Function
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Utility: Throttle Function
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Export untuk digunakan di file lain
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        formatCurrency,
        generateId,
        generateOrderId,
        generateTransactionId,
        formatDate,
        logDemoWarning,
        isValidEmail,
        validatePasswordStrength,
        deepClone,
        debounce,
        throttle,
    };
}
