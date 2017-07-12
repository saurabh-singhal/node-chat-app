var generateMessage = (from,text) =>{
  return {
    from,
    text,
    createdAt: new Date().getTime()
  };
};

var generateLocation = (from,longitude,latitude) =>{
  return{from,
  url:`https://www.google.com/maps?q=${latitude},${longitude}`,
  createdAt: new Date().getTime()
};
};

module.exports = {generateMessage,generateLocation};
