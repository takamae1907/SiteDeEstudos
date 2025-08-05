document.addEventListener('DOMContentLoaded', () => {
    console.log("Script cronograma.js iniciado.");

    // --- VERIFICAÇÃO DE ELEMENTOS ESSENCIAIS ---
    const elements = {
        monthYearDisplay: document.getElementById('month-year-display'),
        calendarBody: document.getElementById('calendar-body'),
        prevMonthBtn: document.getElementById('prev-month-btn'),
        nextMonthBtn: document.getElementById('next-month-btn'),
        reminderForm: document.getElementById('reminder-form'),
        selectedDateDisplay: document.getElementById('selected-date-display'),
        selectedDateInput: document.getElementById('selected-date-input'),
        reminderText: document.getElementById('reminder-text'),
        lembretesWidget: document.querySelector('#lembretes-widget-cronograma ul')
    };

    for (const key in elements) {
        if (!elements[key]) {
            const errorMessage = `ERRO CRÍTICO: O elemento '${key}' não foi encontrado no HTML. Verifique os IDs no arquivo cronograma.html.`;
            alert(errorMessage);
            console.error(errorMessage);
            return; // Para a execução do script
        }
    }
    console.log("Verificação de elementos: OK. Todos os elementos foram encontrados.");

    let currentDate = new Date();
    let selectedDayElement = null;
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

    const generateCalendar = (year, month) => {
        try {
            console.log(`Gerando calendário para: Mês ${month + 1}, Ano ${year}`);
            elements.calendarBody.innerHTML = '';

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            console.log(`Dias no mês: ${daysInMonth}, Primeiro dia da semana (0=Dom): ${firstDayOfMonth}`);

            const monthName = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long' });
            elements.monthYearDisplay.textContent = `${monthName} ${year}`;

            for (let i = 0; i < firstDayOfMonth; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.classList.add('empty');
                elements.calendarBody.appendChild(emptyCell);
            }
            console.log(`Adicionados ${firstDayOfMonth} dias vazios no início.`);

            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.textContent = day;
                const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                if (reminders.some(r => r.date === fullDate)) {
                    dayCell.classList.add('has-reminder');
                }

                dayCell.addEventListener('click', () => {
                    if (selectedDayElement) {
                        selectedDayElement.classList.remove('selected');
                    }
                    selectedDayElement = dayCell;
                    dayCell.classList.add('selected');
                    elements.selectedDateDisplay.textContent = new Date(year, month, day).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
                    elements.selectedDateInput.value = fullDate;
                });

                elements.calendarBody.appendChild(dayCell);
            }
            console.log(`Calendário gerado com sucesso com ${daysInMonth} dias.`);
        } catch (error) {
            console.error("ERRO DENTRO DE generateCalendar:", error);
            alert("Um erro inesperado ocorreu ao tentar desenhar o calendário.");
        }
    };
    const updateRemindersList = () => {
        elements.lembretesWidget.innerHTML = '';
        const selectedDate = elements.selectedDateInput.value;
        const filtered = reminders.filter(r => r.date === selectedDate);
        filtered.forEach(r => {
            const li = document.createElement('li');
            li.textContent = r.text;
            elements.lembretesWidget.appendChild(li);
        });
    };
    const reminderForm = elements.reminderForm;
    reminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = elements.selectedDateInput.value;
        const text = elements.reminderText.value.trim();
        if (!text) return;
        reminders.push({ date, text });
        localStorage.setItem('reminders', JSON.stringify(reminders));
        elements.reminderText.value = '';
        updateRemindersList();
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth()); // atualiza a marcação
    });

    const updateRemindersList = () => { /* ... (código de lembretes permanece o mesmo) ... */ };
    reminderForm.addEventListener('submit', (e) => { /* ... (código do form permanece o mesmo) ... */ });

    elements.prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    elements.nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    // Inicia a aplicação
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    // updateRemindersList(); // Removido para simplificar o debug inicial, pode adicionar depois
});