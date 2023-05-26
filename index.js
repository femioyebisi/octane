import fs from "fs"
import csv from "csv-parser"

const file = "input-file.csv"
const result = "output.txt"

const employees = []

fs.createReadStream(file).pipe(csv()).on("data", (data) => {
    employees.push(data)
}).on('end', () => {
    const similarities = findSimilarities(employees)
    generateOutput(similarities, result)
    console.log(similarities)
})


const findSimilarities = (employees) => {
    const similarities = []

    for (let i = 0; i < employees.length; i++){
        const employeeOne = employees[i]

        for(let j = i + 1; j < employees.length; j++){
            const employeeTwo = employees[j]

            const commonAttributes = []
            for(const key in employeeOne){
                if(employeeOne[key] === employeeTwo[key]){
                    commonAttributes.push(key)
                }
            }
                if(commonAttributes.length > 0){
                    similarities.push({
                        employeeOne: employeeOne["First Name"],
                        employeeTwo: employeeTwo["First Name"],
                        attributes: commonAttributes
                    })
                }
        }
    }

    return similarities
    
}

function generateOutput(similarities, outputFile){
    let outputText = ""

    similarities.forEach(similarity => {
        const { employeeOne, employeeTwo, employeeOneLastName, attributes } = similarity
        outputText += `${employeeOne} and ${employeeTwo}  have the following similarities: \n`
        attributes.forEach((attribute) => {
            outputText += `- ${attribute}\n`
        })

        outputText += "\n"
    })

    fs.writeFileSync(outputFile, outputText)
}
