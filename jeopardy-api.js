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

//Base URL for API Reaquests
const base_URL = 'https://jservice.io/api'

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {

    //Array to staore categories IDs
    const categoriesID = [];

    //Look up for 'numberCat' number of different categories
    let i = 0;
    while (i < numberCat) {

        const res = await axios.get(`${base_URL}/random`);
  
        let catID = res.data[0].category_id;

        //test if ID already in array - could also use a set instead
        let existingID = categoriesID.find((id) => id === catID);
        //if catID does not already exist in array, push it
        if (existingID === undefined) {
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
    const clues = [];

    //Object category
    const category = {};
    //Category Title
    let title = '';
    //new set for random numbers
    const numbers = new Set();

    //Request all the clues for a category
 
    const res = await axios.get(`${base_URL}/clues?category=${catId}`);

    const lengthData = res.data.length;

    while (numbers.size < 5) {
        //Generate unique random numbers within data range
        let randomNumber = Math.floor(Math.random() * lengthData);
        numbers.add(randomNumber);
    }

    //Extract clues data using the set of random numbers to pick random clues in category
    for (let n of numbers) {
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

