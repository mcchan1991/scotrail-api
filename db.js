const mongoose = require('mongoose');
const { mongodbUrl } = require('./config')
mongoose.connect(mongodbUrl, { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

const serviceSchema = new mongoose.Schema({
    id: {
        type: String
    },
    platform: {
        type: String
    },
    destination: {
        type: String
    },
    departs: {
        type: String
    },
    arrives: {
        type: String
    },
    expected: {
        type: String
    },
    origin: {
        type: String
    },
    operator: {
        type: String
    }
});

mongoose.model('Service', serviceSchema);