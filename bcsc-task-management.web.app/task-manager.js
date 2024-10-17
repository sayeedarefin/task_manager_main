// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyArIDzd27Wab7Rfjz_4VFSq4sAoThByxeQ",
    authDomain: "bcsc-task-management.firebaseapp.com",
    projectId: "bcsc-task-management",
    storageBucket: "bcsc-task-management.appspot.com",
    messagingSenderId: "397434642580",
    appId: "1:397434642580:web:d5450207dcfa502eff1481",
    measurementId: "G-VX1XK35QZ7"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Redirect to login if not authenticated
  auth.onAuthStateChanged(user => {
      if (!user) {
          // Redirect to index.html if the user is not logged in
          window.location.href = 'index.html';
      } else {
          // Load tasks
          loadTasks();
  
          // Show All Tasks by default
          document.getElementById('allTasks').classList.add('active');
          document.getElementById('myTasks').classList.remove('active');
  
          document.getElementById('toggleAllTasks').addEventListener('click', () => {
              document.getElementById('allTasks').classList.add('active');
              document.getElementById('myTasks').classList.remove('active');
              document.getElementById('toggleAllTasks').classList.add('active');
              document.getElementById('toggleMyTasks').classList.remove('active');
          });
  
          document.getElementById('toggleMyTasks').addEventListener('click', () => {
              document.getElementById('allTasks').classList.remove('active');
              document.getElementById('myTasks').classList.add('active');
              document.getElementById('toggleAllTasks').classList.remove('active');
              document.getElementById('toggleMyTasks').classList.add('active');
          });
      }
  });
  
  
  function formatTimestamp(timestamp) {
      if (timestamp instanceof firebase.firestore.Timestamp) {
          const date = timestamp.toDate();
          return date.toLocaleDateString();
      }
      return timestamp;
  }
  
  // Load tasks from Firestore
  function loadTasks() {
      db.collection('tasks').get().then(querySnapshot => {
          const allTasks = [];
          const userTasks = [];
          querySnapshot.forEach(doc => {
              const task = doc.data();
              task.id = doc.id; 
              const assignedToList = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo];
              allTasks.push(task);
              if (auth.currentUser && assignedToList.includes(auth.currentUser.email)) {
                  userTasks.push(task);
              }
          });
  
        
          renderTasks(allTasks, 'allTasksContainer');
          renderTasks(userTasks, 'myTasksContainer');
      }).catch(error => {
          console.error("Error fetching tasks: ", error);
      });
  }
  
  
  function renderTasks(tasks, containerId) {
      const container = document.getElementById(containerId);
      container.innerHTML = ''; 
      const selectedCategory = document.getElementById('categoryFilter').value;
  
      tasks
          .filter(task => selectedCategory === "All" || task.category === selectedCategory)
          .forEach(task => {
              const taskElement = document.createElement('div');
              taskElement.className = 'task progress-' + task.progress; 
              taskElement.innerHTML = `
                  <h3>${task.title}</h3>
                  <p><strong>Assigned to:</strong> ${task.assignedTo ? (Array.isArray(task.assignedTo) ? task.assignedTo.join(', ') : task.assignedTo) : 'No one assigned'}</p>
                  <p><strong>Description:</strong> ${task.description}</p>
                  ${task.photo ? `<img src="${task.photo}" alt="Task Photo" class="task-photo">` : ''}
                  <p><strong>Deadline:</strong> ${formatTimestamp(task.deadline)}</p>
                  <p class="progress"><strong>Progress:</strong> ${task.progress}</p>
                  ${auth.currentUser && (Array.isArray(task.assignedTo) ? task.assignedTo.includes(auth.currentUser.email) : task.assignedTo === auth.currentUser.email) ? `
                  <label for="progressSelect-${task.id}" class="progress-update-label">Update Progress:</label>
                  <select id="progressSelect-${task.id}" class="progress-select">
                      <option value="OnGoing" ${task.progress === "OnGoing" ? "selected" : ""}>On Going</option>
                      <option value="UpComing" ${task.progress === "UpComing" ? "selected" : ""}>Up Coming</option>
                      <option value="Stuck" ${task.progress === "Stuck" ? "selected" : ""}>Stuck</option>
                      <option value="Done" ${task.progress === "Done" ? "selected" : ""}>Done</option>
                  </select>
                  ` : ''}
              `;
              container.appendChild(taskElement);
  
              
              const progressSelect = document.getElementById(`progressSelect-${task.id}`);
              if (progressSelect) {
                  progressSelect.addEventListener('change', (event) => {
                      updateTaskProgress(task.id, event.target.value);
                  });
              }
          });
  }
  
  
  function updateTaskProgress(taskId, newProgress) {
      db.collection('tasks').doc(taskId).update({
          progress: newProgress
      }).then(() => {
          console.log("Task progress updated successfully");
          loadTasks(); 
      }).catch(error => {
          console.error("Error updating task progress: ", error);
      });
  }
  
  
  document.getElementById('categoryFilter').addEventListener('change', () => {
      loadTasks(); 
  });
  

