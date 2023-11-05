import './env'
import './config/db'
import app from './app'
const PORT = process.env.APP_PORT || 3000
app.listen(PORT, () => {
  console.info('Server listening on port: ' + PORT)
})
