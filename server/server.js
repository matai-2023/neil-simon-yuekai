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
server.get('/', (req, res) => {
  res.render('home')
})

server.get('/dishes/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(typeof id)
  const thisDish = dish.find((obj) => obj.id == id)
  res.render('dishes', thisDish)
})

export default server
