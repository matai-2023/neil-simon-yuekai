import * as Path from 'node:path'
import * as URL from 'node:url'
import express from 'express'
import hbs from 'express-handlebars'
import * as fsPromises from 'node:fs/promises'
import { error } from 'node:console'

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

// Your routes/router(s) should go here

server.get('/dishes/:id', async (req, res) => {
  const filePath = Path.join(__dirname, 'data', 'data.json')
  console.log(filePath)
  const data = await fsPromises.readFile(filePath, 'utf-8')
  const dishes = JSON.parse(data)
  const dish = dishes.dishes
  const id = Number(req.params.id)
  console.log(typeof id)
  const thisDish = dish.find((obj) => obj.id == id)
  res.render('dishes', thisDish)
})

server.post('/dishes', async (req, res) => {
  const filePath = Path.join(__dirname, 'data', 'data.json')
  console.log(filePath)
  const data = await fsPromises.readFile(filePath, 'utf-8')
  const dishes = JSON.parse(data)
  const dish = dishes.dishes
  let body = req.body
  //console.log(body)
  //console.log(dish)
  let newDish = []
  let twoSameIngredientDish = []
  let onlyDish
  // if (
  //   body.ingredient1 != null ||
  //   body.ingredient2 != null ||
  //   body.ingredient3 != null
  // ) {
  //   for (let i = 0; i < dish.length; i++) {
  //     for (const ingredient in dish[i]) {
  //       console.log(dish[i])
  //       if (
  //         dish[i][ingredient] == body.ingredient1 ||
  //         dish[i][ingredient] == body.ingredient2 ||
  //         dish[i][ingredient] == body.ingredient3
  //       ) {
  //         newDish.push(dish[i])
  //       }
  //     }
  //   }
  // }

  if (body.ingredient1 != null) {
    for (let i = 0; i < dish.length; i++) {
      for (const ingredient in dish[i]) {
        //console.log(dish[i][ingredient])
        if (dish[i][ingredient] == body.ingredient1) {
          newDish.push(dish[i])
        }
      }
    }
    //console.log(newDish)
  }

  if (body.ingredient2 != null) {
    for (let i = 0; i < newDish.length; i++) {
      for (const ingredient in newDish[i]) {
        //console.log(dish[i][ingredient])
        if (newDish[i][ingredient] == body.ingredient2) {
          twoSameIngredientDish.push(newDish[i])
        }
      }
    }
  }

  if (body.ingredient3 != null) {
    for (let i = 0; i < twoSameIngredientDish.length; i++) {
      for (const ingredient in twoSameIngredientDish[i]) {
        //console.log(dish[i][ingredient])
        if (twoSameIngredientDish[i][ingredient] == body.ingredient3) {
          onlyDish = twoSameIngredientDish[i]
        }
      }
    }
  }

  const oneInputDish = newDish[0]
  const twoInputDish = twoSameIngredientDish[0]
  //console.log(thisDish)
  //res.redirect('dishes/', thisDish)
  if (onlyDish != undefined) {
    res.redirect('/dishes/' + onlyDish.id)
  } else if (twoInputDish != undefined) {
    res.redirect('/dishes/' + twoInputDish.id)
  } else if (oneInputDish != undefined) {
    res.redirect('/dishes/' + oneInputDish.id)
  } else {
    //alert()
    res.render('home')
  }
})

// server.get('/dishes/:id', (req, res) => {
//   const id = Number(req.params.id)
//   console.log(typeof id)
//   const thisDish = dish.find((obj) => obj.id == id)
//   res.render('dishes', thisDish)
// })

server.get('/', (req, res) => {
  res.render('home')
})
export default server
