(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  // Register 'viewTasks' component to Mojito
  Mojito.components.viewTasks = function(selector, store) {
    return new Mojito(
      {
        template: function(data, attributes) {
          var html = '<div class="box" data-mojito-comp="todoForm"></div>';
          html +=
            '<div class="box" data-mojito-comp="todoList" data-mojito-id="todo"></div>';
          html +=
            '<div class="box" data-mojito-comp="todoList" data-mojito-id="done"></div>';
          return html;
        },

        data: {
          items: [
            {
              class: "todo",
              text: "Write documentation"
            },
            {
              class: "todo",
              text: "Create more examples"
            },
            {
              class: "done",
              text: "Create a super tiny framework"
            }
          ]
        },

        created: function(data, attributes, render, element) {
          // For new items by component 'todo-list.js'
          element.addEventListener("add", function(event) {
            data.items.push({
              text: event.detail.itemText,
              class: "todo"
            });
            window.sessionStorage.setItem("items", JSON.stringify(data.items));
            render();
          });

          // For items to be moved to "done" section by component "toto-list.js"
          element.addEventListener("done", function(event) {
            data.items[data.items.indexOf(event.detail.item)].class = "done";
            window.sessionStorage.setItem("items", JSON.stringify(data.items));
            render();
          });

          // For items to be deleted by component "todo-list.js"
          element.addEventListener("remove", function(event) {
            data.items.splice(data.items.indexOf(event.detail.item), 1);
            window.sessionStorage.setItem("items", JSON.stringify(data.items));
            render();
          });

          // Load items from session storage
          var storage = window.sessionStorage.getItem("items");
          if (storage) data.items = JSON.parse(storage);
        }
      },
      selector,
      store
    );
  };
})();
