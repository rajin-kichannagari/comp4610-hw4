/*
  File: part1.js
  GUI Assignment: Part 1 – jQuery Validation
  Author: Rajin Kichannagari <Rajin_Kichannagari@student.uml.edu>
  Created: June 2025
  Handles validation and initial table generation only.
  Source: jQuery Validation plugin — https://jqueryvalidation.org/validate/
*/

$(document).ready(function () {
    // grab DOM elements
    const dynamicTable = $("#dynamicTable");
    const infoMsg      = $("#info");
    let colFromVal, colToVal, rowFromVal, rowToVal;

    // check that each input is a number in [-50,50]
    function checkValues() {
        colFromVal  = parseInt($("#colFrom").val(), 10);
        colToVal    = parseInt($("#colTo").val(),   10);
        rowFromVal  = parseInt($("#rowFrom").val(), 10);
        rowToVal    = parseInt($("#rowTo").val(),   10);

        if ([colFromVal, colToVal, rowFromVal, rowToVal]
            .some(v => isNaN(v) || v < -50 || v > 50)) {
          infoMsg.text("One or more values is not within range of -50 to 50");
          return false;
        }

        infoMsg.empty();
        return true;
    }

    // build and insert the multiplication table
    function generateTable() {
        if (!checkValues()) return;

        // swap if needed
        if (colFromVal > colToVal) [colFromVal, colToVal] = [colToVal, colFromVal];
        if (rowFromVal > rowToVal) [rowFromVal, rowToVal] = [rowToVal, rowFromVal];

        let html = `<table class="math-grid"><thead><tr><th></th>`;
        for (let c = colFromVal; c <= colToVal; c++) html += `<th>${c}</th>`;
        html += `</tr></thead><tbody>`;
        for (let r = rowFromVal; r <= rowToVal; r++) {
            html += `<tr><th class="row-header">${r}</th>`;
            for (let c = colFromVal; c <= colToVal; c++) {
                html += `<td title="${r}×${c}=${r*c}">${r*c}</td>`;
            }
            html += `</tr>`;
        }
        html += `</tbody></table>`;

        dynamicTable.html(html);
    }

    // apply validation rules & messages
    $("#generateForm").validate({
        rules: {
          colFrom: { required: true, min: -50, max: 50 },
          colTo:   { required: true, min: -50, max: 50 },
          rowFrom: { required: true, min: -50, max: 50 },
          rowTo:   { required: true, min: -50, max: 50 }
        },
        messages: {
          colFrom: { required: "Enter a number", min: "≥ -50", max: "≤ 50" },
          colTo:   { required: "Enter a number", min: "≥ -50", max: "≤ 50" },
          rowFrom: { required: "Enter a number", min: "≥ -50", max: "≤ 50" },
          rowTo:   { required: "Enter a number", min: "≥ -50", max: "≤ 50" }
        },
        submitHandler() {
          generateTable();
          return false; // prevent page reload
        }
    });

    // initial table on page load
    generateTable();
});
