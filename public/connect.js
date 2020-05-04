// establish server connection
var socket = io.connect('http://localhost:8000')
// console.log("in connect.js")

var chart = document.getElementById("chart")

// listen for incoming data
socket.on('new_data', function(data)    {
    console.log("recieved:" ,data)

    Plotly.extendTraces('chart', {
        z: data
      }, [0])
})

Plotly.newPlot('chart', [{
    z: [],
    type: "chart"
}])