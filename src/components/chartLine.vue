<script>
import { Line ,mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
export default {
  name: "chartLine",
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
