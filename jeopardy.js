 
/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable() {

    //Remove existing table if any
    $('table').remove();

    //Add a table to the DOM with 'numberQuestions+1' rows
    $('#container').append('<table></table>');

    //Add header to the table
    $('table').append('<tr class="header"></tr>');
       for (let i = 0; i < numberCat; i++){
            $('.header').append(`<th class="title">${categories[i].title}</th>`);
       }

    //Add rows/columns to the table
    for (let i = 0; i < numberQuestions; i++){
        $('table').append(`<tr id = "${i}"></tr>`);
        for (let j = 0; j < numberCat; j++){
            //Add ? to all the other cells
            $(`#${i}`).append(`<td class = "clue" column = "${j}">?</td>`);
        }
    }
}


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {

    //get location of cell clicked on the grid
    let row = +(evt.target).parentNode.id; //+ converts to int
    let column = +(evt.target).getAttribute('column');

    //identify category clue: row = category question# and column = category title
    let question = categories[column].clues[row].question;
    let answer = categories[column].clues[row].answer;
    let showing = categories[column].clues[row].showing;

    if (showing === null){
        categories[column].clues[row].showing = 'question';
        $(evt.target).html(question).addClass('question');
    }
    else if (showing === 'question'){
        categories[column].clues[row].showing = 'answer';
        $(evt.target).html(answer).removeClass('question').addClass('answer');
    }
    else if (showing === 'answer') {
        return;
    }
}


/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    //wipe the current Jeopardy board
    $('table').remove();
    //show loading spinner (div with class 'loader') to the container instead of the board
    $('#container').append('<div class="loader"></div>');

    //Disable button and show loading text
    $('button').prop('disabled', true);
    $('button').text('Loading...');
}


/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    //Remove loading spinner
    $('.loader').remove();

    //Enable button and show fetch text
    $('button').prop('disabled', false);
    $('button').text('Play Game!');
}


/** On click of start / restart button, set up game. */
$('button').on('click', setupAndStart);


/** On page load, add event handler for clicking clues */
//Add event listener to clues *(chikld on contaiber) only when they are created.
$('#container').on('click','.clue', handleClick);
