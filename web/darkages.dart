library darkagesgame;

import 'dart:html' hide MouseEvent;
import 'dart:async' show Timer;
import 'package:stagexl/stagexl.dart';

part 'menu.dart';
part 'city.dart';
part 'daListeners.dart';
part 'actionButtons.dart';

ResourceManager resourceManager;

SoundChannel soundChannel2;


Sprite countryOneButton;
TextField textField;
CanvasElement canvas;
Stage stage;
Menu listMenu;
Menu actionMenu;
Menu spaceShipMenu;
var listOfMenus = new List(15);


Bitmap mapPic;
Bitmap hammerPic;
Bitmap barricadeButtonPic;
Bitmap spaceShip;

void main() 
{
  canvas = querySelector('#canvas');
  stage = new Stage(canvas, webGL: false);
  var renderLoop = new RenderLoop();
  renderLoop.addStage(stage);
  
  
  resourceManager = new ResourceManager()
  ..addBitmapData('map', 'images/Layout720x1280.jpg')
  ..addBitmapData('hammer', 'images/icon_Wheat.png')
  ..addBitmapData('endTurn', 'images/button_EndTurn.png')
  ..addBitmapData('barricade', 'images/button_Barricade.png')
  ..addBitmapData('orbitalStrike', 'images/button_OrbitalStrike.png')
  ..addBitmapData('quarantine', 'images/button_Quarrantine.png')
  ..addBitmapData('houseArrest', 'images/button_HouseArrest.png')
  ..addBitmapData('uproot', 'images/button_Uproot.png')
  ..addBitmapData('spaceShip', 'images/ShipTop.png')
  ..addBitmapData('cull', 'images/button_Cull.png')
  ..addBitmapData('vaccinate', 'images/button_Vaccinate.png')
  ..addBitmapData('endScreen', 'images/SplashScreen.jpg')
  ..addSound('ambientMusic', 'sounds/ambient.mp3')
  ..addSound('tensionMusic', 'sounds/moon_virus_Tension_master.mp3')
  ..addSound('culling', 'sounds/moon_virus_FX_Culling.mp3')
  ..addSound('orbitalStrike', 'sounds/moon_virus_FX_Orbital_Strike.mp3')
  ..addSound('houseArrest', 'sounds/moon_virus_FX_House_Arrest.mp3')
  ..addSound('quarantine', 'sounds/moon_virus_FX_Quaranteen.mp3');
  //..addBitmapData('button', 'images/button.jpg')
  //..addSound('backgroundMusic', 'images/JACKSTEP.mp3');
  
  stage.onMouseClick.listen(showCoordinates);


resourceManager.load().then((result) 
{
  city_init();
  colony = new Colony();
  
  mapPic = new Bitmap(resourceManager.getBitmapData('map'));
  
  listMenu = new Menu(1026,18,0,0,234,225);
  actionMenu = new Menu(1029,262,0, 0, 233, 450);
  actionMenu.setupAllText();
  //Menu(displayObjectX, displayObjectY, xLoc, yLoc, width, height) 
  
  stage.addChild(mapPic);
  stage.addChild(listMenu);
  stage.addChild(actionMenu);
  
  /* Buttons */
  setupButtons();
  /* End Buttons */
  
  /* stick in the spaceship for later */
  spaceShip = new Bitmap(resourceManager.getBitmapData('spaceShip'));
  spaceShip.y = 650;
  spaceShip.x = 22;
  spaceShip.height = 50;
  spaceShip.width = 110;
  stage.addChild(spaceShip);
  /* end spaceship stuff */
  
  musicLoop();

  //new Timer(new Duration(seconds: 5), fadeTensionIn);

  
  
  createMenus();
  startGame();
});

}

SoundChannel playAudio(String trackName){
  var sound = resourceManager.getSound(trackName);
  var soundTransform = new SoundTransform(0.5);
  return sound.play(false, soundTransform);

}

void musicLoop(){
  playAudio("ambientMusic");
  new Timer(new Duration(seconds: 116), musicLoop);
}

void fadeTensionIn(){
  print("fadeTensionIn");
  var sound2 = resourceManager.getSound("tensionMusic");
  var soundTransform0 = new SoundTransform(0.1);
  soundChannel2 = sound2.play(false, soundTransform0);
  new Timer(new Duration(milliseconds: 500), fadeTensionLevel1);
}

void fadeTensionLevel1(){
  soundChannel2.soundTransform = new SoundTransform(0.2);
  new Timer(new Duration(milliseconds: 500), fadeTensionLevel2);
}

void fadeTensionLevel2(){
  soundChannel2.soundTransform = new SoundTransform(0.3);
  new Timer(new Duration(milliseconds: 500), fadeTensionLevel3);
}

void fadeTensionLevel3(){
  soundChannel2.soundTransform = new SoundTransform(0.4);
  new Timer(new Duration(milliseconds: 500), fadeTensionLevel4);
}

void fadeTensionLevel4(){
  soundChannel2.soundTransform = new SoundTransform(0.5);
}

createMenus()
{
  for (int i=0; i<cities.length; i++)
  {
    listOfMenus[i] = new Menu.graph(cities[i].x, cities[i].y, 0, 0, 75, 45, cities[i]);
    stage.addChild(listOfMenus[i]);
    
  }
}

startGame()
{
  setSelected(cities[10]);
  stage.onEnterFrame.listen(_onEnterFrame);
  
  for(var menu in listOfMenus){
    menu.updateStatusBar();
  }
}

setSelected(City thisCity)
{
  colony.select(thisCity);
  actionMenu.cityName.text = thisCity.name;
  actionMenu.deathToll.text = "Death Toll: ${thisCity.dead}";
  actionMenu.infected.text = "${thisCity.infected} Infected";
  actionMenu.uninfected.text = "${thisCity.healthy} Uninfected";
  actionMenu.productionRate.text = "Productivity: ${thisCity.production}";
  actionMenu.expectedProduction.text = "Productivity: ${thisCity.harvest()}";
  
  //actionMenu.resourcesLabel.text = "$colony.resources";
  var testvar = colony.resources;
  actionMenu.resourcesLabel.text = "Resources left: $testvar";
  var testvar3 = colony.deathToll();
  actionMenu.globalDeathTollLabel.text = "Total Dead: $testvar3";
  //actionMenu.globalDeathTollLabel.text = "LIKE A MILLION";
  var testvar2 = colony.remaining_turns;
  actionMenu.turnsRemainingLabel.text = "Turns Left: $testvar2";
}


void showCoordinates(MouseEvent e)
{
  print("${e.localX} ${e.localY}");
}

_onEnterFrame(EnterFrameEvent e) 
{
  setSelected(colony.selected_city);
  for(var menu in listOfMenus){
    menu.updateStatusBar();
  }
  
}

endGame()
{
  var endScreenPic = new Bitmap(resourceManager.getBitmapData('endScreen'));
  stage.addChild(endScreenPic);
  
  var endText = new TextField();
  endText.defaultTextFormat = new TextFormat('Spicy Rice', 35, Color.Red);
  var score = colony.remaining;
  //var score = colony.deathToll();
  endText.text = 'Score: $score';
  endText.x = 770;
  endText.y = 400;
  endText.width = 700;
  endText.height = 150;
  endText.wordWrap = true;
  endText.type = "DYNAMIC";
  stage.addChild(endText);
  
}
