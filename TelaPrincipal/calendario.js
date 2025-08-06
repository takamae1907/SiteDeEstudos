document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos Elementos do DOM ---
    const calendarGrid = document.getElementById('calendar-days-grid');
    const monthYearHeader = document.getElementById('month-year-header');
    const prevMonthBtn = document.getElementById('prev-month-button');
    const nextMonthBtn = document.getElementById('next-month-button');
    // Tarefas (To-Do)
    const todoTitle = document.getElementById('todo-title');
    const reminderList = document.getElementById('reminder-list');
    const addReminderForm = document.getElementById('add-reminder-form');
    const newReminderInput = document.getElementById('new-reminder-input');
    // Provas
    const addProvaForm = document.getElementById('add-prova-form');
    const provaNameInput = document.getElementById('prova-name-input');
    const provaDateInput = document.getElementById('prova-date-input');
    const provasList = document.getElementById('provas-list');

    // --- Estado da Aplicação ---
    let dateForCalendar = new Date();
    let selectedDate = new Date().toISOString().split('T')[0];
    let reminders = JSON.parse(localStorage.getItem('study_reminders_v2')) || [];
    let provas = JSON.parse(localStorage.getItem('study_provas')) || [];

    // --- Funções de Renderização ---
    const renderCalendar = () => {
        // ... (lógica do calendário)
        const year = dateForCalendar.getFullYear();
        const month = dateForCalendar.getMonth();
        calendarGrid.innerHTML = '';
        monthYearHeader.textContent = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGrid.innerHTML += '<div class="day-cell empty-day"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = day;
            dayCell.dataset.date = dateStr;
            
            if (dateStr === selectedDate) dayCell.classList.add('selected-day');
            // ADICIONADO: Lógica para marcar provas
            if (provas.some(p => p.date === dateStr)) dayCell.classList.add('has-prova');
            else if (reminders.some(r => r.date === dateStr && !r.completed)) dayCell.classList.add('has-reminder');
            
            calendarGrid.appendChild(dayCell);
        }
    };

    const renderReminders = () => { /* ... (código sem alterações) ... */ };
    
    // NOVA FUNÇÃO para renderizar a lista de provas
    const renderProvas = () => {
        provasList.innerHTML = '';
        if (provas.length === 0) {
            provasList.innerHTML = '<li>Nenhuma prova adicionada.</li>';
            return;
        }
        // Ordena as provas por data
        const sortedProvas = provas.sort((a, b) => new Date(a.date) - new Date(b.date));
        sortedProvas.forEach(prova => {
            const li = document.createElement('li');
            const formattedDate = new Date(prova.date + 'T00:00:00').toLocaleDateString('pt-BR', {dateStyle: 'long'});
            li.innerHTML = `<strong>${prova.name}</strong><span>Prova em: ${formattedDate}</span>`;
            provasList.appendChild(li);
        });
    };

    const saveData = () => {
        localStorage.setItem('study_reminders_v2', JSON.stringify(reminders));
        localStorage.setItem('study_provas', JSON.stringify(provas));
    };

    // --- Event Listeners ---
    // (Listeners antigos do calendário e tarefas permanecem)
    calendarGrid.addEventListener('click', (e) => {
        const dayCell = e.target.closest('.day-cell:not(.empty-day)');
        if (!dayCell) return;
        selectedDate = dayCell.dataset.date;
        renderCalendar();
        renderReminders();
    });

    // NOVO LISTENER para o formulário de provas
    addProvaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = provaNameInput.value.trim();
        const data = provaDateInput.value;
        if (nome && data) {
            provas.push({ id: Date.now(), name: nome, date: data });
            saveData();
            renderProvas(); // Atualiza a lista da direita
            renderCalendar(); // Atualiza o calendário com a nova marcação
            addProvaForm.reset();
            alert('Prova adicionada com sucesso!');
        }
    });

    // (Listeners restantes: prev/next, add tarefa, editar, excluir, etc.)

    // --- Inicialização ---
    const init = () => {
        renderCalendar();
        renderReminders();
        renderProvas(); // Renderiza a lista de provas ao carregar a página
    };

    init();
});