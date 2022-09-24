const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const newspapers = [ 
    {
        name:  'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk'
    }
]

const app = express()

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            }) 
        })
    })
})

const articles = []

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperid', async(req, res) => {
   const newspaperid = req.params.newspaperid
   const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperid)[0].address
   
    const newspaperBase = newspapers .filter(newspaper => newspaper.name == newspaperid)[0].base

   axios.get(newspaperAddress)
   .then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    const specificArticles = []

    $('a:contains("climate")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        specificArticles.push({
            title,
            url:newspaperBase + url,
            source: newspaperid
        })
    })
    res.json(specificArticles)
   }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log('server running on PORT ${PORT}'))