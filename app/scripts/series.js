
class Serie {
  constructor(identifier, plotProperties, color, data, dataProperties, selectionHandler){
    this.identifier = identifier;
    this.color = color;
    this.points = data;
    this.group = undefined;
    this.dataProperties = dataProperties;
    this.plotProperties = plotProperties;
    this.selectionHandler = selectionHandler;
  }

  handleSelection(d3el, dataPoint) {
    var serie = this;
    this.selectionHandler(d3el, dataPoint, serie, d3.select(d3el).attr('id'));
  }

  clearSelection() {
    this.group.selectAll('circle').classed('selected', false).attr("pointer-events", "visiblePainted");
    this.selectionHandler(undefined, undefined);
  }

  render(svg){
    this.group = svg.append('g');
    var color = this.color;

    var handleSelection = this.handleSelection;
    var self = this;

    var circles = this.group.selectAll('circle')
      .data(_.reverse(_.sortBy(this.points, 'volume')))
      .enter()
      .append('g')
      .append('circle')
      .on('mousedown', function(){
        d3.select(this).classed('selected', true);
        d3.select(this).attr("pointer-events", "none");
        handleSelection.apply(self, [this, d3.select(this).data()[0]]);
      })
      .attr('cx', (d) => {
        return this.plotProperties.V_WIDTH * (d.competition - this.dataProperties.minCompetition) / (this.dataProperties.maxCompetition - this.dataProperties.minCompetition);
      })
      .attr('cy', (d) => {
        return this.plotProperties.V_HEIGHT - this.plotProperties.V_HEIGHT * (d.bid - this.dataProperties.minBid) / (this.dataProperties.maxBid - this.dataProperties.minBid);
      })
      .attr('r', (d) => {
        var a = Math.sqrt((d.volume - this.dataProperties.minVolume) / (this.dataProperties.maxVolume - this.dataProperties.minVolume));
        return (this.plotProperties.BUBBLE_SIZE * a + 1);
      })
      .attr('fill', (d) => {
        let a = this.plotProperties.BUBBLE_ALPHA_FACTOR * (d.volume - this.dataProperties.minVolume) / (this.dataProperties.maxVolume - this.dataProperties.minVolume);
        let alpha = (this.plotProperties._BUBBLE_ALPHA_FACTOR / (a * a + 1.0)).toFixed(2);
        return `rgba(${color},${alpha})`;
      })
      .attr('id', (d, i) => {
        return `point-${self.identifier}-${i}`;
      });
  }
}

class SerieFactory {
  constructor(plotProperties){
    this.plotProperties = plotProperties;
    this.colorFactory = new ColorFactory();
    this.series = [];
  }

  createSerie(points, dataProperties, selectionHandler){
    var serie = new Serie(`serie-${this.series.length}`,
      this.plotProperties,
      this.colorFactory.getNewColor(),
      points,
      dataProperties,
      selectionHandler
    );
    this.series.push(serie);
    return serie;
  }
}
