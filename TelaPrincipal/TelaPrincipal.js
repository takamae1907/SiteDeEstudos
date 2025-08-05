document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO WIDGET DE LEMBRETES (AGORA DINÂMICO) ---
    const populateRemindersWidget = () => {
        const lembretesList = document.querySelector('.right-column .lembretes-widget ul');
        if (!lembretesList) return; // Não faz nada se o widget não existir na página

        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const sortedReminders = reminders.sort((a, b) => new Date(a.date) - new Date(b.date));

        lembretesList.innerHTML = ''; // Limpa a lista antiga

        if (sortedReminders.length === 0) {
            lembretesList.innerHTML = '<li>Nenhum lembrete cadastrado.</li>';
            return;
        }

        sortedReminders.forEach(reminder => {
            const li = document.createElement('li');
            // Formata a data para ex: "19 Ago"
            const formattedDate = new Date(reminder.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            li.innerHTML = `<strong>${reminder.text}</strong><span>${formattedDate}</span>`;
            lembretesList.appendChild(li);
        });
    };

    // Chama a função para popular os lembretes assim que a página carregar
    populateRemindersWidget();


    // --- MANUTENÇÃO DAS OUTRAS FUNCIONALIDADES DO DASHBOARD ---

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

    // Pesquisa de Turmas
    const searchInput = document.querySelector('.turmas-section input');
    const turmasCards = document.querySelectorAll('.turma-card');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            turmasCards.forEach(card => {
                const turmaTitle = card.querySelector('.turma-title').textContent.toLowerCase();
                card.style.display = turmaTitle.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }

    // Alertas de Exemplo (mantidos como estavam)
    const pesquisaButton = document.querySelector('.main-header button');
    if(pesquisaButton) pesquisaButton.addEventListener('click', () => alert('Obrigado por participar da pesquisa! (Função de exemplo)'));

    const editalIcons = document.querySelectorAll('.editais-widget .editais-icons i');
    editalIcons.forEach(icon => icon.addEventListener('click', () => alert(`Ação de exemplo: "${icon.title}"`)));
});