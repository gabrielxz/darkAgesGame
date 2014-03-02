part of darkagesgame;

var cities;
var colony;

final spread_from_const = 3;
final spread_within_const = 5;
final death_const = 0.85;
final game_turns = 25;

class City {
  var population;
  var dead;
  var infected;
  var getting_sick;
  var healthy;
  var name;
  
  var spread_from_factor;    // Factor applied when spreading from this city
  var spread_to_factor;      // Factor applied when other cities spread to this one
  var spread_within_factor;  // Factor applied when spreading within this city
  var death_rate;            // Rate of infected people dying
  var workforce;             // Number of people producing resources
  
  var production;
  var next_to;
  var x;
  var y;
  
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
    infected_cnt = infected_cnt.ceil().toInt();
    healthy_cnt = healthy_cnt.toInt();
    
    dead += infected_cnt;
    infected -= infected_cnt;
    dead += healthy_cnt;
    healthy -= healthy_cnt;
  }
  
  void infect (var spread_factor, var adjust)
  {
    var infection = spread_factor * adjust;
    if (infection > healthy) {
      infection = healthy;
    }
    infection = infection.toInt();
    getting_sick += infection;
    healthy -= infection;
  }
  
  void spread_within ()
  {
    infect(spread_within_const, infected * spread_within_factor);
  }

  void spread_from ()
  {
    var from_rate = infected * spread_from_factor * spread_from_const;
    for (var to_city in next_to) {
      to_city.infect(from_rate, to_city.spread_to_factor);
    }
  }
  
  void succumb ()
  {
    var deaths = infected * death_const * death_rate;
    if (deaths > infected) {
      deaths = infected;
    }
    kill(deaths, 0);
  }
  
  void metastacize ()
  {
    infected += getting_sick;
    getting_sick = 0;
  }
  
  int harvest ()
  {
    return (workforce * production).toInt();
  }

  void set_quarantine ()
  {
    if (!quarantine) {
      house_arrest = false;
      barricade = false;
      quarantine = true;
    } else {
      quarantine = false;
    }
    configure();
  }

  void set_house_arrest ()
  {
    if (!house_arrest) {
      house_arrest = true;
      barricade = false;
      quarantine = false;
    } else {
      house_arrest = false;
    }
    configure();
  }
  
  void set_barricade ()
  {
    if (!barricade) {
      house_arrest = false;
      barricade = true;
      quarantine = false;
    } else {
      barricade = false;
    }
    configure();
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


class Colony
{
  var resources;
  var remaining_turns;
  var selected_city;
  
  Colony()
  {
    remaining_turns = game_turns;
    
    for (var city in cities) {
      city.metastacize();
      city.configure();
    }
  }
  
  void turn_end ()
  {
    for (var city in cities) {
      resources += city.harvest();
    }
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
      city.metastacize();
      city.configure();
    }
    remaining_turns--;
  }
  
  void select(var index)
  {
    selected_city = cities[index];
  }
  
  void orbital_strike()
  {
    selected_city.wipeout();
  }
  
  void cull()
  {
    selected_city.cull();
  }
  
  void uproot()
  {
    selected_city.uproot();   
  }
  
  void barricade()
  {
    selected_city.set_barricade();
  }
  
  void quarantine()
  {
    selected_city.set_quarantine();
  }
  
  void house_arrest()
  {
    selected_city.set_quarantine();
  }
  
  void vaccinate()
  {
    var required = selected_city.healthy;
    if (resources < required) {
      return;
    }
    resources -= required;
    selected_city.medicate();
  }
}


void city_init ()
{
  var city;
  var connx = [[0,1],[0,4],[0,8],
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
    
  cities = new List(15);
  for (var c = 0; c < 15; c++) {
    cities[c] = new City();
  }

  city = cities[0];
  city.name = "Constantinople";
  city.population = 15000;
  city.production = 1.25;
  city.getting_sick = 0.04;
  city.x = 48;
  city.y = 137;

  city = cities[1];
  city.name = "Rome";
  city.population = 20000;
  city.production = 1.75;
  city.getting_sick = 0.04;
  city.x = 290;
  city.y = 64;

  city = cities[2];
  city.name = "Barcelona";
  city.population = 55000;
  city.production = 1.75;
  city.getting_sick = 0;
  city.x = 524;
  city.y = 72;

  city = cities[3];
  city.name = "Marsailles";
  city.population = 25000;
  city.production = 1.25;
  city.getting_sick = 0.05;
  city.x = 928;
  city.y = 134;

  city = cities[4];
  city.name = "Milan";
  city.population = 30000;
  city.production = 2.0;
  city.getting_sick = 0.03;
  city.x = 206;
  city.y = 229;

  city = cities[5];
  city.name = "Vienna";
  city.population = 40000;
  city.production = 2.25;
  city.getting_sick = 0;
  city.x = 401;
  city.y = 169;

  city = cities[6];
  city.name = "Paris";
  city.population = 40000;
  city.production = 2.0;
  city.getting_sick = 0;
  city.x = 798;
  city.y = 350;
  
  city = cities[7];
  city.name = "Cologne";
  city.population = 10000;
  city.production = 1.25;
  city.getting_sick = 0.04;
  city.x = 936;
  city.y = 273;

  city = cities[8];
  city.name = "London";
  city.population = 35000;
  city.production = 1.75;
  city.getting_sick = 0;
  city.x = 138;
  city.y = 366;

  city = cities[9];
  city.name = "Copenhagen";
  city.population = 45000;
  city.production = 2.25;
  city.getting_sick = 0;
  city.x = 352;
  city.y = 405;

  city = cities[10];
  city.name = "Stockholm";
  city.population = 500000;
  city.production = 0;
  city.getting_sick = 0;
  city.x = 502;
  city.y = 371;

  city = cities[11];
  city.name = "Moscow";
  city.population = 20000;
  city.production = 1.25;
  city.getting_sick = 0.03;
  city.x = 60;
  city.y = 525;

  city = cities[12];
  city.name = "Kiev";
  city.population = 60000;
  city.production = 2.75;
  city.getting_sick = 0;
  city.x = 393;
  city.y = 547;

  city = cities[13];
  city.name = "Cracow";
  city.population = 50000;
  city.production = 1.75;
  city.getting_sick = 0;
  city.x = 691;
  city.y = 565;

  city = cities[14];
  city.name = "Naples";
  city.population = 35000;
  city.production = 1.5;
  city.getting_sick = 0.04;
  city.x = 926;
  city.y = 488;

  for (city in cities) {
    city.dead = 0;
    city.getting_sick = (city.getting_sick * city.population).toInt();
    //city.getting_sick = 0;
    city.infected = 0;
    city.healthy = city.population - city.getting_sick;
    city.quarantine = false;
    city.house_arrest = false;
    city.barricade = false;
    city.next_to = new Set();
    city.configure();
  }
  //cities[0].getting_sick = 1;
  
  for (var p in connx) {
    cities[p[0]].next_to.add(cities[p[1]]);
    cities[p[1]].next_to.add(cities[p[0]]);
  }
}

