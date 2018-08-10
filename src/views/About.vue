<template>
  <div class="about">
    <el-row>
      <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
        <chartLine :chart-data="chartData" :options="chartOptions" :width="600" :height="400"></chartLine>
      </el-col>
      <el-col :xs="13" :sm="13" :md="13" :lg="13" :xl="13">
        <table class="deviceTable">
          <tr>
            <th>id</th>
            <th>name</th>
            <th>data</th>
            <th>networkId</th>
            <th>deviceTypeId</th>
            <th>isBlocked</th>
          </tr>
          <tr>
            <td>{{device.id}}</td>
            <td>{{device.name}}</td>
            <td>
              <div v-for="(d,i) in device.data">{{d}}</div>
            </td>
            <td>{{device.networkId}}</td>
            <td>{{device.deviceTypeId}}</td>
            <td>{{device.isBlocked}}</td>
          </tr>
        </table>
      </el-col>
      
    </el-row>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
// import Chart from 'chart.js';
import planetChartData from '../cfg/chartData.js'
import chartLine from '../components/chartLine.vue'

export default {
  components: {
     chartLine
  },
  data(){
    return{
      device:{
        id:"",
        name: "",
        data: null,
        networkId: 0,
        deviceTypeId: 0,
        isBlocked: false
      },
      temperatureData:{},
      humidityData:{},
      chartData: planetChartData.data,
      chartOptions: planetChartData.options,
    }
  },
  computed: {
    ...mapGetters([
      'token',
    ])
  },
  async mounted(){
    await this.getDeviceIdfn()
    await this.doRefreshToken()
    await this.doWebSocket()
  },
  methods:{
    ...mapActions([
      'getDeviceId',
      'refreshToken',
    ]),
    ...mapMutations([
      'updateToken'
    ]),
    async getDeviceIdfn() {
      let res = await this.getDeviceId()      
      if(res){
        this.device = res.data
      }
    },
    async doRefreshToken(){
      let data = {
        refreshToken : this.token.refreshToken
      }
      let res = await this.refreshToken(data)
      if(res){
        this.updateToken(res.data);
      }
    },
    doWebSocket(){       
      const connection = new window.WebSocket('ws://test.comismart.com/api/websocket');
      
      connection.addEventListener('open', ()=> {
        let data = {
            "action": "authenticate",
            "token": this.token.accessToken
        }
        connection.send(JSON.stringify(data));
        data = {
          "action" : "notification/subscribe",
          "deviceId" : "e50d6085-2aba-48e9-b1c3-73c673e414be",
          "names" : ["measurement"]
        }
        connection.send(JSON.stringify(data));
      });

      connection.addEventListener('message', (data)=> {
        if(data){
          let d = JSON.parse(data.data)
          let temperatureData, humidityData
          if(d.notification){
            
            temperatureData = d.notification.parameters.temperature
            humidityData = d.notification.parameters.humidity
            this.chartData.datasets[0].data.push(temperatureData.value)
            this.chartData.datasets[1].data.push(humidityData.value)
            this.$set(this.chartData,this.chartData.datasets[0].data)
            this.$set(this.chartData,this.chartData.datasets[1].data)
            if(d.notification.timestamp){
              this.chartData.labels.push(d.notification.timestamp)
              this.$set(this.chartData,this.chartData.labels)
            }        
          }
        }
      });
      
      connection.addEventListener('close', function close() {
        console.log('disconnected');
      });
    }
  }
}
</script>
<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #dddddd;
}
.deviceTable{
  margin-top: 32px;
}
</style>