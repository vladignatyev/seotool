
function app() {
  var plotProperties = new PlotProperties();


  var serieFactory = new SerieFactory(plotProperties);
  var coordinateSystem;
  var svg;
  var props;

  var selectionsTable = $('.selections-list').DataTable({
    paging: false,
    searching: false,
    ordering: true
  });


  $('.upload-file').on('click', () => {
    $('#file-input').click();
  });

  $('.clear-selection').click(function(){
      for (var serie of serieFactory.series) {
        serie.clearSelection();
      }
      selectionsTable.rows().remove().draw();
  });

  $('#file-input').on('change', function(){
    try {
      (new FileParser()).parse(this.files[0], function(points){
        hideHelloView();
        showDataView();
        presentData(points);
      });
    } catch (e) {

    }
  });

  function hideHelloView() {
    // $('.hello-view').hide();
  }

  function showDataView() {
    $('.graphics-view').show();
  }

  function selectionHandler(d3el, point, serie, identifier) {
    // d3.select
    // if (!point) {
    //   for (var serie in serieFactory.series) {
    //     serie.clearSelection();
    //   }
    //   $('.selections-list').remove();
    //   return;
    // }

    if (!point) {
      return;
    }

    selectionsTable.row.add([
      `<a target="_blank" href="https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#newwindow=1&safe=strict&q=${point.keywords}"><b>${point.keywords}</b></a>`,
      `${point.competition}`,
      `${point.bid}`,
      `${point.monthly_searches}`
    ]).draw(true);

    // $(`<tr data-point="#${identifier}" style="background-color: rgb(${serie.color});">`
    //  + `<td><a target="_blank" href="https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#newwindow=1&safe=strict&q=${point.keywords}"><b>${point.keywords}</b></a></td><td>${point.competition}</td><td>${point.bid}</td>`
    //  + `<td>${point.monthly_searches}</td></tr>`).appendTo($('.selections-list tbody'));
    //
    //  selectionsTable.draw();
  }

  function presentData(points) {
    props = props ||  new DataProperties(points);

    if (!coordinateSystem) {
      svg = d3.select('.graphics-view')
        .append('svg')
        .attr('width', plotProperties.V_WIDTH)
        .attr('height', plotProperties.V_HEIGHT)
        .attr('viewBox', `-${plotProperties.BUBBLE_SIZE} -${0.75* plotProperties.BUBBLE_SIZE} ${plotProperties.V_WIDTH * 1.25} ${plotProperties.V_HEIGHT * 1.25}`);

      coordinateSystem = new CoordinateSystem(svg, plotProperties.V_WIDTH, plotProperties.V_HEIGHT);
      coordinateSystem.draw();
      coordinateSystem.legend(props.minBid, props.maxBid, props.minCompetition, props.maxCompetition);
    }

    let serie = serieFactory.createSerie(points, props, selectionHandler);
    serie.render(svg);
  }
}

$(document).ready(app);
