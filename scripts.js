document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskList = document.getElementById('taskList').querySelector('ul');
  
    addTaskBtn.addEventListener('click', () => {
      const title = taskTitleInput.value.trim();
      const description = taskDescriptionInput.value.trim();
  
      if (title && description) {
        const li = document.createElement('li');
        li.classList.add('task');
  
        li.innerHTML = `
          <div class="task-info">
            <h3>${title}</h3>
            <p>${description}</p>
          </div>
          <div class="task-actions">
            <button class="completeBtn">Terminer</button>
            <button class="deleteBtn">Supprimer</button>
          </div>
        `;
  
        // Marquer comme terminée
        const completeBtn = li.querySelector('.completeBtn');
        completeBtn.addEventListener('click', () => {
          li.classList.toggle('completed');
        });
  
        // Supprimer la tâche
        const deleteBtn = li.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', () => {
          li.remove();
        });
  
        // Ajouter la tâche à la liste
        taskList.appendChild(li);
  
        // Effacer les champs
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
      } else {
        alert('Veuillez remplir tous les champs !');
      }
    });
  });
// Sauvegarder les tâches dans LocalStorage
function saveTasks() {
    const tasks = [];
    const taskElements = taskList.querySelectorAll('li');
    
    taskElements.forEach((task) => {
      const taskData = {
        title: task.querySelector('h3').textContent,
        description: task.querySelector('p').textContent,
        completed: task.classList.contains('completed'),
      };
      tasks.push(taskData);
    });
  
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Charger les tâches depuis LocalStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskData => {
      const li = document.createElement('li');
      li.classList.add('task');
      if (taskData.completed) li.classList.add('completed');
  
      li.innerHTML = `
        <div class="task-info">
          <h3>${taskData.title}</h3>
          <p>${taskData.description}</p>
        </div>
        <div class="task-actions">
          <button class="completeBtn">Terminer</button>
          <button class="deleteBtn">Supprimer</button>
        </div>
      `;
  
      const completeBtn = li.querySelector('.completeBtn');
      completeBtn.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
      });
  
      const deleteBtn = li.querySelector('.deleteBtn');
      deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
      });
  
      taskList.appendChild(li);
    });
  }
  
  // Charger les tâches au démarrage
  loadTasks();
  addTaskBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
  
    if (title && description) {
      fetch('add_task.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          loadTasks(); // Recharger les tâches après ajout
          taskTitleInput.value = '';
          taskDescriptionInput.value = '';
        } else {
          alert(data.message);
        }
      });
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  });
  function loadTasks() {
    fetch('get_tasks.php')
      .then(response => response.json())
      .then(tasks => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.classList.add('task');
          if (task.completed) li.classList.add('completed');
  
          li.innerHTML = `
            <div class="task-info">
              <h3>${task.title}</h3>
              <p>${task.description}</p>
            </div>
            <div class="task-actions">
              <button class="completeBtn" data-id="${task.id}" data-completed="${task.completed}">
                ${task.completed ? 'Annuler' : 'Terminer'}
              </button>
              <button class="deleteBtn" data-id="${task.id}">Supprimer</button>
            </div>
          `;
  
          li.querySelector('.completeBtn').addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const completed = e.target.getAttribute('data-completed') === '0' ? 1 : 0;
            fetch('update_task.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `id=${id}&completed=${completed}`
            }).then(() => loadTasks());
          });
  
          li.querySelector('.deleteBtn').addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            fetch('delete_task.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `id=${id}`
            }).then(() => loadTasks());
          });
  
          taskList.appendChild(li);
        });
      });
  }
  
  // Charger les tâches au démarrage
  loadTasks();
  let currentPage = 1;
  const tasksPerPage = 5;
  
  function loadTasks(page = 1) {
    currentPage = page;
    fetch(`get_tasks.php?page=${page}&limit=${tasksPerPage}`)
      .then(response => response.json())
      .then(data => {
        taskList.innerHTML = '';
        data.tasks.forEach(task => {
          const li = document.createElement('li');
          li.classList.add('task');
          if (task.completed) li.classList.add('completed');
  
          li.innerHTML = `
            <div class="task-info">
              <h3>${task.title}</h3>
              <p>${task.description}</p>
            </div>
            <div class="task-actions">
              <button class="completeBtn" data-id="${task.id}" data-completed="${task.completed}">
                ${task.completed ? 'Annuler' : 'Terminer'}
              </button>
              <button class="deleteBtn" data-id="${task.id}">Supprimer</button>
            </div>
          `;
  
          li.querySelector('.completeBtn').addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const completed = e.target.getAttribute('data-completed') === '0' ? 1 : 0;
            fetch('update_task.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `id=${id}&completed=${completed}`
            }).then(() => loadTasks(currentPage));
          });
  
          li.querySelector('.deleteBtn').addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            fetch('delete_task.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `id=${id}`
            }).then(() => loadTasks(currentPage));
          });
  
          taskList.appendChild(li);
        });
  
        // Pagination
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        for (let i = 1; i <= data.pages; i++) {
          const button = document.createElement('button');
          button.textContent = i;
          button.disabled = i === currentPage;
          button.addEventListener('click', () => loadTasks(i));
          pagination.appendChild(button);
        }
      });
  }
      