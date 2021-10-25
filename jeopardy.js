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
        const res = await axios.get('http://jservice.io/api/random');
        //extract ID of category
        let catID = res.data[0].category_id;
        //test if ID already in array
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
    //Object clue
    const clue = {};
    //Object category
    const category = {};

    //Request all the clues for a category
    let i = 0;
    while(i < numberQuestions){
        //get request to API
        const res = await axios.get(`https://jservice.io/api/random`);
        //extract title
        let title = res.data;
        //extract question
        let question = res.data;
        //extract answer
        let answer = res.data;
        //test if question already in array
        let existingQuestion = clues.find((q) => q.question === question);
        //if question does not already exist in array, push the clue as an object
        if (existingQuestion === undefined){
            clue.question = question;
            clue.answer = answer;
            clues.push(clue);
            i++;
        }
    }

    //create the category object with title and clues to return 
    category.title = title;
    category.clues = clues;
    category.showing = null;
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

    //Add a table to the DOM with 'numberQuestions+1' rows
    $('#container').append('<table></table>');

    //Add header to the table
    $('table').append('<tr class="header"></tr>');
       for (i = 0; i < numberCat; i++){
            $('.header').append(`<th class="title">${categories[j].title}</th>`);
       }

    //Add rows/columns to the table
    for (i = 0; i < numberQuestions; i++){
        $('table').append(`<tr id = "${i}"></tr>`);
        for (j = 0; j < numberCat; j++){
            //Add ? to all the other cells
            $(`#row${i}`).append(`<td id = "${i}-${j}">?</td>`);
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
    const row = (evt.target).parentNode.className;
    const column = row - (evt.target).className;

    //identify category clue: row = category question# and column = category title
    const question = categories[column].clues[row].question;
    const answer = categories[column].clues[row].answer;
    const showing = categories[column].clues[row].showing;

    if (showing === null){
        categories[column].clues[row].showing = 'question';
        $('evt.target').val(question);
    }
    else if (showing === 'question'){
        categories[column].clues[row].showing = 'answer';
        $('evt.target').val(answer);
    }
    else if (showing === 'answer'){
        return;
    }
}


/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}


/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {

    //Get random categories IDs
    const categoriesID = await getCategoryIds();

    //Add each category with clues/title to the categories array
    for (let catID of categoriesID){
        let category = await getCategory(catID);
        //add to categorie array
        categories.push(category);
    };

    //create HTML table
    fillTable();
}


/** On click of start / restart button, set up game. */

// TODO


/** On page load, add event handler for clicking clues */

// TODO