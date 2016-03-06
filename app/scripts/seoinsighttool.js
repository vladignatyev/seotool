class DataProperties {
  constructor(points) {
    let sortedByCompetition = _.sortBy(points, (point) => point.competition);
    let sortedByVolume = _.sortBy(points, (point) => point.volume);
    let sortedByBid = _.sortBy(points, (point) => point.bid);

    [this.minCompetition, this.maxCompetition] = [_.first(sortedByCompetition).competition, _.last(sortedByCompetition).competition];
    [this.minVolume, this.maxVolume] = [_.first(sortedByVolume).volume, _.last(sortedByVolume).volume];
    [this.minBid, this.maxBid] = [_.first(sortedByBid).bid, _.last(sortedByBid).bid];
  }
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
          if (point) points.push(point); //todo use streaming
        },
        complete: function() {
          completeHandler(points);
        }
    });
  }
}
