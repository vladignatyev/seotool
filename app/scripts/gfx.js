class Viewport {
  constructor(svg, left, top, right, bottom) {
    this.svg = svg;
    [this.initialLeft, this.initialTop, this.initialRight, this.initialBottom] = [left, top, right, bottom];
  }

  update(left, top, right, bottom) {
    this.svg.attr('viewBox', `${left} ${top} ${right} ${bottom}`);
  }
}


class CoordinateSystem {
  constructor(svg, plot_width, plot_height) {
    this.svg = svg;

    this.plot_width = plot_width;
    this.plot_height = plot_height;
  }

  draw() {
    let svg = this.svg;
    var verticalAxis = svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', this.plot_height)
      .attr("stroke-width", 0.5)
      .attr("stroke", "#f00");

    var horizontalAxis = svg.append('line')
      .attr('x1', 0)
      .attr('y1', this.plot_height)
      .attr('x2', this.plot_width)
      .attr('y2', this.plot_height)
      .attr("stroke-width", 0.5)
      .attr("stroke", "#f00");

    var centerOfCS = svg.append('circle')
      .attr('cx', 0)
      .attr('cy', this.plot_height)
      .attr('r', 1)
      .attr('fill', '#f00');
  }

  legend(minBid, maxBid, minCompetition, maxCompetition) {
    let svg = this.svg;
    for (var i = 0; i <= this.plot_height; i += this.plot_height * 0.1) {
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
        .text(((this.plot_height - i) / this.plot_height * (maxBid - minBid) + minBid).toFixed(2));
    }

    for (var i = 0; i <= this.plot_width; i += this.plot_width * 0.1) {
      svg.append('line')
        .attr('x1', i)
        .attr('y1', this.plot_height)
        .attr('x2', i)
        .attr('y2', this.plot_height + 4)
        .attr("stroke-width", 0.5)
        .attr("stroke", "#f00");

      svg.append('text')
        .attr('x', i)
        .attr('y', this.plot_height + 4 + 6)
        .attr('font-family', 'monospace')
        .attr('text-anchor', 'middle')
        .attr('font-size', '8px')
        .attr('fill','red')
        .text( '' + (i / this.plot_width * (maxCompetition - minCompetition) + minCompetition).toFixed(2));
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
      .attr('x', this.plot_width / 2)
      .attr('y', this.plot_height + 26)
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill','red')
      .text(`Competition [${minCompetition.toFixed(1)};${maxCompetition.toFixed(1)}]`);
  }
}
