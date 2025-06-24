/*
  File: dynamic_table.js
  GUI Assignment: Using the jQuery Plugin/UI with Your Dynamic Table
  Author: Rajin Kichannagari <Rajin_Kichannagari@student.uml.edu>
  Created: June 2025
  Script for interactive multiplication grid: validation, sliders, table generation, and tab management
  Sources:
    • jQuery Validation plugin — https://jqueryvalidation.org/validate/
    • jQuery UI Slider & Tabs — https://jqueryui.com/slider/  &  https://jqueryui.com/tabs/
*/

$(document).ready(function () {
  console.log('Initializing multiplication table application…');

  // DOM references
  var dynamicTable = document.getElementById("dynamicTable");
  var infoMsg      = document.getElementById("info");
  var colFrom      = document.getElementById("colFrom");
  var colTo        = document.getElementById("colTo");
  var rowFrom      = document.getElementById("rowFrom");
  var rowTo        = document.getElementById("rowTo");
  var colFromVal, colToVal, rowFromVal, rowToVal;

  // jQuery UI tabs setup
  var tabs     = $("#savedTables").tabs();
  var ul       = tabs.find("ul");
  var tabCount = 0;
  var savedTables = [];

  // hide tabs until first save
  tabs.hide();
  $(".tab-controls").hide();

  // ── Helpers ──────────────────────────────────────────────

  // updateTabSelect: refreshes the <select> listing saved tabs
  function updateTabSelect() {
      var select = $("#tabSelect");
      select.empty();

      if (savedTables.length === 0) {
          select.append('<option value="">No tabs available</option>');
          $("#deleteSelectedTab, #deleteMultipleTabs, #resetAllTabs")
            .prop('disabled', true);
          $("#tabInfo").text("No saved tables yet.");
      } else {
          select.append('<option value="">Select a tab...</option>');
          savedTables.forEach(function(table, index) {
              select.append(
                '<option value="' + index + '">' + table.label + '</option>'
              );
          });
          $("#deleteSelectedTab, #deleteMultipleTabs, #resetAllTabs")
            .prop('disabled', false);
          $("#tabInfo").text("Total saved tables: " + savedTables.length);
      }
  }

  // checkValues: ensure inputs are numbers within [-50,50]
  function checkValues() {
      colFromVal = parseInt(colFrom.value, 10);
      colToVal   = parseInt(colTo.value,   10);
      rowFromVal = parseInt(rowFrom.value, 10);
      rowToVal   = parseInt(rowTo.value,   10);

      if ([colFromVal, colToVal, rowFromVal, rowToVal]
          .some(v => isNaN(v) || v < -50 || v > 50)) {
          infoMsg.textContent = 
            "One or more values is not within range of -50 to 50";
          return false;
      }
      infoMsg.textContent = "";
      return true;
  }

  // generateTable: builds the grid from the four input values
  function generateTable() {
      var temp;
      if (!checkValues()) return false;

      // swap if user inverted from/to
      if (colFromVal > colToVal) {
          temp = colFromVal; colFromVal = colToVal; colToVal = temp;
          infoMsg.textContent = "Swapping starting and ending column value.";
          colFrom.value = colFromVal; colTo.value = colToVal;
          $("#colFromSlider, #colToSlider").slider("value", colFromVal);
      }

      if (rowFromVal > rowToVal) {
          temp = rowFromVal; rowFromVal = rowToVal; rowToVal = temp;
          infoMsg.textContent += " Swapping starting and ending row value.";
          rowFrom.value = rowFromVal; rowTo.value = rowToVal;
          $("#rowFromSlider, #rowToSlider").slider("value", rowFromVal);
      }

      // render table markup
      dynamicTable.innerHTML = 
        '<table class="math-grid">' +
          '<thead><tr id="columns"><th></th></tr></thead>' +
          '<tbody id="rows"></tbody>' +
        '</table>';

      var $cols = $("#columns"),
          $rows = $("#rows");

      // column headers
      for (let i = colFromVal; i <= colToVal; i++) {
          $cols.append(`<th>${i}</th>`);
      }
      // each row
      for (let i = rowFromVal; i <= rowToVal; i++) {
          let row = `<tr><th class="row-header">${i}</th>`;
          for (let j = colFromVal; j <= colToVal; j++) {
              row += `<td title="${i} × ${j} = ${i*j}">${i*j}</td>`;
          }
          row += `</tr>`;
          $rows.append(row);
      }
      return true;
  }

  // initial render
  generateTable();

  // ── Validation & Save Handler ────────────────────────────

  $("#generateForm").validate({
      rules: {
          colFrom: { required: true, min: -50, max: 50 },
          colTo:   { required: true, min: -50, max: 50 },
          rowFrom: { required: true, min: -50, max: 50 },
          rowTo:   { required: true, min: -50, max: 50 }
      },
      messages: {
          colFrom: { required: "Please enter a valid number.", min: "Must be between -50 and 50.", max: "Must be between -50 and 50." },
          colTo:   { required: "Please enter a valid number.", min: "Must be between -50 and 50.", max: "Must be between -50 and 50." },
          rowFrom: { required: "Please enter a valid number.", min: "Must be between -50 and 50.", max: "Must be between -50 and 50." },
          rowTo:   { required: "Please enter a valid number.", min: "Must be between -50 and 50.", max: "Must be between -50 and 50." }
      },
      errorPlacement(error, element) {
          // place error right after the slider for clarity
          error.insertAfter(element.siblings('.slider'));
      },
      submitHandler(form) {
          if (generateTable()) {
              // reveal tabs & controls now that we have a saved table
              tabs.show();
              $(".tab-controls").show();

              // save metadata
              var label = `${colFromVal} – ${colToVal} x ${rowFromVal} – ${rowToVal}`,
                  id    = `tab${tabCount}`;

              savedTables.push({
                id, label, colFrom: colFromVal,
                colTo: colToVal, rowFrom: rowFromVal,
                rowTo: rowToVal
              });

              // add new tab & content
              $("<li><a href='#"+id+"'>"+label+"</a></li>").appendTo(ul);
              $(`<div id='${id}'></div>`).appendTo(tabs);

              $("#dynamicTable").clone().appendTo("#"+id);
              tabs.tabs("refresh").tabs("option","active",tabCount);

              tabCount++;
              updateTabSelect();
              console.log('New table saved:', label);
          }
          return false; // prevent normal form submission
      }
  });

  // ── Tab Deletion Handlers ────────────────────────────────

  /* deleteSelectedTab: remove one saved tab */
  $("#deleteSelectedTab").click(function() {
      var i = +$("#tabSelect").val();
      if (!isNaN(i) && i >= 0) {
          var t = savedTables[i];
          $("#"+t.id).remove();
          $(`a[href="#${t.id}"]`).closest("li").remove();
          savedTables.splice(i, 1);
          tabs.tabs("refresh");
          if (!savedTables.length) { tabs.hide(); $(".tab-controls").hide(); }
          updateTabSelect();
          console.log('Deleted tab:', t.label);
      }
  });

  /* deleteMultipleTabs: show dialog with checkboxes */
  $("#deleteMultipleTabs").click(function() {
      if (!savedTables.length) return;
      var dialog = $('<div title="Delete Multiple Tables"> ... </div>')
        .dialog({ /* ...buttons to delete ...*/ });
  });

  /* resetAllTabs: confirm and wipe all */
  $("#resetAllTabs").click(function() {
      if (savedTables.length &&
          confirm(`Delete all ${savedTables.length} saved tables?`)) {
          savedTables.forEach(t => $("#"+t.id).remove());
          $("#savedTables ul").empty();
          savedTables = [];
          tabs.tabs("refresh").hide();
          $(".tab-controls").hide();
          updateTabSelect();
          console.log('All tabs deleted');
      }
  });

  // ── Slider ↔ Input Binding ────────────────────────────────
  var sliderOpts = { min: -50, max: 50, step: 1 };

  // helper to init each pair
  function bindSlider(inputId, sliderId) {
    $(`#${sliderId}`).slider($.extend({}, sliderOpts, {
      value: +$(`#${inputId}`).val(),
      slide(_, ui) {
        $(`#${inputId}`).val(ui.value);
        generateTable();
      }
    }));
    // update slider from manual input
    $(`#${inputId}`).on("input", function() {
      var v = parseInt(this.value, 10);
      if (!isNaN(v) && v >= -50 && v <= 50) {
        $(`#${sliderId}`).slider("value", v);
        generateTable();
      }
    });
  }

  bindSlider("colFrom",    "colFromSlider");
  bindSlider("colTo",      "colToSlider");
  bindSlider("rowFrom",    "rowFromSlider");
  bindSlider("rowTo",      "rowToSlider");

  // final refresh of the <select>
  updateTabSelect();

  console.log('Application initialized successfully');
});
