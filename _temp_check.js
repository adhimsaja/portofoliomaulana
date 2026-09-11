
    // ── NAVBAR ──
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    function toggleNav() {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    }

    function closeNav() {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // ── ACTIVE NAV LINK ──
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[data-scroll]');

    function updateActiveNav() {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navAnchors.forEach(anchor => {
        anchor.classList.remove('active');
        if (anchor.getAttribute('href') === '#' + current) {
          anchor.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);

    // ── SCROLL REVEAL & INTERACTIVE ANIMATIONS ──

    // 1. Universal reveal: semua .reveal element (section headers, cards, items)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Build section sub-elements: header, subtitle, contact info, form
    const buildElements = document.querySelectorAll('.build-header, .build-subtitle, .build-contact-info, .build-form');
    const buildObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          buildObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });
    buildElements.forEach(el => buildObserver.observe(el));

    // 3. Skill bar interaktif: animasi saat scroll masuk viewport
    const skillItems = document.querySelectorAll('.skill-item');

    function animateSkillItem(item) {
      if (item.classList.contains('skill-animated')) return;
      item.classList.add('skill-animated', 'visible');
      const bars = item.querySelectorAll('.skill-bar');
      const percentages = item.querySelectorAll('.skill-percentage');
      bars.forEach((bar, i) => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { if (w) bar.style.width = w + '%'; }, i * 120);
      });
      // Animate percentages with count-up effect
      percentages.forEach((p, idx) => {
        const text = p.textContent.trim();
        const match = text.match(/(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = text.replace(match[1], '');
          let current = 0;
          const startTime = performance.now();
          const duration = 1400;
          function animatePercent(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            current = Math.round(target * ease);
            p.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(animatePercent);
            } else {
              p.textContent = target + suffix;
            }
          }
          setTimeout(() => {
            requestAnimationFrame(animatePercent);
          }, idx * 150 + bars.length * 120 + 100);
        } else {
          // Non-numeric (Native, Working, dll) — cukup show
          setTimeout(() => {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
          }, idx * 150 + bars.length * 120 + 100);
        }
      });
    }

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillItem(entry.target);
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    skillItems.forEach(item => {
      skillObserver.observe(item);
      // Fallback: jalan langsung setelah 300ms kalau belum di-animate
      setTimeout(() => {
        if (!item.classList.contains('skill-animated')) {
          animateSkillItem(item);
        }
      }, 300);
    });

    // 4. Stat counter — jalan saat scroll masuk ATAU langsung di load
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateStatCounter(el) {
      const target = parseFloat(el.getAttribute('data-target'));
      const isDecimal = el.getAttribute('data-decimal') === 'true';
      const duration = 2000;
      const startTime = performance.now();
      function animateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = target * ease;
        el.textContent = isDecimal ? current.toFixed(2) : Math.round(current);
        if (progress < 1) requestAnimationFrame(animateCounter);
        else el.textContent = isDecimal ? target.toFixed(2) : target;
      }
      requestAnimationFrame(animateCounter);
    }

    const statCountObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStatCounter(entry.target);
          statCountObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -20px 0px' });

    statNumbers.forEach(num => {
      // Coba observer dulu — kalau gagal (karena udah di viewport), run langsung
      statCountObserver.observe(num);
      // Fallback: jalan langsung setelah 500ms kalau belum di-animate
      setTimeout(() => {
        if (num.textContent === '0') {
          animateStatCounter(num);
        }
      }, 500);
    });

    // 5. Mouse tracking glow + 3D tilt pada kartu layanan & project
    document.querySelectorAll('[data-mouse-tracking]').forEach(card => {
      card.classList.add('card-3d');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
        // 3D tilt effect
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = py * -8;
        const tiltY = px * 8;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });

    // 6. Scroll progress bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    });

    // 7. Build Form Handler — FormSubmit.co
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('.build-submit-btn');
        btn.innerHTML = 'Mengirim...';
        btn.disabled = true;

        fetch(this.action, {
          method: 'POST',
          body: new FormData(this),
          mode: 'no-cors',
        }).then(() => {
          window.location.href = this.action + '?submitted=1';
        }).catch(() => {
          window.location.href = this.action + '?submitted=1';
        });
      });
    }

    // Detect ?submitted=1 dari redirect FormSubmit.co
    if (window.location.search.includes('submitted=1') && formSuccess) {
      formSuccess.textContent = 'Pesan kamu telah terkirim! Saya akan segera menghubungimu. ✦';
      formSuccess.classList.add('show');
      if (contactForm) {
        contactForm.reset();
        contactForm.querySelector('.build-submit-btn').disabled = false;
        contactForm.querySelector('.build-submit-btn').innerHTML = 'Send Message <span class="btn-arrow">→</span>';
      }
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 6000);
    }
  