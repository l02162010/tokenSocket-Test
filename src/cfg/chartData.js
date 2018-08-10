export const planetChartData = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { // one line graph
          label: 'temperature (°C)',
          data: [],
          backgroundColor: [
            'rgba(54,73,93,.5)', // Blue
          ],
          borderColor: [
            '#36495d',
          ],
          borderWidth: 3
        },
        { // another line graph
          label: 'humidity (%RH)',
          data: [],
          backgroundColor: [
            'rgba(71, 183,132,.5)', // Green
          ],
          borderColor: [
            '#47b784',
          ],
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: false,
      lineTension: 1,
      animation : false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            padding: 25,
          }
        }]
      }
    }
  }
  
  export default planetChartData;