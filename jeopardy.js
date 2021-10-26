 // categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
 
 //Number of categories per game and questions per categorie
 const numberCat = 6;
 const numberQuestions = 5;


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {

    //Array to staore categories IDs
    const categoriesID = [];

    //Look up for 'numberCat' number of different categories
    let i = 0;
    while(i < numberCat){
        //send request to API
        const res = await axios.get('https://jservice.io/api/random');
        //extract ID of category
         let catID = res.data[0].category_id;
         //test if ID already in array - could also use a set instead
        let existingID = categoriesID.find((id) => id === catID);
         //if catID does not already exist in array, push it
         if (existingID === undefined){
             categoriesID.push(catID);
            i++;
        }
    }
    return categoriesID;
}


/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {

    //Array of object clues (numberQuestions) for a given category
    const clues=[];
    
    //Object category
    const category = {};
    //Category Title
    let title = '';
    //new set for random numbers
    const numbers = new Set();

    //Request all the clues for a category
    //get request to API
    const res = await axios.get(`https://jservice.io/api/clues?category=${catId}`);

    //length of data returned (clues)
    const lengthData = res.data.length;
    
    while (numbers.size < 5){ 
        //Generate unique random numbers within data range
        let randomNumber = Math.floor(Math.random() * lengthData);
        //added to the set if unique
        numbers.add(randomNumber);
    }
        
    //Extract clues data using the set of random numbers to pick random clues in category
    for (let n of numbers){
         //extract title of category
        title = res.data[n].category.title;
        //Object clue
        const clue = {};
        //extract question
        let question = res.data[n].question;
        //extract answer
        let answer = res.data[n].answer;
        //Assign values to clue
        clue.question = question;
        clue.answer = answer;
        clue.showing = null;
        //push clue to clues array
        clues.push(clue);
    }      

    //create the category object with title and clues to return 
    category.title = title;
    category.clues = clues;
    return category;
}


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


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {

    try{
        //Loading view while waiting for requests to proceed
        showLoadingView();

        //reset categories array
        categories = [];

        //Get random categories IDs
        const categoriesID = await getCategoryIds();

        //Add each category with clues/title to the categories array
        for (let catID of categoriesID){
            let category = await getCategory(catID);
            //add to categorie array
            categories.push(category);
        };
    } catch(e){
        alert = ("Something went wrong...try agaion later!");
        return;
    }

    //hide loading view after requests completed
    hideLoadingView();

    //create HTML table
    fillTable();
}


/** On click of start / restart button, set up game. */
$('button').on('click', setupAndStart);


/** On page load, add event handler for clicking clues */
//Add event listener to clues *(chikld on contaiber) only when they are created.
$('#container').on('click','.clue', handleClick);
