// ========================================
// スクロールアニメーション
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // スクロールに応じてフェードインアニメーションを実行
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を監視
    const fadeElements = document.querySelectorAll('.benefit-item, .problem-item, .testimonial-item, .service-item, .philosophy-features .feature-item');
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
});

// ========================================
// スムーススクロール
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // ページ内リンクのスムーススクロール
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 20; // 少し余白を設ける
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ========================================
// モバイル固定ボタンの表示制御
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileButtons = document.querySelector('.mobile-footer-buttons');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateButtonsVisibility() {
        const currentScrollY = window.scrollY;
        
        // スクロール方向を判定
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // 下にスクロール（ボタンを隠す）
            mobileButtons.style.transform = 'translateY(100%)';
        } else {
            // 上にスクロールまたはページトップ近く（ボタンを表示）
            mobileButtons.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateButtonsVisibility);
            ticking = true;
        }
    }

    // スクロールイベントリスナー
    window.addEventListener('scroll', requestTick);
    
    // 初期状態でボタンを表示
    if (mobileButtons) {
        mobileButtons.style.transition = 'transform 0.3s ease';
    }
});

// ========================================
// CTAボタンのクリック解析
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .mobile-btn.apply');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // クリック位置を記録（解析用）
            const buttonText = this.textContent.trim();
            const buttonPosition = this.getBoundingClientRect();
            
            // Google Analytics や他の解析ツールにイベントを送信
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'CTA',
                    event_label: buttonText,
                    value: 1
                });
            }
            
            // コンソールログ（開発用）
            console.log(`CTA clicked: ${buttonText} at position:`, buttonPosition);
        });
    });
});

// ========================================
// パフォーマンス最適化
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 画像の遅延読み込み（Intersection Observer API使用）
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    observer.unobserve(img);
                }
            }
        });
    });

    // data-src属性を持つ画像を監視
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
});

// ========================================
// フォーム送信の処理（将来的な拡張用）
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // フォーム送信前の処理
            const submitButton = this.querySelector('button[type="submit"], input[type="submit"]');
            
            if (submitButton) {
                // ボタンを無効化してダブルクリックを防ぐ
                submitButton.disabled = true;
                submitButton.textContent = '送信中...';
                
                // 3秒後にボタンを有効化（失敗時のため）
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = '送信する';
                }, 3000);
            }
        });
    });
});

// ========================================
// ページ読み込み完了時の処理
// ========================================
window.addEventListener('load', function() {
    // ページの読み込み完了をマーク
    document.body.classList.add('page-loaded');
    
    // パフォーマンス計測（開発用）
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
});

// ========================================
// エラーハンドリング
// ========================================
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // 本番環境では解析ツールにエラーを送信
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.error.message,
            fatal: false
        });
    }
});

// ========================================
// ユーザビリティ向上
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 外部リンクに target="_blank" が設定されている場合の処理
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        // セキュリティのため rel="noopener" を追加
        const currentRel = link.getAttribute('rel') || '';
        if (!currentRel.includes('noopener')) {
            link.setAttribute('rel', currentRel + ' noopener');
        }
        
        // アクセシビリティのため、新しいタブで開くことを示すテキストを追加
        const linkText = link.textContent;
        if (!linkText.includes('（新しいタブで開きます）')) {
            link.setAttribute('aria-label', linkText + '（新しいタブで開きます）');
        }
    });
});

// ========================================
// 開発用のコンソールメッセージ
// ========================================
if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    console.log('🧘‍♀️ ILM YOGA - Development Mode');
    console.log('Website loaded successfully!');
}