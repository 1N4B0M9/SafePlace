const axios = require('axios');

const options = {
    method: 'GET',
    url: 'http://localhost:8080/authorized',
    headers: {
        authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ii01b0h4WFoyMWl4WDdaRHhtRjNfTiJ9.eyJpc3MiOiJodHRwczovL2Rldi03Z2NreWduZHc3MHZ3czFpLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJzeU9TeEJXRFczdDJUWHRoUzIwNTlRQ3dBc1BSOGlUekBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9zdGVlbGhhY2tzL2FwaSIsImlhdCI6MTcyNzU1MDIyMCwiZXhwIjoxNzI3NjM2NjIwLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJzeU9TeEJXRFczdDJUWHRoUzIwNTlRQ3dBc1BSOGlUeiJ9.ZlACh7O0YhIGNS5IdNSFrxhOfCg33zX5KfwHHgZ7k5R6VPTsBHXrUBJy3SeJ8mT_W41cKfyLvX2lEMR7ngI9RCv_Wri5CwLzJGPZVgdkP27myongc-lsIIqEVx1aUyVzJoFXyzWxw5bmsP14McqOP_04kbjPqSVuf04rsg6AVD4htkLkjulKVXiRz2At1ABkckId8qr7xrdLg5nwve_sxI2i3frDheOl-T75aEe-x3Q5nWtd_fVV2nali79XfthiPNXAUkQ5lKfrzapzXEhVJ6oFqHWrvqbaNY5phe8H330ZUH4oJNziYFBuM92L5r98XyWkHve8gNrWKJKq2Tw8eA'  //maybe add quotes to authorization
    }
};

// Make the request
axios.request(options).then(function (response) {
    console.log('Response:', response.data);
}).catch(function (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
});