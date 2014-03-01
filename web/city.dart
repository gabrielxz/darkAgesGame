part of darkagesgame;

var cities;

class City {
  var population;
  var dead;
  var infected;
  var healthy;
  var name;
  
  var spread_from_factor;    // Factor applied when spreading from this city
  var spread_to_factor;      // Factor applied when other cities spread to this one
  var spread_within_factor;  // Factor applied when spreading within this city
  var death_rate;            // Rate of infected people dying
  var workforce;             // Number of people producing resources
  
  var production;
  var next_to;
  
  // Settings
  var house_arrest;          // Infected don't work
  var quarantine;            // No production, very low spread to/from
  var barricade;             // Low production, low spread to
  
  void configure ()
  {
    spread_to_factor = 1.0;
    spread_from_factor = 1.0;
    spread_within_factor = 1.0;
    death_rate = 1.0;
    workforce = population - dead;
      
    
    if (house_arrest) {
      spread_within_factor *= 0.5;
      spread_from_factor *= 0.5;
      workforce -= infected;
    }
  
    if (quarantine) {
      spread_to_factor *= 0.01;
      spread_from_factor *= 0.01;
      workforce = 0;
    }

    if (barricade) {
      spread_to_factor *= 0.15;
      workforce *= 0.5;
    }
  }
  
  void kill (var infected_cnt, var healthy_cnt)
  {
    dead += infected_cnt;
    infected -= infected_cnt;
    dead += healthy_cnt;
    healthy -= healthy_cnt;
  }
  
  void infect (var spread_factor, var adjust)
  {
    var infection = healthy * spread_factor * adjust;
    if (infection > healthy) {
      infection = healthy;
    }
    infected += infection;
    healthy -= infection;
  }
  
  void spread_within ()
  {
    infect(0.3, spread_within_factor);
  }

  void spread_from ()
  {
    var from_rate = infected * spread_from_factor;
    for (var to_city in next_to) {
      to_city.infect((0.2 * from_rate), to_city.spread_to_factor);
    }
  }
  
  void succumb ()
  {
    var deaths = infected * 0.85 * death_rate;
    if (deaths > infected) {
      deaths = infected;
    }
    kill(deaths, 0);
  }
  
  void harvest ()
  {
    return workforce * production;
  }

  void set_quarantine (bool setting)
  {
    quarantine = setting;
  }

  void set_house_arrest (bool setting)
  {
    house_arrest = setting;
  }
  
  void set_barricade (bool setting)
  {
    barricade = setting;
  }
  
  void wipeout ()
  {
    kill(infected, healthy);
    house_arrest = false;
    quarantine = false;
  }

  void cull ()
  {
    kill(infected * 0.85, healthy * 0.05);
    workforce *= 0.5;
  }
  
  void medicate ()
  {
    spread_to_factor *= 0.5;
    spread_from_factor *= 0.5;
    spread_within_factor *= 0.5;
  }
}



/////////////////////// GABE'S API //////////////////////

void city_init ()
{
  var connx = [[0,1],[0,4],[0,8],[0,11],
               [1,2],[1,4],[1,5],
               [2,3],[2,5],[2,6],[2,10],
               [3,6],[3,7],
               [4,5],[4,8],[4,9],
               [5,9],[5,10],
               [6,7],[6,10],[6,13],[6,14],
               [7,14],
               [8,9],[8,11],[8,12],
               [9,10],[9,12],
               [10,12],[10,13],
               [11,12],
               [12,13],
               [13,14]];
  var pop =   [15000,  20000, 55000, 25000, 30000, 
               40000,  40000, 10000, 35000, 45000, 
               500000, 20000, 60000, 50000, 35000];
  var prod =  [1.25, 1.75, 1.75, 1.25, 2.0, 2.25, 2.0, 1.25, 1.75, 2.25, 0, 1.25, 2.75, 1.75, 1.5];
  var inf =   [0.04, 0.04, 0, 0.05, 0.03, 0, 0, 0, 0, 0, 0, 0.03, 0, 0, 0.04];
  
  cities = new List(15);
  
  for (var c = 0; c < 15; c++) {
    cities[c] = new City();

    cities[c].population = pop[c];
    cities[c].dead = 0;
    cities[c].infected = pop[c] * inf[c];
    cities[c].healthy = cities[c].population - cities[c].infected;
    cities[c].name = "David's NAME";
    
    cities[c].spread_to_factor = 1.0;
    cities[c].spread_from_factor = 1.0;
    cities[c].spread_within_factor = 1.0;
    
    cities[c].production = prod[c];
    cities[c].next_to = new Set();
  }
  
  for (var p in connx) {
    cities[p[0]].next_to.add(p[1]);
    cities[p[1]].next_to.add(p[0]);
  }
}

void turn_start ()
{
  for (var city in cities) {
    city.configure();
  }
}

void turn_end ()
{
  for (var city in cities) {
    city.spread_within();
  }
  for (var city in cities) {
    city.succumb();
  }
  for (var city in cities) {
    city.spread_from();
  }
  for (var city in cities) {
    city.harvest();
  }
}
