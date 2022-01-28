const inquirer = require('inquirer')
const fs = require('fs')
//exported modules
const Engineer = require('./lib/Engineer')
const Intern = require('./lib/Intern')
const Manager = require('./lib/Manager')
//auto completed html
const generateHTML = require('./util/generateHtml')
//forms team array
const teamArr = []

//questions to generate manager
const newManager = () => {
    return inquirer.prompt([
        {
            type: 'input',
            message: "Please enter your manager's name?",
            name: 'name',
            validate: nameInput => {
                if (nameInput) {
                    return true
                } else {
                    return 'Please enter the name of your manager!'
                }
            }
        },
        {
            type: 'input',
            message: "Please enter the manager's ID number.",
            name: 'id',
            validate: nameInput => {
                if (isNaN(nameInput)) {
                    return 'Please enter a valid ID number!'
                } else {
                    return true
                }
            }
        },
        {
            type: 'input',
            message: "Please enter the manager's email.",
            name: 'email',
            validate: email => {
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                if (valid) {
                    return true
                } else {
                    return 'Please enter a valid email!'
                }
            }
        },
        {
            type: 'input',
            message: "Please enter the manager's office number.",
            name: 'officeNumber',
            validate: nameInput => {
                if (isNaN(nameInput)) {
                    return ('Please enter a valid office number!')
                } else {
                    return true
                }
            }
        }
    ])
    .then((managerInput) => {
        //when a manager is input a new manager is created
        const { name, id, email, officeNumber } = managerInput
        const manager = new Manager (name, id, email, officeNumber)
        //pushes team manager to team array
        teamArr.push(manager)
        console.log(manager)
    })
}

//questions to generate employee
const newEmployee = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Please choose the role of your employee.',
            choices: ['Engineer', 'Intern']
        },
        {
            type: 'input',
            name: 'name',
            message: "What is your employee's name?",
            validate: nameInput => {
                if (nameInput) {
                    return true
                } else {
                    return 'Please enter the name of your employee.'
                }
            }
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the ID number of your employee.",
            validate: nameInput => {
                if (isNaN(nameInput)) {
                    return 'Please enter a valid ID number!'
                } else {
                    return true
                }
            }
        },
                {
            type: 'input',
            message: "Please enter the employee's email.",
            name: 'email',
            validate: email => {
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                if (valid) {
                    return true
                } else {
                    return 'Please enter a valid email!'
                }
            }
        },
        {
            type: 'input',
            name: 'github',
            message: 'Please enter the GitHub username of your employee',
            when: (input) => input.role === 'Engineer',
            validate: nameInput => {
                if (nameInput) {
                    return true
                } else {
                    return 'please enter a valid GitHub username!'
                }
            }
        },
        {
            type: 'input',
            name: 'school',
            message: 'Please enter the school your intern attended',
            when: (input) => input.role === 'Intern',
            validate: nameInput => {
                if (nameInput) {
                    return true
                } else {
                    return 'Please enter a valid school name!'
                }
            }
        },
        {
            type: 'confirm',
            name: 'addEmployee',
            message: 'Would you like to add another team member?',
            default: true
        }
    ])
    .then(employeeData => {
        let { name, id, email, role, github, school, addEmployee, } = employeeData
        let employee
        
        //if employee is engineer creates new engineer
        if (role === 'Engineer') {
            employee = new Engineer (name, id, email, github)
            console.log(employee)
        //if employee is intern creates new intern
        } else if (role === 'Intern') {
            employee = new Intern (name, id, email, school)
            console.log(employee)
        }

        //pushes employee to team array
        teamArr.push(employee)

        //if new employee is true then create new employee
        if (addEmployee) {
            //create new employee
            return newEmployee(teamArr)
        } else {
            return teamArr
        }
    })
}

//function to write html contents
const writeFile = data => {
    fs.writeFile('./employees/index.html', data, err => {
        if (err) {
            throw err
        } else {
            console.log('Successfully generated team profile!')
        }
    })
}

newManager()
    .then(newEmployee)
    .then(teamArr => {
        return generateHTML(teamArr)
    })
    .then(pageHTML => {
        return writeFile(pageHTML)
    })
    .catch(err => {
        throw err
    })