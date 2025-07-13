// Theme toggle functionality
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply the theme
document.body.setAttribute('data-theme', currentTheme);

// Theme toggle click handler
themeToggleBtn.addEventListener('click', () => {
    const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

function showTab(targetTab) {
    // Remove active class from all tabs and panels
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding panel
    const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
    const activePanel = document.getElementById(targetTab);
    
    if (activeButton && activePanel) {
        activeButton.classList.add('active');
        activePanel.classList.add('active');
    }
}

// Tab click handlers
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        showTab(targetTab);
        
        // Update URL hash without scrolling
        history.replaceState(null, null, `#${targetTab}`);
    });
});

// Handle initial tab based on URL hash
document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    const validTabs = ['about', 'work', 'thoughts', 'connect'];
    
    if (hash && validTabs.includes(hash)) {
        showTab(hash);
    } else {
        showTab('about'); // Default tab
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    const validTabs = ['about', 'work', 'thoughts', 'connect'];
    
    if (hash && validTabs.includes(hash)) {
        showTab(hash);
    } else {
        showTab('about');
    }
});

// Smooth animations for skill tags
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'translateX(4px) scale(1.02)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'translateX(0) scale(1)';
    });
});

// Enhanced hover effects for cards
document.querySelectorAll('.section-block').forEach(block => {
    block.addEventListener('mouseenter', () => {
        block.style.transform = 'translateY(-3px)';
    });
    
    block.addEventListener('mouseleave', () => {
        block.style.transform = 'translateY(0)';
    });
});

// Social link hover effects
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
});

// Keyboard navigation for tabs
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeTab = document.querySelector('.tab-btn.active');
        const allTabs = Array.from(tabButtons);
        const currentIndex = allTabs.indexOf(activeTab);
        
        let newIndex;
        if (e.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
        } else {
            newIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        const newTab = allTabs[newIndex].getAttribute('data-tab');
        showTab(newTab);
        history.replaceState(null, null, `#${newTab}`);
    }
});

// Add focus management for accessibility
tabButtons.forEach(button => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});

// Lazy loading animation for tab content
const observerOptions = {
    threshold: 0.1,
    rootMargin: '20px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all section blocks
document.querySelectorAll('.section-block').forEach(block => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(20px)';
    block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(block);
});

// Chatbot functionality
class Chatbot {
    constructor() {
        this.container = document.getElementById('chatbot-container');
        this.toggle = document.getElementById('chatbot-toggle');
        this.close = document.getElementById('chatbot-close');
        this.messages = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.send = document.getElementById('chatbot-send');
        this.typing = document.getElementById('chatbot-typing');
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.close.addEventListener('click', () => this.closeChat());
        this.send.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Add welcome message
        this.addMessage('Hi! I\'m Shantanu\'s AI mini-me. I\'m currently being set up - thanks for your patience! In the meantime, feel free to check out his work experience and connect with him via email or LinkedIn.', 'bot');
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.container.classList.remove('chatbot-hidden');
        this.isOpen = true;
        this.input.focus();
    }
    
    closeChat() {
        this.container.classList.add('chatbot-hidden');
        this.isOpen = false;
    }
    
    addMessage(text, sender) {
        const message = document.createElement('div');
        message.className = `message ${sender}`;
        message.textContent = text;
        this.messages.appendChild(message);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
    
    showTyping() {
        this.typing.classList.remove('typing-hidden');
    }
    
    hideTyping() {
        this.typing.classList.add('typing-hidden');
    }
    
    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;
        
        // Add user message
        this.addMessage(text, 'user');
        this.input.value = '';
        this.send.disabled = true;
        
        // Show typing indicator
        this.showTyping();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text })
            });
            
            const data = await response.json();
            
            this.hideTyping();
            
            if (response.ok) {
                this.addMessage(data.message, 'bot');
            } else {
                this.addMessage(data.message || 'Sorry, I encountered an error. Please try again.', 'bot');
            }
        } catch (error) {
            this.hideTyping();
            this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'bot');
        }
        
        this.send.disabled = false;
        this.input.focus();
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});