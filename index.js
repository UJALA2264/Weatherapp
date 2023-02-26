const http = require('http');
const fs = require("fs");
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempval, orgval) => {
    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
   temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
   temperature = temperature.replace("{%location%}", orgval.name);
   temperature = temperature.replace("{%country%}", orgval.sys.country);
   temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
    return temperature;
    //console.log(temperature);
   };

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=kanpur&appid=97540e01c43d4a7e77a94532ecae1e86'
        , )
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
               //console.log(arrData[0].name);
               const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
               //console.log(val.main[0].temp)
              res.write(realTimeData);
              //console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
               res.end();
            });
            }
});
server.listen(8000, '127.0.0.1');
