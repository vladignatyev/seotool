function app() {
  const V_WIDTH = 800;
  const V_HEIGHT = 600;
  const BUBBLE_SIZE = 100;
  const BUBBLE_ALPHA_FACTOR = 2.0;
  const _BUBBLE_ALPHA_FACTOR = 1.0 / BUBBLE_ALPHA_FACTOR;

  let colorFactory = new ColorFactory();
  let coordinateSystem;
  let svg;
  let rgb;

  $('.upload-file')
    .off('click')
    .on('click', () => {
      $('#file-input')
        .off('change')
        .on('change', fileSelectHandler)
        .click();
    });

  function fileSelectHandler(event) {
    (new FileParser()).parse(this.files[0], function(points){
      hideHelloView();
      showDataView();
      presentData(points);
    });
  };

  function hideHelloView() {
    $('.hello-view').hide();
  }

  function showDataView() {
    $('.graphics-view').show();
  }

  function presentData(points) {
    let props = new DataProperties(points);

    if (!coordinateSystem) {
      svg = d3.select('.graphics-view')
        .append('svg')
        .attr('width', V_WIDTH)
        .attr('height', V_HEIGHT)
        .attr('viewBox', `-${BUBBLE_SIZE} -${0.75* BUBBLE_SIZE} ${V_WIDTH * 1.25} ${V_HEIGHT * 1.25}`);

      coordinateSystem = new CoordinateSystem(svg, V_WIDTH, V_HEIGHT);
      coordinateSystem.draw();
      coordinateSystem.legend(props.minBid, props.maxBid, props.minCompetition, props.maxCompetition);
    }

    rgb = colorFactory.getNewColor();

    var circles = svg.selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', (d) => {
        return V_WIDTH * (d.competition - props.minCompetition) / (props.maxCompetition - props.minCompetition);
      })
      .attr('cy', (d) => {
        return V_HEIGHT - V_HEIGHT * (d.bid - props.minBid) / (props.maxBid - props.minBid);
      })
      .attr('r', (d) => {
        var a = Math.sqrt((d.volume - props.minVolume) / (props.maxVolume - props.minVolume));
        return (BUBBLE_SIZE * a + 1);
      })
      .attr('fill', (d) => {
        let a = BUBBLE_ALPHA_FACTOR * (d.volume - props.minVolume) / (props.maxVolume - props.minVolume);
        let alpha = (_BUBBLE_ALPHA_FACTOR / (a * a + 1.0)).toFixed(2);
        return `rgba(${rgb},${alpha})`;
      });
  }
}

$(document).ready(app);
