
var cities;

class City {
  var population;
  var dead;
  var infected;
  
  var spread_to;      // Factor applied when I spread to other cities
  var spread_from;    // Factor applied when other cities spread to me
  var spread_within;  // Factor applied when festering
  
  var production;
  var next_to;
}

void city_init ()
{
  var connx = [[0,1],[1,2]];
  var pop =   [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
  var prod =  [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
  
  cities = new List(15);
  
  for (var c = 0; c < 15; c++) {
    cities[c] = new City();

    cities[c].population = pop[c];
    cities[c].dead = 0;
    cities[c].infected = 0;
    
    cities[c].spread_to = 1.0;
    cities[c].spread_from = 1.0;
    cities[c].spread_within = 1.0;
    
    cities[c].production = prod[c];
    cities[c].next_to = new Set();
  }
  
  for (var p in connx) {
    cities[p[0]].next_to.add(p[1]);
    cities[p[1]].next_to.add(p[0]);
  }
}

void attrician ()
{
  var deaths;
  
  for (var city in cities) {
    deaths = city.infected * 0.3 * city.death_rate;
    if (deaths > city.infected) {
      deaths = city.infected;
    }
    city.dead += deaths;
    city.infected -= deaths;
  }
}

void spread (var city, var spread_factor, var adjust)
{
  var healthy = city.population - city.dead - city.infected;
  var infection = healthy * spread_factor * adjust;
  if (infection > healthy) {
    infection = healthy;
  }
  city.infected += infection;
}

void spread_within ()
{
  for (var city in cities) {
    spread(city, 0.3, city.spread_within);
  }
}

void spread_to ()
{
  var from_rate;
  
  for (var from_city in cities) {
    from_rate = from_city.infected * from_city.spread_to;
    for (var to_city in from_city.next_to) {
      spread(to_city, (0.2 * from_rate), to_city.spread_from);
    }
  }
}

void turn ()
{
  spread_within();
  attrician();
  spread_to();
}
