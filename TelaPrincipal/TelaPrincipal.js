document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO WIDGET DE LEMBRETES ---
    const populateRemindersWidget = () => {
        const lembretesList = document.querySelector('.right-column .lembretes-widget ul');
        if (!lembretesList) return;

        // Usando dados de exemplo, já que o localStorage estaria vazio no início
        const exampleReminders = [
            { text: 'Revisar Direito Penal', date: '2025-08-08' }, // Amanhã
            { text: 'Simulado Semanal', date: '2025-08-09' }, // Sábado
            { text: 'Ler 10 págs da Lei 8.112', date: '2025-08-07' }, // Hoje
            { text: 'Assistir aula de RLM', date: '2025-08-13' } // Quarta-feira
        ];

        // Tenta pegar do localStorage, se não houver, usa o exemplo
        const reminders = JSON.parse(localStorage.getItem('reminders')) || exampleReminders;
        const sortedReminders = reminders.sort((a, b) => new Date(a.date) - new Date(b.date));

        lembretesList.innerHTML = ''; // Limpa a lista para evitar duplicatas

        if (sortedReminders.length === 0) {
            lembretesList.innerHTML = '<li>Nenhum lembrete cadastrado.</li>';
            return;
        }

        sortedReminders.forEach(reminder => {
            const li = document.createElement('li');
            const dataLembrete = new Date(reminder.date);
            const hoje = new Date();
            const amanha = new Date();
            amanha.setDate(hoje.getDate() + 1);

            let textoData;
            // Corrigindo para ignorar a hora na comparação de datas
            if (dataLembrete.setHours(0, 0, 0, 0) === hoje.setHours(0, 0, 0, 0)) {
                textoData = 'Hoje, 19:00'; // Exemplo de hora
            } else if (dataLembrete.setHours(0, 0, 0, 0) === amanha.setHours(0, 0, 0, 0)) {
                textoData = 'Amanhã, 10:00'; // Exemplo de hora
            } else {
                // Formato mais genérico para outras datas
                textoData = dataLembrete.toLocaleDateString('pt-BR', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
            }

            li.innerHTML = `<strong>${reminder.text}</strong><span>${textoData}</span>`;
            lembretesList.appendChild(li);
        });
    };
    populateRemindersWidget();


    // --- MANUTENÇÃO DAS OUTRAS FUNCIONALIDADES ---

    // Menu da Barra Lateral
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

    // Pesquisa de Turmas (funciona com a grade estática)
    const searchInput = document.querySelector('.turmas-section input');
    const turmasCards = document.querySelectorAll('.turmas-grid .turma-card');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            turmasCards.forEach(card => {
                const turmaTitle = card.querySelector('.turma-title').textContent.toLowerCase();
                // Mostra ou esconde o card baseado na pesquisa
                if (turmaTitle.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Alertas de Exemplo
    const pesquisaButton = document.querySelector('.main-header button');
    if (pesquisaButton) pesquisaButton.addEventListener('click', () => alert('Obrigado por participar da pesquisa! (Função de exemplo)'));

    const editalIcons = document.querySelectorAll('.editais-widget .editais-icons i');
    editalIcons.forEach(icon => icon.addEventListener('click', () => alert(`Ação de exemplo: "${icon.title}"`)));
});