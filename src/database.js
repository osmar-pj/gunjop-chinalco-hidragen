import mongoose from 'mongoose'
import config from './config'

mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log('DB esta conectado'))
.catch(err => console.error(err))