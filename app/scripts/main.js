const V_WIDTH = 800;
const V_HEIGHT = 600;
const BUBBLE_SIZE = 100;
const BUBBLE_ALPHA_FACTOR = 2.0;
const _BUBBLE_ALPHA_FACTOR = 1.0 / BUBBLE_ALPHA_FACTOR;

const BUBBLE_COLORS = ['#1a1334', '#26294a', '#01545a', '#017351','#03c383', '#aad962', '#fbbf45', '#ef6a32', '#ed0345', '#a12a5e', '#710162'];
let CURRENT_COLOR = 0;

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  let rgb = `${r},${g},${b}`;

  return rgb;
}

function getNewColor(){
  CURRENT_COLOR = CURRENT_COLOR % BUBBLE_COLORS.length;
  return hexToRgb(BUBBLE_COLORS[CURRENT_COLOR++]);
}

function app() {
  $('.upload-file').off('click').on('click', () => {
    $('#file-input')
      .off('change').on('change', fileSelectHandler)
      .click();
  });

  function fileSelectHandler(event) {
    (new FileParser()).parse(this.files[0], function(points){
      hideHelloView();
      setupGraphics();
      presentData(points);
    });
  };

  function hideHelloView() {
    $('.hello-view').hide();
  }

  function setupGraphics() {
    $('.graphics-view').show();

  }

  function _drawCS(svg) {
    var verticalAxis = svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', V_HEIGHT)
      .attr("stroke-width", 0.5)
      .attr("stroke", "#f00");

    var horizontalAxis = svg.append('line')
      .attr('x1', 0)
      .attr('y1', V_HEIGHT)
      .attr('x2', V_WIDTH)
      .attr('y2', V_HEIGHT)
      .attr("stroke-width", 0.5)
      .attr("stroke", "#f00");

    var centerOfCS = svg.append('circle')
      .attr('cx', 0)
      .attr('cy', V_HEIGHT)
      .attr('r', 1)
      .attr('fill', '#f00');
  }

  function _drawCSLegend(svg, minBid, maxBid, minCompetition, maxCompetition) {
    for (var i = 0; i <= V_HEIGHT; i += V_HEIGHT * 0.1) {
      svg.append('line')
        .attr('x1', -4)
        .attr('y1', i)
        .attr('x2', 0)
        .attr('y2', i)
        .attr("stroke-width", 0.5)
        .attr("stroke", "#f00");

      svg.append('text')
        .attr('x', -6)
        .attr('y', i + 2)
        .attr('font-family', 'monospace')
        .attr('text-anchor', 'end')
        .attr('font-size', '8px')
        .attr('fill','red')
        .text( '' + ((V_HEIGHT - i) / V_HEIGHT * (maxBid - minBid) + minBid).toFixed(2));
    }

    for (var i = 0; i <= V_WIDTH; i += V_WIDTH * 0.1) {
      svg.append('line')
        .attr('x1', i)
        .attr('y1', V_HEIGHT)
        .attr('x2', i)
        .attr('y2', V_HEIGHT + 4)
        .attr("stroke-width", 0.5)
        .attr("stroke", "#f00");

      svg.append('text')
        .attr('x', i)
        .attr('y', V_HEIGHT + 4 + 6)
        .attr('font-family', 'monospace')
        .attr('text-anchor', 'middle')
        .attr('font-size', '8px')
        .attr('fill','red')
        .text( '' + (i / V_WIDTH * (maxCompetition - minCompetition) + minCompetition).toFixed(2));
    }

    svg.append('text')
      .attr('x', 0)
      .attr('y', -16)
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill','red')
      .text(`Bid [${minBid.toFixed(1)};${maxBid.toFixed(1)}]`);

    svg.append('text')
      .attr('x', V_WIDTH / 2)
      .attr('y', V_HEIGHT + 26)
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill','red')
      .text(`Competition [${minCompetition.toFixed(1)};${maxCompetition.toFixed(1)}]`);
  }

  function presentData(points) {
    var sortedByCompetition = _.sortBy(points, (point) => point.competition);
    var sortedByVolume = _.sortBy(points, (point) => point.volume);
    var sortedByBid = _.sortBy(points, (point) => point.bid);

    var [minCompetition, maxCompetition] = [_.first(sortedByCompetition).competition, _.last(sortedByCompetition).competition];
    var [minVolume, maxVolume] = [_.first(sortedByVolume).volume, _.last(sortedByVolume).volume];
    var [minBid, maxBid] = [_.first(sortedByBid).bid, _.last(sortedByBid).bid];

    var svg = d3.select('.graphics-view')
      .append('svg')
      .attr('width', V_WIDTH)
      .attr('height', V_HEIGHT)
      .attr('viewBox', `-${BUBBLE_SIZE} -${0.75* BUBBLE_SIZE} ${V_WIDTH * 1.25} ${V_HEIGHT * 1.25}`);

    _drawCS(svg);
    _drawCSLegend(svg, minBid, maxBid, minCompetition, maxCompetition);

    let rgb = getNewColor();

    var circles = svg.selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', (d) => {
        return V_WIDTH * (d.competition - minCompetition) / (maxCompetition - minCompetition);
      })
      .attr('cy', (d) => {
        return V_HEIGHT - V_HEIGHT * (d.bid - minBid) / (maxBid - minBid);
      })
      .attr('r', (d) => {
        var a = Math.sqrt((d.volume - minVolume) / (maxVolume - minVolume));
        return (BUBBLE_SIZE * a + 1);
      })
      .attr('fill', (d) => {
        let a = BUBBLE_ALPHA_FACTOR * (d.volume - minVolume) / (maxVolume - minVolume);
        let alpha = (_BUBBLE_ALPHA_FACTOR / (a * a + 1.0)).toFixed(2);

        let fillString = `rgba(${rgb},${alpha})`;
        console.log(fillString);
        return fillString;
      });
  }
}

$(document).ready(app);
