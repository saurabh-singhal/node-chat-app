var moment = require('moment');

var generateMessage = (from,text) =>{
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

var generateLocation = (from,longitude,latitude) =>{
  return{from,
  url:`https://www.google.com/maps?q=${latitude},${longitude}`,
  createdAt: moment().valueOf()
};
};

module.exports = {generateMessage,generateLocation};
