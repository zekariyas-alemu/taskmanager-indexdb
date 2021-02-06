// Define UI Variables
const taskInput = document.querySelector("#task"); //the task input text field
const form = document.querySelector("#task-form"); //The form at the top
const filter = document.querySelector("#filter"); //the task filter text field
const taskList = document.querySelector(".collection"); //The UL
const clearBtn = document.querySelector(".clear-tasks"); //the all task clear button

const reloadIcon = document.querySelector(".fa"); //the reload button at the top navigation

// Index DB create

//DB var
let DB;

// Add Event Listener [on Load]
document.addEventListener("DOMContentLoaded", () => {
  //all code will reside here
  let TasksDB = indexedDB.open("tasks", 1);

  TasksDB.onsuccess = function (event) {
    //code here
    console.log("database create successfully");
    DB = TasksDB.result;
    displayTaskList();
  };
  TasksDB.onerror = function (event) {
    // code here
    console.log("Error occurred");
  };

  // This method runs once (great for creating the schema)
  TasksDB.onupgradeneeded = function (e) {
    // the event will be the database
    let db = e.target.result;

    // create an object store,
    // keypath is going to be the Indexes
    let objectStore = db.createObjectStore("tasks", {
      keyPath: "id",
      autoIncrement: true,
    });

    // createindex: 1) field name 2) keypath 3) options
    objectStore.createIndex("taskname", "taskname", { unique: false });

    console.log("Database ready and fields created!");
  };

  form.addEventListener("submit", addNewTask);
  function addNewTask(e) {
    e.preventDefault(); //the rest of code
    // Add to DB
    let newTask = { taskname: taskInput.value };

    let transaction = DB.transaction(["tasks"], "readwrite");
    let objectStore = transaction.objectStore("tasks");
    let request = objectStore.add(newTask);
    request.onsuccess = () => {
      form.reset();
    };
    transaction.oncomplete = () => {
      console.log("New appointment added");
      displayTaskList();
    };
    transaction.onerror = () => {
      console.log("There was an error, try again!");
    };
  }

  function displayTaskList() {
    // clear the previous task list
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }

    // create the object store
    let objectStore = DB.transaction("tasks").objectStore("tasks");

    objectStore.openCursor().onsuccess = function (e) {
      // assign the current cursor
      let cursor = e.target.result;

      if (cursor) {
        // Create an li element when the user adds a task
        const li = document.createElement("li");
        const span = document.createElement("span");
        //add Attribute for delete
        li.setAttribute("data-task-id", cursor.value.id);
        // Adding a class
        li.className = "collection-item";
        span.style.marginLeft ="80em"
        // Create text node and append it
        span.appendChild(document.createTextNode(new Date().toLocaleDateString()))
        li.appendChild(document.createTextNode(cursor.value.taskname));
        li.appendChild(span);
        // Create new element for the link
        const link = document.createElement("a");
        // Add class and the x marker for a
        link.className = "delete-item secondary-content";
        link.innerHTML = `
            <i class="fa fa-remove"></i>
           &nbsp;
           <a href="edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
           `;
        // Append link to li
        li.appendChild(link);
        // Append to UL
        taskList.appendChild(li);
        cursor.continue();
      }
    };
  }

  // Remove task event [event delegation]
  taskList.addEventListener("click", removeTask);

  function removeTask(e) {
    if (e.target.parentElement.classList.contains("delete-item")) {
      if (confirm("Are You Sure about that ?")) {
        // get the task id
        let taskID = Number(
          e.target.parentElement.parentElement.getAttribute("data-task-id")
        );
        // use a transaction
        let transaction = DB.transaction(["tasks"], "readwrite");
        let objectStore = transaction.objectStore("tasks");
        objectStore.delete(taskID);

        transaction.oncomplete = () => {
          e.target.parentElement.parentElement.remove();
        };
      }
    }
  }

  //clear button event listener
  clearBtn.addEventListener("click", clearAllTasks);

  //clear tasks
  function clearAllTasks() {
    let transaction = DB.transaction("tasks", "readwrite");
    let tasks = transaction.objectStore("tasks");
    // clear the table.
    tasks.clear();
    displayTaskList();
    console.log("Tasks Cleared !!!");
  }
});
Mike Soft, [06.02.21 07:56]
function sortTasksDesc(e){
        let container = taskList;
        container.innerHTML = "";
        let objectStore = DB.transaction("tasks").objectStore("tasks");
        var allRecords = objectStore.getAll();
        allRecords.onsuccess = function() {
            const taskNames = allRecords.result.map((allRecord) => ({
                taskname : allRecord.taskname,
                taskDate :  allRecord.taskdate,
            }));
            taskNames.sort(function(a,b){
                let aa = a.taskDate;
                let bb = b.taskDate;
                return aa > bb ? -1 : (aa < bb ? 1 : 0);
            }).forEach((li, index) => {
                list = document.createElement("li");
                list.setAttribute("data-task-id", index + 1);
                list.className = "collection-item";
                list.appendChild(document.createTextNode(li.taskname));
                const link = document.createElement("a");
                link.className = "delete-item secondary-content";
                link.innerHTML = `
                    <span style="margin-right:800px">${li.taskDate.toLocaleDateString()}</span>
                    <i class="fa fa-remove"></i>
                    &nbsp;
                    <a href="./edit.html?id=${index + 1}"><i class="fa fa-edit"></i> </a>
                    `;
                list.appendChild(link); 
                container.appendChild(list);
            });
            //.forEach(li => container.appendChild(li));
        };
    }
function sortTasksAsc(e){
        let container = taskList;
        container.innerHTML = "";
        let objectStore = DB.transaction("tasks").objectStore("tasks");
        var allRecords = objectStore.getAll();
        allRecords.onsuccess = function() {
            const taskNames = allRecords.result.map((allRecord) => ({
                taskname : allRecord.taskname,
                taskDate :  allRecord.taskdate,
            }));
            taskNames.sort(function(a,b){
                let aa = a.taskDate;
                let bb = b.taskDate;
                return aa < bb ? -1 : (aa > bb ? 1 : 0);
            }).forEach((li, index) => {
                list = document.createElement("li");
                list.setAttribute("data-task-id", index + 1);
                list.className = "collection-item";
                list.appendChild(document.createTextNode(li.taskname));
                const link = document.createElement("a");
                link.className = "delete-item secondary-content";
                link.innerHTML = `
                    <span style="margin-right:800px">${li.taskDate.toLocaleDateString()}</span>
                    <i class="fa fa-remove"></i>
                    &nbsp;
                    <a href="./edit.html?id=${index + 1}"><i class="fa fa-edit"></i> </a>
                    `;
                list.appendChild(link); 
                container.appendChild(list);
            });
        };
    }