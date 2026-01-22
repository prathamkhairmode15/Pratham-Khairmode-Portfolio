document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggling
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    // If no saved preference, prefer dark (futuristic/cybersec default)
    if (!savedTheme) {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            // default to dark for this portfolio vibe
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    } else {
        if (savedTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // Mobile Menu
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeMenu = document.querySelector('.close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    mobileBtn.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Smooth Scrolling for Safari/Older Browsers (Optional enhancement)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Binary / Matrix-style background animation for hero
    (function initBinaryCanvas() {
        const canvas = document.getElementById('binary-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const chars = ['0','1'];
        let width = 0, height = 0, fontSize = 14, columns = [], rafId;
        let dpr = window.devicePixelRatio || 1;

        function resize() {
            // account for devicePixelRatio for crisp rendering
            dpr = window.devicePixelRatio || 1;
            const cssW = Math.floor(canvas.offsetWidth);
            const cssH = Math.floor(canvas.offsetHeight);
            canvas.style.width = cssW + 'px';
            canvas.style.height = cssH + 'px';
            canvas.width = cssW * dpr;
            canvas.height = cssH * dpr;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale context to DPR

            width = cssW;
            height = cssH;

            fontSize = Math.max(10, Math.floor(width / 80));
            const cols = Math.max(1, Math.floor(width / fontSize));
            columns = new Array(cols).fill(0).map(() => Math.floor(Math.random() * (height / fontSize)));
            ctx.font = fontSize + 'px monospace';
            ctx.textBaseline = 'top';
        }

        function draw() {
            // translucent background for trailing effect
            ctx.fillStyle = 'rgba(1,3,10,0.06)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = 'rgba(0,245,255,0.95)'; // neon cyan
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(0,245,255,0.6)';

            for (let i = 0; i < columns.length; i++) {
                const text = chars[(Math.random() > 0.5) ? 0 : 1];
                const x = i * fontSize;
                const y = columns[i] * fontSize;
                ctx.fillText(text, x, y);
                if (y > height && Math.random() > 0.975) {
                    columns[i] = 0;
                }
                columns[i]++;
            }

            rafId = requestAnimationFrame(draw);
        }

        // safe restart helper
        function restart() {
            if (rafId) cancelAnimationFrame(rafId);
            resize();
            rafId = requestAnimationFrame(draw);
        }

        resize();
        window.addEventListener('resize', restart, { passive: true });
        window.addEventListener('orientationchange', restart, { passive: true });

        // pause animation when tab hidden to save CPU
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
            } else {
                if (!rafId) rafId = requestAnimationFrame(draw);
            }
        });

        draw();
    })();
});
