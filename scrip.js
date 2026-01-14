// MirApp - نسخه ساده شده برای شروع سریع
console.log('MirApp در حال بارگذاری...');

// مدیر تاریخ و زمان
class DateTimeManager {
    constructor() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    updateDateTime() {
        const now = new Date();
        
        // تاریخ شمسی (ساده شده)
        const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 
                               'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
        const persianYear = 1404;
        const hijriDate = `${persianYear} ${persianMonths[now.getMonth()]} ${now.getDate()}`;
        document.getElementById('hijriDate').textContent = hijriDate;
        
        // تاریخ میلادی
        const gregorianDate = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        document.getElementById('gregorianDate').textContent = gregorianDate;
        
        // ساعت
        const time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        document.getElementById('digitalClock').textContent = time;
    }
}

// مدیر پنل‌ها
class PanelManager {
    constructor() {
        this.currentPanel = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // دکمه‌های اصلی
        const buttons = {
            'reportBtn': 'reportPanel',
            'newsBtn': 'newsPanel',
            'weatherBtn': 'weatherPanel',
            'aiBtn': 'aiPanel',
            'translatorBtn': 'translatorPanel',
            'calculatorBtn': 'calculatorPanel',
            'settingsBtn': 'settingsPanel'
        };
        
        for (const [btnId, panelId] of Object.entries(buttons)) {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => this.openPanel(panelId));
            }
        }
        
        // دکمه‌های بازگشت
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeCurrentPanel());
        });
        
        // Overlay
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeCurrentPanel());
        }
        
        // دکمه‌های بروزرسانی
        document.getElementById('refreshCBR')?.addEventListener('click', () => {
            alert('در حال بروزرسانی اطلاعات...');
        });
        
        // انتخاب زبان
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                alert(`زبان تغییر کرد به: ${e.target.value === 'fa' ? 'فارسی' : e.target.value === 'en' ? 'English' : 'Русский'}`);
            });
        }
    }
    
    openPanel(panelId) {
        console.log('باز کردن پنل:', panelId);
        this.closeCurrentPanel();
        
        const panel = document.getElementById(panelId);
        const overlay = document.getElementById('overlay');
        
        if (panel) {
            panel.classList.remove('hidden');
            overlay.classList.remove('hidden');
            this.currentPanel = panelId;
        }
    }
    
    closeCurrentPanel() {
        if (this.currentPanel) {
            const panel = document.getElementById(this.currentPanel);
            const overlay = document.getElementById('overlay');
            
            if (panel) panel.classList.add('hidden');
            if (overlay) overlay.classList.add('hidden');
            
            this.currentPanel = null;
        }
    }
}

// مدیر هوش مصنوعی ساده
class AIManager {
    constructor() {
        this.setupEvents();
    }
    
