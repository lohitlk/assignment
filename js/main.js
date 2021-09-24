const form = document.querySelector("#item");
const itemInput = document.querySelector("#Input");
const itemList = document.querySelector("#List");
const messageDiv = document.querySelector("#alert");


let todoItems = [];

const showAlert = function (message, msgClass) {
    messageDiv.innerHTML = message;
    messageDiv.classList.add(msgClass, "show");
    messageDiv.classList.remove("hide");
    setTimeout(() => {
        messageDiv.classList.remove("show", msgClass);
        messageDiv.classList.add("hide");
    }, 2000);
    return;
};


const updateItem = function (itemIndex, newValue) {
    console.log(itemIndex);
    const newItem = todoItems[itemIndex];
    newItem.name = newValue;
    todoItems.splice(itemIndex, 1, newItem);
    setLocalStorage(todoItems);
};

// remove/delete item
const removeItem = function (item) {
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex, 1);
};


const handleItem = function (itemData) {
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item) => {
        if (
            item.querySelector(".title").getAttribute("data-time") == itemData.addedAt
        ) {

            item.querySelector("[data-edit]").addEventListener("click", function (e) {
                e.preventDefault();
                itemInput.value = itemData.name;
                document.querySelector("#citem").value = todoItems.indexOf(itemData);
                return todoItems;
            });

            //delete
            item
                .querySelector("[data-delete]")
                .addEventListener("click", function (e) {
                    e.preventDefault();
                    if (confirm("Are you sure want to delete?")) {
                        itemList.removeChild(item);
                        removeItem(item);
                        setLocalStorage(todoItems);
                        showAlert("Item has been deleted.");
                        return todoItems.filter((item) => item != itemData);
                    }
                });
        }
    });
};
// get list items
const getList = function (todoItems) {
    itemList.innerHTML = "";
    if (todoItems.length > 0) {
        todoItems.forEach((item) => {
            const iconClass = item.isDone
            itemList.insertAdjacentHTML(
                "beforeend",
                `<li class="list-group-item d-flex justify-content-between align-items-center">
          <span class="title" data-time="${item.addedAt}">${item.name}</span> 
          <span>
              
              <a href="#" data-edit style="padding:20px"><i class="bi bi-pencil-square blue"></i></a>
              <a href="#" data-delete style="padding:20px"><i class="bi bi-x-circle red"></i></a>
          </span>
        </li>`
            );
            handleItem(item);
        });
    } else {
        itemList.insertAdjacentHTML(
            "beforeend",
            `<li class="list-group-item d-flex justify-content-between align-items-center">
        No record found.
      </li>`
        );
    }
};

// get localstorage from the page
const getLocalStorage = function () {
    const todoStorage = localStorage.getItem("todoItems");
    if (todoStorage === "undefined" || todoStorage === null) {
        todoItems = [];
    } else {
        todoItems = JSON.parse(todoStorage);
        //console.log("items", todoItems);
    }
    getList(todoItems);
};
// set list in local storage
const setLocalStorage = function (todoItems) {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = itemInput.value.trim();
        if (itemName.length === 0) {
            showAlert("Please enter name.", "alert-danger");
            return;
        } else {
            // update existing Item
            const currenItemIndex = document.querySelector("#citem").value;
            if (currenItemIndex) {
                updateItem(currenItemIndex, itemName);
                document.querySelector("#citem").value = "";
                showAlert("Item has been updated.");
            } else {
                // Add new Item
                const itemObj = {
                    name: itemName,
                    isDone: false,
                    addedAt: new Date().getTime(),
                };
                todoItems.push(itemObj);
                // set local storage
                setLocalStorage(todoItems);
                showAlert("New item has been added.");
            }

            getList(todoItems);
            // get list of all items
        }
        console.log(todoItems);
        itemInput.value = "";
    });

    // load items
    getLocalStorage();
});