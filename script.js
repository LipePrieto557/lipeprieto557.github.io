document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // 1. FUNCIONALIDADES GERAIS E NAVBAR
    // ===================================================================

    // Lógica do Modo Noturno / Claro
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        const themeIcon = themeSwitcher.querySelector('i');
        const applyTheme = (theme) => {
            if (theme === 'light') {
                document.body.classList.add('light-mode');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                document.body.classList.remove('light-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        };
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);

        themeSwitcher.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Menu Hamburger (Mobile)
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            if (!link.classList.contains('cta-button-small')) {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            }
        });
    }

    // Efeito da Barra de Navegação ao Rolar
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    // ===================================================================
    // 2. FUNCIONALIDADES DA PÁGINA PRINCIPAL (INDEX.HTML)
    // ===================================================================

    // Status de Funcionamento (Aberto/Fechado)
    const statusBadge = document.getElementById('status-loja');
    if (statusBadge) {
        function verificarStatusLoja() {
            const agora = new Date();
            const diaSemana = agora.getDay();
            const horaAtual = agora.getHours() + (agora.getMinutes() / 60);
            let aberto = (diaSemana >= 1 && diaSemana <= 5 && horaAtual >= 8 && horaAtual < 18) || (diaSemana === 6 && horaAtual >= 8 && horaAtual < 12);
            statusBadge.textContent = aberto ? 'Aberto' : 'Fechado';
            statusBadge.classList.toggle('aberto', aberto);
            statusBadge.classList.toggle('fechado', !aberto);
        }
        verificarStatusLoja();
        setInterval(verificarStatusLoja, 60000);
    }

    // Animação de Contagem dos Números
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    let count = 0;
                    const updateCount = () => {
                        const inc = target / 100;
                        if (count < target) {
                            count = Math.min(count + inc, target);
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCount, 15);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                observer.unobserve(heroStats);
            }
        }, { threshold: 0.5 });
        observer.observe(heroStats);
    }

    // Inicialização da Biblioteca de Animações (AOS)
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true, offset: 50 });
    }

    // Lógica da Calculadora de Pacotes
    const packageOptions = document.querySelectorAll('.options-list input[type="checkbox"]');
    const customTotalPriceEl = document.getElementById('custom-total-price');
    const agendarPacoteBtn = document.getElementById('agendar-pacote-btn');
    if (packageOptions.length > 0 && customTotalPriceEl && agendarPacoteBtn) {
        function calculateCustomPackage() {
            let total = 0;
            packageOptions.forEach(option => {
                if (option.checked) total += parseFloat(option.getAttribute('data-price'));
            });
            customTotalPriceEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        packageOptions.forEach(option => option.addEventListener('change', calculateCustomPackage));
        calculateCustomPackage();

        agendarPacoteBtn.addEventListener('click', () => {
            let servicosSelecionados = [];
            packageOptions.forEach(option => {
                if (option.checked) servicosSelecionados.push(option.nextElementSibling.textContent);
            });
            if (servicosSelecionados.length === 0) {
                alert('Por favor, selecione pelo menos um serviço para agendar.');
                return;
            }
            const precoTotal = customTotalPriceEl.textContent;
            const listaServicos = servicosSelecionados.join(', ');
            const whatsappMessage = `Olá! Gostaria de agendar o seguinte pacote:\n\n*Serviços:* ${listaServicos}\n*Total:* ${precoTotal}\n\nQual o próximo passo?`;
            const whatsappUrl = `https://wa.me/5514988388121?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // ===================================================================
    // 3. LÓGICA DA ANIMAÇÃO SVG COM SCROLL
    // ===================================================================
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        const carPath = document.getElementById("car-path");
        if (carPath) {
            const pathLength = carPath.getTotalLength();
            gsap.set(carPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
            gsap.to(carPath, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".svg-drawing-section",
                    start: "top center",
                    end: "bottom center",
                    scrub: 1
                }
            });
        }
    }

    // ===================================================================
    // 4. LÓGICA DO FORMULÁRIO DE AGENDAMENTO
    // ===================================================================
    const bookingForm = document.getElementById('booking-form');
    const bookingDirectWhatsappInfo = document.getElementById('booking-direct-whatsapp-info');
    
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const serviceInput = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const pickupInput = document.getElementById('pickup');
    const totalPriceEl = document.getElementById('total-price');

    if(dateInput) {
        const hoje = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', hoje);
    }
    
    if(phoneInput){
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '').substring(0, 11);
            if (value.length > 6) value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            else if (value.length > 2) value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
            else if (value.length > 0) value = value.replace(/^(\d*)/, '($1');
            e.target.value = value;
        });
    }

    function updateTotalPrice() {
        if(!serviceInput || !pickupInput || !totalPriceEl) return;
        let total = 0;
        const selectedOption = serviceInput.options[serviceInput.selectedIndex];
        if (selectedOption && selectedOption.value) {
            const priceMatch = selectedOption.text.match(/R\$\s*([\d,]+)/);
            if (selectedOption.value === "Higienização Interna" && !priceMatch) {
                total += 200;
            } else if (priceMatch && priceMatch[1]) {
                total += parseFloat(priceMatch[1].replace(',', '.'));
            }
        }
        if (pickupInput.checked) total += 5;
        totalPriceEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    if(serviceInput) serviceInput.addEventListener('change', updateTotalPrice);
    if(pickupInput) pickupInput.addEventListener('change', updateTotalPrice);
    
    function validateForm() {
        let isValid = true;
        document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));

        function setError(inputId, message) {
            const input = document.getElementById(inputId);
            if(input && input.parentElement) {
                input.parentElement.classList.add('error');
                const errorEl = document.getElementById(`${inputId}-error`);
                if(errorEl) errorEl.textContent = message;
                isValid = false;
            }
        }

        if (nameInput && nameInput.value.trim() === '') setError('name', 'Por favor, insira seu nome.');
        if (phoneInput && phoneInput.value.replace(/\D/g, '').length !== 11) setError('phone', 'O celular deve ter 11 dígitos (DDD + 9 dígitos).');
        if (serviceInput && serviceInput.value === '') setError('service', 'Por favor, selecione um serviço.');

        if (dateInput) {
            if(dateInput.value === ''){
                 setError('date', 'Por favor, escolha uma data.');
            } else {
                const selectedDate = new Date(dateInput.value + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate.getUTCDay() === 0) setError('date', 'Não agendamos aos domingos.');
                else if (selectedDate < today) setError('date', 'Não é possível agendar em data passada.');
            }
        }
        return isValid;
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm()) {
                const formData = {
                    name: nameInput.value,
                    phone: phoneInput.value,
                    service: serviceInput.options[serviceInput.selectedIndex].text,
                    date: new Date(dateInput.value + 'T00:00:00').toLocaleDateString('pt-BR'),
                    pickup: pickupInput.checked ? 'Sim' : 'Não',
                    total: totalPriceEl.textContent
                };

                const whatsappMessage = `Olá! Gostaria de agendar meu serviço:\n\n*Nome:* ${formData.name}\n*Telefone:* ${formData.phone}\n*Serviço:* ${formData.service}\n*Data:* ${formData.date}\n*Leva e Traz:* ${formData.pickup}\n*Total Estimado:* ${formData.total}\n\nPor favor, confirme meu agendamento!`;
                const whatsappUrl = `https://wa.me/5514988388121?text=${encodeURIComponent(whatsappMessage)}`;

                const manualWhatsappLink = document.getElementById('manual-whatsapp-link');
                if (manualWhatsappLink) {
                    manualWhatsappLink.href = whatsappUrl;
                }

                if (bookingDirectWhatsappInfo) {
                    bookingForm.style.display = 'none';
                    bookingDirectWhatsappInfo.style.display = 'block';
                    window.scrollTo({ top: bookingDirectWhatsappInfo.offsetTop - 100, behavior: 'smooth' });
                    
                    setTimeout(() => {
                        window.open(whatsappUrl, '_blank');
                    }, 1000);

                    setTimeout(() => {
                        bookingForm.reset();
                        updateTotalPrice();
                        bookingDirectWhatsappInfo.style.display = 'none';
                        bookingForm.style.display = 'block';
                    }, 5000);
                } else {
                    window.open(whatsappUrl, '_blank');
                    bookingForm.reset();
                    updateTotalPrice();
                }
            }
        });
        if(typeof updateTotalPrice === 'function') {
            updateTotalPrice();
        }
    }
    
    // ===================================================================
    // 5. ANIMAÇÕES DA PÁGINA SOBRE NÓS
    // ===================================================================
    if (typeof gsap !== 'undefined' && document.querySelector('.timeline-section')) {
        gsap.registerPlugin(ScrollTrigger);
        
        const milestones = gsap.utils.toArray('.milestone');
        milestones.forEach(milestone => {
            gsap.fromTo(milestone, 
                { opacity: 0, x: milestone.classList.contains('milestone-left') ? -100 : 100 }, 
                { opacity: 1, x: 0, ease: 'power2.out',
                    scrollTrigger: {
                        trigger: milestone,
                        start: 'top 85%',
                        end: 'bottom 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        gsap.to(".timeline-road-fill", {
            scaleY: 1,
            scrollTrigger: {
                trigger: ".timeline-section",
                start: "top 30%",
                end: "bottom 80%",
                scrub: 1.5,
            }
        });
    }

    // ===================================================================
    // 6. EFEITO PARALLAX DE MOUSE NA SEÇÃO HERO
    // ===================================================================
    // Só executa se não for um dispositivo de toque
    if (window.matchMedia("(pointer: fine)").matches) {
        
        const heroSection = document.querySelector('.hero-parallax');
        
        if (heroSection) {
            heroSection.addEventListener('mousemove', function(e) {
                const bg = this.querySelector('.parallax-bg');
                if (!bg) return;
                
                // Posição do mouse na tela
                const x = e.clientX;
                const y = e.clientY;
                
                // Força do efeito (quanto menor o número, mais forte o movimento)
                const strength = 50; 
                
                // Calcula o movimento
                const moveX = -(x / strength);
                const moveY = -(y / strength);
                
                // Usa GSAP para uma animação suave
                gsap.to(bg, {
                    duration: 0.8,
                    x: moveX,
                    y: moveY,
                    ease: 'power2.out'
                });
            });
        }
    }

});
