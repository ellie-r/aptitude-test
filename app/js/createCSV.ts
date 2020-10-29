/**
 * Gets test data
 * converts the json into csv and returns out
 * @param {info} Object - object of user data
 * @param {userName} string  - name of user in database
 * @param {userPercentage} number -user percentage score on taken test
 */
function createCSV(info: any, userName: string, userPercentage: number, resultData) {
    console.log(info);

    let csv = 'Name,Score,%'

    //add each question to the titles of the csv
   for(let eachQuestion in info) {


        csv += `, ${eachQuestion}: ${info[eachQuestion].question}`

    }

    csv += '\n'

    //enter the username, score and percentage under the relevant heading
    csv += `${userName},${info.data.score},${userPercentage}`
   //add the question answer under the relevant heading in the csv
    for(let eachQuestion in info) {


        csv += `, ${eachQuestion}: ${info[eachQuestion].question}`

    }
    return csv
}

