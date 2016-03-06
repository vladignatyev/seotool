class ResultProcessor {

}

function mapRowToPoint(row) {
  var [, keywords,,monthly_searches,competition,bid,] = row;

  try {
    monthly_searches = parseInt(monthly_searches);
    competition = parseFloat(competition.replace(',', '.')); // todo
    bid = parseFloat(bid.replace(',', '.')); // todo
  } catch (e) {
    return undefined;
  } finally {
    if (!keywords || !monthly_searches || !competition || !bid) return undefined;
  }

  return {
    'keywords': keywords,
    'monthly_searches': monthly_searches,
    'competition': competition,
    'bid': bid,
    'volume': bid * monthly_searches
  }
}

class FileParser {
  constructor () {
    this.points = [];
  }

  parse(file, completeHandler) {
    var points = this.points;
    Papa.parse(file, {
        error: function(err, file, inputElem, reason)
        {
          alert('error '+ reason);
        },
        step: function(results, parser)
        {
          var point = mapRowToPoint(results.data[0]);
          if (point) points.push(point);
        },
        complete: function() {
          completeHandler(points);
        }
    });
  }
}
