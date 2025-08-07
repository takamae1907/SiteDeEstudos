document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO WIDGET DE LEMBRETES ---
    const populateRemindersWidget = () => {
        const lembretesList = document.querySelector('.right-column .lembretes-widget ul');
        if (!lembretesList) return;

        // Dados de exemplo, já que o localStorage estaria vazio
        const exampleReminders = [
            { text: 'Revisar Direito Penal', date: '2025-08-07' },
            { text: 'Simulado Semanal', date: '2025-08-09' },
            { text: 'Ler 10 págs da Lei 8.112', date: '2025-08-06' },
            { text: 'Assistir aula de RLM', date: '2025-08-13' }
        ];

        const reminders = JSON.parse(localStorage.getItem('reminders')) || exampleReminders;
        const sortedReminders = reminders.sort((a, b) => new Date(a.date) - new Date(b.date));

        lembretesList.innerHTML = ''; // Limpa a lista antiga

        if (sortedReminders.length === 0) {
            lembretesList.innerHTML = '<li>Nenhum lembrete cadastrado.</li>';
            return;
        }

        sortedReminders.forEach(reminder => {
            const li = document.createElement('li');
            const dataLembrete = new Date(reminder.date + 'T03:00:00Z'); // Ajuste de fuso
            const hoje = new Date();
            const amanha = new Date();
            amanha.setDate(hoje.getDate() + 1);

            let textoData;
            if (dataLembrete.toDateString() === hoje.toDateString()) {
                textoData = 'Hoje';
            } else if (dataLembrete.toDateString() === amanha.toDateString()) {
                textoData = 'Amanhã';
            } else {
                 textoData = dataLembrete.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            }

            li.innerHTML = `<strong>${reminder.text}</strong><span>${textoData}</span>`;
            lembretesList.appendChild(li);
        });
    };
    populateRemindersWidget();

    
    // --- LÓGICA DO CARROSSEL ÚNICO (CÓDIGO CORRIGIDO) ---
    const swiper = new Swiper('.turmas-carousel', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 20 }
        }
    });

    // --- MANUTENÇÃO DAS OUTRAS FUNCIONALIDADES ---
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const link = event.currentTarget.querySelector('a');
            if (link.getAttribute('href') !== '#') {
                window.location.href = link.getAttribute('href');
            } else {
                sidebarItems.forEach(i => i.classList.remove('active'));
                event.currentTarget.classList.add('active');
            }
        });
    });

    // Pesquisa de Turmas (CÓDIGO CORRIGIDO E SIMPLIFICADO)
    const searchInput = document.querySelector('.turmas-section input');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            
            // A busca com Swiper é mais complexa, pois envolve slides clonados.
            // A abordagem mais simples é filtrar e recriar os slides, mas isso é pesado.
            // Uma abordagem de "força bruta" é esconder os que não batem:
            const slides = document.querySelectorAll('.turmas-carousel .swiper-slide');
            slides.forEach(slide => {
                const turmaTitle = slide.querySelector('.turma-title').textContent.toLowerCase();
                if (turmaTitle.includes(searchTerm)) {
                    slide.style.display = 'flex';
                } else {
                    slide.style.display = 'none';
                }
            });
            
            // Atualiza o Swiper para reconhecer as mudanças
            swiper.update();
        });
    }

    const pesquisaButton = document.querySelector('.main-header button');
    if(pesquisaButton) pesquisaButton.addEventListener('click', () => alert('Obrigado por participar da pesquisa! (Função de exemplo)'));

    const editalIcons = document.querySelectorAll('.editais-widget .editais-icons i');
    editalIcons.forEach(icon => icon.addEventListener('click', () => alert(`Ação de exemplo: "${icon.title}"`)));
});