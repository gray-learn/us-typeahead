$(document).ready(function () {
  const $input = $("#state-input");
  const $list = $("#state-list");
  let selectedIndex = -1;

  $input.on("input", function () {
    const query = $(this).val().trim();
    if (query.length === 0) {
      $list.empty().hide();
      return;
    }

    $.ajax({
      url: "http://localhost:3000/states",
      data: { q: query },
      success: function (states) {
        $list.empty();
        if (states.length > 0) {
          states.forEach(function (state) {
            $("<li>").text(state).appendTo($list);
          });
          $list.show();
          selectedIndex = -1;
        } else {
          $list.hide();
        }
      },
    });
  });

  $list.on("click", "li", function () {
    $input.val($(this).text());
    $list.hide();
  });

  $input.on("keydown", function (e) {
    const $items = $list.find("li");

    if (e.keyCode === 40) {
      // Down arrow
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % $items.length;
      updateSelectedItem($items);
    } else if (e.keyCode === 38) {
      // Up arrow
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + $items.length) % $items.length;
      updateSelectedItem($items);
    } else if (e.keyCode === 13) {
      // Enter
      e.preventDefault();
      if (selectedIndex !== -1) {
        $input.val($items.eq(selectedIndex).text());
        $list.hide();
      }
    }
  });

  function updateSelectedItem($items) {
    $items.removeClass("selected");
    $items.eq(selectedIndex).addClass("selected");
  }

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".typeahead-container").length) {
      $list.hide();
    }
  });
});
