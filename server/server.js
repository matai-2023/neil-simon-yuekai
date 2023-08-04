import * as Path from 'node:path'
import * as URL from 'node:url'
import express from 'express'
import hbs from 'express-handlebars'
import * as fsPromises from 'node:fs/promises'

const __filename = URL.fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

const server = express()

// Server configuration
const publicFolder = Path.resolve('public')
server.use(express.static(publicFolder))
server.use(express.urlencoded({ extended: false }))

// Handlebars configuration
server.engine('hbs', hbs.engine({ extname: 'hbs' }))
server.set('view engine', 'hbs')
server.set('views', Path.resolve('server/views'))

//get data file
const filePath = Path.join(__dirname, 'data', 'data.json')
console.log(filePath)
const data = await fsPromises.readFile(filePath, 'utf-8')
const dishes = JSON.parse(data)
const dish = dishes.dishes

// Your routes/router(s) should go here

server.post('/', (req, res) => {
  let body = req.body
  console.log(body)
  console.log(dish)
  let newDish = []
  if (body.ingredient1 != null) {
    newDish = dish.filter((element) => element.ingredient1 == body.ingredient1)
  }
  // if (body.ingredient2 != null) {
  //   newDish = dish.filter((element) => element.ingredient2 == body.ingredient2)
  // }
  // if (body.ingredient3 != null) {
  //   newDish = dish.filter((element) => element.ingredient3 == body.ingredient3)
  // }
  const thisDish = newDish[0]
  console.log(thisDish)
  //res.redirect('dishes/', thisDish)
  res.redirect('/dishes/' + thisDish.id)
})

server.get('/dishes/:id', (req, res) => {
  const id = Number(req.params.id)

  const thisDish = dish.find((obj) => obj.id == id)

  res.render('dishes', thisDish)
})

server.get('/', (req, res) => {
  res.render('home')
})

export default server
