(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  // Register 'comp' component to Mojito
  Mojito.components.todoList = function(selector, store) {
    return new Mojito(
      {
        template: function(data, attributes) {
          var html = "";
          if (data.class === "todo")
            html +=
              "<h2>" +
              store.translations.tasks[store.currentLanguage] +
              "</h2>";
          if (data.class === "done")
            html +=
              "<h2>" + store.translations.done[store.currentLanguage] + "</h2>";
          html += "<ul>";
          for (var index = 0; index < data.items.length; index++) {
            html += "<li>";
            html += data.items[index].text;
            html += "<button data-button-index='" + index + "'>";
            html += data.class === "todo" ? "✔" : "❌";
            html += "️</button>";
            html += "</li>";
          }
          html += "</ul>";
          return html;
        },

        data: {
          items: [],
          class: null
        },

        created: function(data, attributes, render, element) {
          var buttonHandler = function(event) {
            var itemIndex = event.target.dataset.buttonIndex;
            if (!itemIndex) return;
            element.dispatchEvent(
              new CustomEvent(data.class === "todo" ? "done" : "remove", {
                bubbles: true,
                detail: {
                  item: data.items[itemIndex]
                }
              })
            );
          };

          element.addEventListener("click", buttonHandler);

          data.class = attributes.mojitoId;
          data.items = data._parent.items.filter(function(item) {
            return item.class === attributes.mojitoId;
          });
          render();
        }
      },
      selector,
      store
    );
  };
})();
