// 健康寿命カウントダウンタイマーツール
class HealthTimer {
    constructor() {
        this.healthExpectancy = {
            male: 72.68,
            female: 75.38
        };
        this.currentTone = 'medium';
        this.currentAdviceIndex = 0;
        this.countdownInterval = null;
        
        this.adviceData = {
            spicy: [
                "動けなくなってからじゃ遅いんだよ！健康こそが最強の資産だ。今すぐ行動しろ！",
                "まだ若いからって油断してんじゃねーぞ。健康は貯金と同じ。今から積立ないと、老後がマジでヤバい。",
                "時間は待ってくれない。今日からでも遅いくらいだ。本気で健康に向き合え！",
                "言い訳している暇があったら運動しろ。後悔したって時間は戻ってこないんだ。",
                "健康管理は自己責任だ。誰も代わりにやってくれないぞ。甘えるな！"
            ],
            medium: [
                "あなたの健康寿命は有限です。後で後悔しないように、今できることから始めてみませんか？",
                "忙しい毎日かもしれませんが、少しの時間でも運動や食事に気を配ることが、未来のあなたを助けます。",
                "健康は一日にしてならず。小さな習慣の積み重ねが大きな違いを生みます。",
                "年齢を重ねるごとに、健康の大切さが身に染みてきます。今のうちから意識を向けてみましょう。",
                "健康寿命を延ばすために、今日から少しずつ生活習慣を見直してみませんか？"
            ],
            mild: [
                "あなたは健康に恵まれています。この素晴らしい状態をこれからも大切にしていきましょうね。",
                "毎日頑張っているあなたへ。たまには自分の体を労わって、心と体を休ませてあげてください。",
                "健康でいられることは本当に幸せなことです。今日という日を大切に過ごしてくださいね。",
                "あなたのペースで大丈夫。無理をせず、楽しみながら健康習慣を続けていきましょう。",
                "心と体の健康は繋がっています。笑顔でいることも、大切な健康法の一つですよ。"
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupDateSelects();
        this.setupEventListeners();
    }
    
    setupDateSelects() {
        const yearSelect = document.getElementById('birth-year');
        const monthSelect = document.getElementById('birth-month');
        const daySelect = document.getElementById('birth-day');
        
        // 年の選択肢を生成（1920年から現在まで）
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1920; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        
        // 月の選択肢を生成
        for (let month = 1; month <= 12; month++) {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month;
            monthSelect.appendChild(option);
        }
        
        // 日の選択肢を生成
        for (let day = 1; day <= 31; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }
    
    setupEventListeners() {
        const healthForm = document.getElementById('health-form');
        const newAdviceBtn = document.getElementById('new-advice-btn');
        const backToFormBtn = document.getElementById('back-to-form');
        
        healthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateHealthExpectancy();
        });
        
        newAdviceBtn.addEventListener('click', () => {
            this.showNewAdvice();
        });
        
        backToFormBtn.addEventListener('click', () => {
            this.showForm();
        });
    }
    
    calculateHealthExpectancy() {
        const birthYear = parseInt(document.getElementById('birth-year').value);
        const birthMonth = parseInt(document.getElementById('birth-month').value);
        const birthDay = parseInt(document.getElementById('birth-day').value);
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        const tone = document.querySelector('input[name="tone"]:checked')?.value;
        
        if (!birthYear || !birthMonth || !birthDay || !gender || !tone) {
            alert('すべての項目を入力してください。');
            return;
        }
        
        this.currentTone = tone;
        
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
        const currentDate = new Date();
        const age = (currentDate - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
        
        const healthExpectancyAge = this.healthExpectancy[gender];
        const healthExpectancyDate = new Date(birthYear + healthExpectancyAge, birthMonth - 1, birthDay);
        
        this.showResult(healthExpectancyDate, age >= healthExpectancyAge);
    }
    
    showResult(targetDate, isExpired) {
        const formContainer = document.getElementById('timer-form-container');
        const resultContainer = document.getElementById('timer-result-container');
        const resultTitle = document.getElementById('result-title');
        
        formContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        
        if (isExpired) {
            resultTitle.textContent = 'あなたの健康寿命はすでに過ぎています';
            document.getElementById('countdown-display').innerHTML = 
                '<p style="font-size: 1.2rem; color: #8b6f47; text-align: center; padding: 2rem;">今日という一日を大切に、心穏やかにお過ごしください。</p>';
        } else {
            resultTitle.textContent = 'あなたの健康寿命まで';
            this.startCountdown(targetDate);
        }
        
        this.showAdvice();
    }
    
    startCountdown(targetDate) {
        const updateCountdown = () => {
            const now = new Date();
            const difference = targetDate - now;
            
            if (difference > 0) {
                const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
                const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                
                document.getElementById('years').textContent = years;
                document.getElementById('days').textContent = days;
                document.getElementById('hours').textContent = hours;
                document.getElementById('minutes').textContent = minutes;
                document.getElementById('seconds').textContent = seconds;
            }
        };
        
        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    showAdvice() {
        const adviceDisplay = document.getElementById('advice-display');
        const adviceList = this.adviceData[this.currentTone];
        const randomIndex = Math.floor(Math.random() * adviceList.length);
        
        adviceDisplay.style.opacity = '0';
        setTimeout(() => {
            adviceDisplay.textContent = adviceList[randomIndex];
            adviceDisplay.style.opacity = '1';
        }, 300);
        
        this.currentAdviceIndex = randomIndex;
    }
    
    showNewAdvice() {
        const adviceList = this.adviceData[this.currentTone];
        let newIndex;
        
        do {
            newIndex = Math.floor(Math.random() * adviceList.length);
        } while (newIndex === this.currentAdviceIndex && adviceList.length > 1);
        
        const adviceDisplay = document.getElementById('advice-display');
        adviceDisplay.style.opacity = '0';
        
        setTimeout(() => {
            adviceDisplay.textContent = adviceList[newIndex];
            adviceDisplay.style.opacity = '1';
        }, 300);
        
        this.currentAdviceIndex = newIndex;
    }
    
    showForm() {
        const formContainer = document.getElementById('timer-form-container');
        const resultContainer = document.getElementById('timer-result-container');
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        formContainer.style.display = 'block';
        resultContainer.style.display = 'none';
    }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    new HealthTimer();
});