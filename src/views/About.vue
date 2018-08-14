<template>
  <div class="about">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="11">
        <div class="grid-content bg-purple">
          <chartLine :chart-data="chartData" :options="chartOptions"></chartLine>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="13" :xl="13">
        <div class="grid-content bg-purple-light">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>data</th>
                <th>networkId</th>
                <th>deviceTypeId</th>
                <th>isBlocked</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-title="id">{{device.id}}</td>
                <td data-title="name">{{device.name}}</td>
                <td data-title="data"><span v-for="(d,i) in device.data">{{d}}</span></td>
                <td data-title="networkId">{{device.networkId}}</td>
                <td data-title="deviceTypeId">{{device.deviceTypeId}}</td>
                <td data-title="isBlocked">{{device.isBlocked}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
     
    </el-row>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
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
  async mounted(){
    if(this.token.accessToken) await this.getDeviceIdfn()
    // await this.doRefreshToken()
    this.doWebSocket()
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
  },
  watch: {
    'token': {
      deep: true,
      handler (value) {
        if(value.accessToken) this.getDeviceIdfn()
      }
    }
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

tr:nth-child(even) {
    background-color: #dddddd;
}
.deviceTable{
  margin-top: 32px;
}
table, th, td {
  border: 1px solid #aaa;
  border-collapse: collapse;
  text-align: left;
  padding: 3px 5px;
}

table {
  width: 95%;
  margin: 1em auto;
}

th {
  background: #c4d3da;
}
tr:nth-child(even) {
  background: rgba(108, 255, 209, 0.2);
}

@media only screen and (max-width: 768px) {
  thead {
    display: none;
  }

  td {
    display: block;
    padding: 0.3rem 0.5rem;
  }

  td:before {
    content: attr(data-title);
    display: inline-block;
    width: auto;
    min-width: 20%;
    font-weight: 900;
    padding-right: 1rem;
  }
}

</style>