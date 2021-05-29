const exphbs = require('express-handlebars')
const express = require('express')
const restaurants = require('./restaurant.json')
const app = express()
const port = 3000
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


// static files
app.use(express.static('public'))

// routes settings
app.get('/', (req, res) => {
  if (!app.locals.partials) {
    app.locals.partials = {};
  }
  // this will disable search template
  app.locals.partials.isOnSearched = false
  app.locals.partials.restaurantList = restaurants.results;
  res.render(`index`, { style: 'main.css' })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurants.results.find(item => item.id.toString() === req.params.restaurant_id)
  res.render(`show`, { restaurant, style: 'show.css' })
})

app.get('/search', (req, res) => {
  if (!app.locals.partials) {
    app.locals.partials = {};
  }
  // this will trigger search template to show search related information on page
  app.locals.partials.isOnSearched = true
  const keyword = req.query.keyword.trim().toLowerCase()
  // show search information - remind user enter something and return function, no view action done
  if (!keyword.length) {
    app.locals.partials.isSearchInputValid = false
    res.render(`index`, { style: 'main.css' })
    return
  }
  const filteredRestaurants = restaurants.results.filter(restaurant => {
    // search by name and category, non case sensitive
    return restaurant.name.trim().toLowerCase().includes(keyword) || restaurant.category.trim().toLowerCase().includes(keyword)
  })
  // show search information - number of search resutls, view action - rendering filtered restaurants
  app.locals.partials.isSearchInputValid = true
  app.locals.partials.restaurantList = filteredRestaurants;
  app.locals.partials.numberOfListedRestaurants = filteredRestaurants.length;
  res.render(`index`, { keyword: req.query.keyword, style: 'main.css' })
})

app.listen(port, () => {
  console.log(`app.js running on the https:\\localhost:${port}`)
})