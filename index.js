const axios = require('axios');
const { scotrail_api_url } = require('./config')
const scotrail_api = axios.create({
    baseURL: scotrail_api_url
});
require('./db');
const mongoose = require('mongoose');
const Service = mongoose.model('Service');

const getDestinationData = (stationCode, destination) => (
    scotrail_api.get('/live/'+stationCode)
        .then(({data}) => {
            if (data.services.length > 0) {
                return data.services.filter((service) => service.destination===destination);
            } else {
                throw new Error("No data at this moment.");
            }
        })
        .catch(error => {
            throw error
        })
);

const filterServiceByStopAt = (allServices, stationName) =>(
    Promise.all(allServices).then((allServiceData) => {
        const fitleredResult =allServiceData.filter( (service) => {
            if(service.service.find( (stationInfo) => stationInfo.Station===stationName)){
                return service;
            }
        })
        return fitleredResult;
    }).catch(error => {
        throw error
    })
);

const getServiceByID = (service) => (
    scotrail_api.get('/service/'+service.id)
        .then(({data}) => {
            return {...service, service:data};
        })
        .catch(error => {
            throw error
        })
)

const saveService = (trains) => {
    trains.map( (train) => {
        const {id, platform, destination, departs, arrives, expected, origin, operator} =train;
        let traindata = new Service();
        traindata.id = id;
        traindata.platform = platform;
        traindata.destination = destination;
        traindata.departs = departs;
        traindata.arrives = arrives;
        traindata.expected = expected;
        traindata.origin = origin;
        traindata.operator = operator;
        traindata.save((err, doc) => {
            if (!err){
                console.log("save!");
                console.log(doc);
            }
            else {
                console.log('Error during record insertion : ' + err);
            }
        });
    });

}

getDestinationData('GLQ', 'Edinburgh')
    .then(stationData => {
        const allServices = stationData.map( (service) => getServiceByID(service));
        return filterServiceByStopAt(allServices, 'Bathgate');
    }).then(trains => {
        return saveService(trains);
    })


