const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ilkkatikorhonen:${password}@koulucluster.g184ppw.mongodb.net/phonebook?retryWrites=true&w=majority&appName=KouluCluster`;

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', noteSchema)

if (process.argv.length == 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        result.forEach(p => {
            console.log(p.name, ' ', p.number)
        })
    })
}