library darkagesgame;

import 'dart:html' hide MouseEvent;
import 'dart:async' show Timer;
import 'package:stagexl/stagexl.dart';

part 'menu.dart';
part 'city.dart';

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
City selectedCity;
//Menu testGraph;


Bitmap mapPic;
Bitmap hammerPic;
Bitmap barricadeButtonPic;

void main() 
{
  canvas = querySelector('#canvas');
  stage = new Stage(canvas, webGL: false);
  var renderLoop = new RenderLoop();
  renderLoop.addStage(stage);
  
  resourceManager = new ResourceManager()
  ..addBitmapData('map', 'images/MapRender-445pm.png')
  ..addBitmapData('hammer', 'images/spaceHammer.jpg')
  ..addSound('ambientMusic', 'sounds/ambient.mp3')
  ..addSound('tensionMusic', 'sounds/moon_virus_Tension_master.wav');
  //..addBitmapData('button', 'images/button.jpg')
  //..addSound('backgroundMusic', 'images/JACKSTEP.mp3');
  
  stage.onMouseClick.listen(showCoordinates);


resourceManager.load().then((result) 
{
  mapPic = new Bitmap(resourceManager.getBitmapData('map'));
  
  listMenu = new Menu(1060,0,0,0,135,250);
  actionMenu = new Menu(1060,295,0, 0, 135, 250);
  actionMenu.setupAllText();
  //Menu(displayObjectX, displayObjectY, xLoc, yLoc, width, height) 
  
  stage.addChild(mapPic);
  stage.addChild(listMenu);
  stage.addChild(actionMenu);
  
  var hammerPic1 = new Bitmap(resourceManager.getBitmapData('hammer'));
  hammerPic1.y = 23;
  hammerPic1.x = 5;
  
  Sprite sprite = new Sprite();
  sprite.addChild(hammerPic1);
  
  
  
  stage.addChild(sprite);
  sprite.onMouseClick.listen(stepTurn);
  
  
  musicLoop();

  new Timer(new Duration(seconds: 5), fadeTensionIn);


  city_init();
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
    //listOfMenus[i] = new Menu.graph(50, 5 + i*50, 0, 0, 75, 45, cities[i]);
    listOfMenus[i] = new Menu.graph(cities[i].x, cities[i].y, 0, 0, 75, 45, cities[i]);
    stage.addChild(listOfMenus[i]);
    
  }
}

startGame()
{
  turn_start();
  
}

setSelected(City thisCity)
{
  selectedCity = thisCity;
  actionMenu.cityName.text = thisCity.name;
  actionMenu.deathToll.text = "Death Toll: ${thisCity.dead}";
  actionMenu.infected.text = "${thisCity.infected} Infected";
  actionMenu.uninfected.text = "${thisCity.healthy} Uninfected";
  actionMenu.productionRate.text = "Productivity: ${thisCity.production}";
  actionMenu.expectedProduction.text = "Productivity: ${thisCity.harvest()}";
}


void showCoordinates(MouseEvent e)
{
  print("${e.localX} ${e.localY}");
}

void stepTurn(MouseEvent e){
  print("stepTurn");
  turn_end();
    for(var menu in listOfMenus){
      menu.updateStatusBar();
    }
}


