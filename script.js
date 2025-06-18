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
            // Garante que o menu feche ao clicar em um link, exceto no botão de CTA
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
            // Aberto de Seg a Sex (8h-18h) e Sábado (8h-12h)
            let aberto = (diaSemana >= 1 && diaSemana <= 5 && horaAtual >= 8 && horaAtual < 18) || (diaSemana === 6 && horaAtual >= 8 && horaAtual < 12);
            statusBadge.textContent = aberto ? 'Aberto' : 'Fechado';
            statusBadge.classList.toggle('aberto', aberto);
            statusBadge.classList.toggle('fechado', !aberto);
        }
        verificarStatusLoja(); // Verifica o status na carga da página
        setInterval(verificarStatusLoja, 60000); // Atualiza a cada minuto
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
                        const inc = target / 100; // Incrementa em 100 passos
                        if (count < target) {
                            count = Math.min(count + inc, target); // Garante que não ultrapasse o target
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCount, 15);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                observer.unobserve(heroStats); // Para de observar após a animação
            }
        }, { threshold: 0.5 }); // Inicia quando 50% do elemento está visível
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

        // Inicializa o cálculo
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
    // 3. LÓGICA DA ANIMAÇÃO SVG COM SCROLL (Se aplica a INDEX.HTML ou outra página com SVG)
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
                    trigger: ".svg-drawing-section", // Certifique-se que esta seção exista no HTML
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
    // Nova div para a mensagem temporária de redirecionamento
    const bookingDirectWhatsappInfo = document.getElementById('booking-direct-whatsapp-info');
    
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const serviceInput = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const pickupInput = document.getElementById('pickup');
    const totalPriceEl = document.getElementById('total-price');

    // Define a data mínima para hoje no campo de data
    const hoje = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', hoje);

    // Formatação do telefone
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').substring(0, 11); // Remove não-dígitos e limita a 11
        if (value.length > 6) value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
        else if (value.length > 2) value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        else if (value.length > 0) value = value.replace(/^(\d*)/, '($1');
        e.target.value = value;
    });

    // Atualiza o preço total do agendamento
    function updateTotalPrice() {
        let total = 0;
        const selectedOption = serviceInput.options[serviceInput.selectedIndex];
        if (selectedOption && selectedOption.value) {
            const priceMatch = selectedOption.text.match(/R\$\s*([\d,]+)/);
            // Handling "A partir de" for Higienização Interna, default to 200 if not specified
            if (selectedOption.value === "Higienização Interna" && !priceMatch) {
                total += 200; // Default price if "A partir de" is present without a specific number
            } else if (priceMatch && priceMatch[1]) {
                total += parseFloat(priceMatch[1].replace(',', '.'));
            }
        }
        if (pickupInput.checked) total += 5; // Adiciona R$5 se "Leva e Traz" estiver marcado
        totalPriceEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    serviceInput.addEventListener('change', updateTotalPrice);
    pickupInput.addEventListener('change', updateTotalPrice);

    // Validação do formulário
    function validateForm() {
        let isValid = true;
        // Remove mensagens de erro anteriores
        document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));

        // Helper para definir erros
        function setError(inputId, message) {
            const input = document.getElementById(inputId);
            input.parentElement.classList.add('error');
            document.getElementById(`${inputId}-error`).textContent = message;
            isValid = false;
        }

        if (nameInput.value.trim() === '') setError('name', 'Por favor, insira seu nome.');
        if (phoneInput.value.replace(/\D/g, '').length !== 11) setError('phone', 'O celular deve ter 11 dígitos (DDD + 9 dígitos).');
        if (serviceInput.value === '') setError('service', 'Por favor, selecione um serviço.');

        if (dateInput.value === '') {
            setError('date', 'Por favor, escolha uma data.');
        } else {
            const selectedDate = new Date(dateInput.value + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas a data

            if (selectedDate.getUTCDay() === 0) setError('date', 'Não agendamos aos domingos.');
            else if (selectedDate < today) setError('date', 'Não é possível agendar em data passada.');
        }
        return isValid;
    }

    // Lidar com o envio do formulário - AGORA DIRETAMENTE PARA WHATSAPP
    if (bookingForm) { // Garante que bookingForm exista antes de adicionar o listener
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário
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

                // Define o link manual de fallback
                const manualWhatsappLink = document.getElementById('manual-whatsapp-link');
                if (manualWhatsappLink) {
                    manualWhatsappLink.href = whatsappUrl;
                }

                // Mostra a mensagem temporária de sucesso
                if (bookingDirectWhatsappInfo) {
                    bookingForm.style.display = 'none';
                    bookingDirectWhatsappInfo.style.display = 'block';
                    window.scrollTo({ top: bookingDirectWhatsappInfo.offsetTop - 100, behavior: 'smooth' });

                    // Abre o WhatsApp após um pequeno atraso para o usuário ver a mensagem
                    setTimeout(() => {
                        window.open(whatsappUrl, '_blank');
                    }, 1000); // 1 segundo de atraso

                    // Reseta o formulário e esconde a mensagem após alguns segundos
                    setTimeout(() => {
                        bookingForm.reset(); // Limpa os campos do formulário
                        bookingDirectWhatsappInfo.style.display = 'none';
                        bookingForm.style.display = 'block';
                    }, 5000); // Esconde a mensagem após 5 segundos
                } else {
                    // Fallback: abre diretamente se a div de informação não for encontrada
                    window.open(whatsappUrl, '_blank');
                    bookingForm.reset();
                }
            }
        });

        // Inicializa o cálculo do preço total ao carregar
        updateTotalPrice();
    }

    // ===================================================================
    // 5. ANIMAÇÕES DA PÁGINA SOBRE NÓS
    // ===================================================================
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animação da Linha do Tempo
        if (document.querySelector('.timeline-section')) {
            const milestones = gsap.utils.toArray('.milestone');
            milestones.forEach(milestone => {
                gsap.fromTo(milestone, {
                    opacity: 0,
                    x: milestone.classList.contains('milestone-left') ? -100 : 100 // Animação da esquerda/direita
                }, {
                    opacity: 1,
                    x: 0,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: milestone,
                        start: 'top 85%', // Começa a animar quando 85% do elemento está visível
                        end: 'bottom 75%', // Termina quando 75% do elemento está visível
                        toggleActions: 'play none none reverse' // Play na entrada, reverte na saída
                    }
                });
            });

            // Animação da linha de preenchimento da linha do tempo
            gsap.to(".timeline-road-fill", {
                scaleY: 1,
                scrollTrigger: {
                    trigger: ".timeline-section",
                    start: "top 30%",
                    end: "bottom 80%",
                    scrub: 1.5, // Anima suavemente com o scroll
                }
            });
        }
    }

});