    setupEvents() {
        const sendBtn = document.getElementById('sendAI');
        const input = document.getElementById('aiInput');
        
        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // مثال‌ها
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                if (input) {
                    input.value = question;
                    this.sendMessage();
                }
            });
        });
    }
    
    sendMessage() {
        const input = document.getElementById('aiInput');
        const messages = document.getElementById('aiChatMessages');
        
        if (!input || !messages) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // اضافه کردن پیام کاربر
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `
            <div class="message-content">
                <i class="fas fa-user"></i>
                <div><p>${message}</p></div>
            </div>
        `;
        messages.appendChild(userMessage);
        
        // پاک کردن فیلد ورودی
        input.value = '';
        
        // پاسخ هوش مصنوعی (ساده)
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            
            let response = "متوجه سوال شما شدم. این نسخه نمایشی است. در نسخه کامل با DeepSeek ادغام می‌شود.";
            
            if (message.includes('دلار')) {
                response = "نرخ دلار امروز: ۸۵٫۴۲ روبل (بر اساس آخرین اطلاعات CBR)";
            } else if (message.includes('سلام')) {
                response = "سلام! من DeepSeek هستم. چطور می‌تونم کمکتون کنم؟";
            }
            
            botMessage.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-robot"></i>
                    <div><p>${response}</p></div>
                </div>
            `;
            messages.appendChild(botMessage);
            
            // اسکرول به پایین
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    }
}

// مدیر ماشین حساب
class CalculatorManager {
    constructor() {
        this.currentInput = '0';
        this.previousInput = null;
        this.operation = null;
        this.init();
    }
    
    init() {
        this.setupEvents();
        this.updateDisplay();
    }
    
    setupEvents() {
        document.querySelectorAll('.calc-btn').forEach(button => {
            button.addEventListener('click', () => {
                const number = button.getAttribute('data-number');
                const action = button.getAttribute('data-action');
                
                if (number !== null) {
                    this.inputNumber(number);
                } else if (action !== null) {
                    this.handleAction(action);
                }
                
                this.updateDisplay();
            });
        });
    }
    
    inputNumber(num) {
        this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
    }
    
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.currentInput = this.currentInput.slice(0, -1) || '0';
                break;
            case 'equals':
                this.calculate();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperation(action);
                break;
        }
    }
    
    clear() {
        this.currentInput = '0';
        this.previousInput = null;
        this.operation = null;
    }
    
    setOperation(op) {
        this.previousInput = this.currentInput;
        this.operation = op;
        this.currentInput = '0';
    }
    
    calculate() {
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        let result;
        switch (this.operation) {
            case 'add': result = prev + current; break;
            case 'subtract': result = prev - current; break;
            case 'multiply': result = prev * current; break;
            case 'divide': result = current === 0 ? 'خطا' : prev / current; break;
            default: return;
        }
        
        this.currentInput = result.toString();
        this.operation = null;
        this.previousInput = null;
    }
    
    updateDisplay() {
        const display = document.getElementById('calcDisplay');
        if (display) {
            display.value = this.currentInput;
        }
    }
}

// مدیر مترجم
class TranslatorManager {
    constructor() {
        this.setupEvents();
    }
    
    setupEvents() {
        const translateBtn = document.getElementById('translateBtn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => this.translate());
        }
    }
    
    translate() {
        const input = document.getElementById('translateInput');
        const output = document.getElementById('translatedText');
        
        if (!input || !output) return;
        
        const text = input.value.trim();
        if (!text) {
            output.innerHTML = '<p>لطفاً متنی برای ترجمه وارد کنید.</p>';
            return;
        }
        
        // شبیه‌سازی ترجمه
        output.innerHTML = `
            <p><strong>ترجمه شبیه‌سازی شده:</strong></p>
            <p>${text} (به فارسی)</p>
            <p style="color: var(--text-muted); margin-top: 10px;">در نسخه کامل با سرویس ترجمه ادغام می‌شود.</p>
        `;
    }
}

// راه‌اندازی برنامه
document.addEventListener('DOMContentLoaded', function() {
    console.log('برنامه در حال راه‌اندازی...');
    
    // مخفی کردن صفحه بارگذاری
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (loadingScreen && appContainer) {
        loadingScreen.style.display = 'none';
        appContainer.style.display = 'flex';
    }
    
    // راه‌اندازی مدیران
    window.dateTimeManager = new DateTimeManager();
    window.panelManager = new PanelManager();
    window.aiManager = new AIManager();
    window.calculatorManager = new CalculatorManager();
    window.translatorManager = new TranslatorManager();
    
    // بارگذاری اولیه داده‌ها
    setTimeout(() => {
        loadSampleData();
        updateWeatherBrief();
    }, 1000);
    
    // فعال‌سازی دکمه‌های دیگر
    setupAdditionalButtons();
    
    console.log('برنامه با موفقیت راه‌اندازی شد!');
});

// تابع بارگذاری داده‌های نمونه
function loadSampleData() {
    // داده‌های نمونه برای نرخ CBR
    const cbrContainer = document.getElementById('cbrRates');
    if (cbrContainer) {
        cbrContainer.innerHTML = `
            <div class="rate-card">
                <div class="rate-header">
                    <div class="rate-title">
                        <i class="fas fa-percentage"></i>
                        <span>نرخ کلیدی بانک مرکزی (ключевая ставка)</span>
                    </div>
                    <div class="rate-date">۱۴.۰۱.۲۰۲۶</div>
                </div>
                <div class="rate-value">۱۶٫۰۰٪</div>
                <div class="rate-change">
                    <i class="fas fa-info-circle"></i>
                    بدون تغییر از جلسه قبلی
                </div>
            </div>
            
            <div class="exchange-grid">
                <div class="exchange-card">
                    <div class="currency-header">
                        <div class="currency-name">
                            <i class="fas fa-dollar-sign"></i>
                            <span>دلار آمریکا (USD/RUB)</span>
                        </div>
                    </div>
                    <div class="currency-rate">
                        ۸۵٫۴۲ ₽
                    </div>
                    <div class="rate-change positive">
                        <i class="fas fa-arrow-up"></i>
                        تغییر: +۰٫۳۲ ₽
                    </div>
                </div>
                
                <div class="exchange-card">
                    <div class="currency-header">
                        <div class="currency-name">
                            <i class="fas fa-euro-sign"></i>
                            <span>یورو اتحادیه اروپا (EUR/RUB)</span>
                        </div>
                    </div>
                    <div class="currency-rate">
                        ۹۲٫۱۵ ₽
                    </div>
                    <div class="rate-change negative">
                        <i class="fas fa-arrow-down"></i>
                        تغییر: -۰٫۱۸ ₽
                    </div>
                </div>
            </div>
        `;
    }
    
    // اخبار نمونه
    const newsContainer = document.getElementById('newsContainer');
    if (newsContainer) {
        newsContainer.innerHTML = `
            <div class="news-card">
                <div class="news-header">
                    <h3 class="news-title">بانک مرکزی نرخ کلیدی را در سطح ۱۶٪ حفظ کرد</h3>
                    <div class="news-date">۱۴ ژانویه ۲۰۲۶</div>
                </div>
                <div class="news-content">
                    <p>بانک مرکزی روسیه در جلسه امروز خود تصمیم گرفت نرخ کلیدی را در سطح ۱۶٪ حفظ کند.</p>
                </div>
            </div>
        `;
    }
    
    // وضعیت هوا نمونه
    const weatherContainer = document.getElementById('weatherContent');
    if (weatherContainer) {
        weatherContainer.innerHTML = `
            <div class="current-weather">
                <div class="weather-main">
                    <h3>مسکو</h3>
                    <div class="temp-large">-۲°C</div>
                    <p class="weather-desc">برفی</p>
                </div>
                <div class="weather-icon-large">❄️</div>
            </div>
        `;
    }
}

// تابع بروزرسانی دمای هوا
function updateWeatherBrief() {
    const tempElement = document.getElementById('currentTemp');
    if (tempElement) {
        // دمای تصادفی
        const temp = Math.floor(Math.random() * 6) - 5;
        tempElement.textContent = `${temp}°C`;
    }
}

// تابع تنظیم دکمه‌های اضافی
function setupAdditionalButtons() {
    // پاک کردن حافظه
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', () => {
            if (confirm('آیا می‌خواهید حافظه موقت پاک شود؟')) {
                localStorage.clear();
                alert('حافظه موقت پاک شد!');
            }
        });
    }
    
    // بروزرسانی همه داده‌ها
    const refreshAllBtn = document.getElementById('refreshDataBtn');
    if (refreshAllBtn) {
        refreshAllBtn.addEventListener('click', () => {
            alert('همه داده‌ها بروزرسانی شدند!');
            loadSampleData();
            updateWeatherBrief();
        });
    }
}
