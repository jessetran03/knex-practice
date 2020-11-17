require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function searchByItemName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

searchByItemName('wings')

function paginateItems(pageNumber) {
  const itemsPerPage = 6
  const offset = itemsPerPage * (pageNumber - 1)
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

paginateItems(2)

function getItemsAfterDate(daysAgo) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log(result)
    })
}

getItemsAfterDate(3)

function getCategoriesTotalCost() {
  knexInstance
    .select('category')
    .sum('price AS total_cost')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log(result)
    })
}

getCategoriesTotalCost()