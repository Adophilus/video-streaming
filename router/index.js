module.exports = ({ app }) => {
  app.get('/', (req, res) => {
    res.render('index')
  })

  app.get('/broadcast', (req, res) => res.render('broadcast'))

  app.get('/watch', (req, res) => res.render('watch'))
}
