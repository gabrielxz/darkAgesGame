library darkagesgame;

import 'dart:html';
import 'dart:async' show Timer;
import 'package:stagexl/stagexl.dart' hide MouseEvent;

part 'menu.dart';
part 'city.dart';

ResourceManager resourceManager;
var soundChannel1;
var soundChannel2;


Sprite countryOneButton;
TextField textField;
CanvasElement canvas;
Stage stage;
Menu listMenu;
Menu actionMenu;
Menu spaceShipMenu;
Menu testGraph;


Bitmap mapPic;
Bitmap hammerPic;

void main() 
{
  canvas = querySelector('#canvas');
  stage = new Stage(canvas, webGL: false);
  var renderLoop = new RenderLoop();
  renderLoop.addStage(stage);
  
  resourceManager = new ResourceManager()
  ..addBitmapData('map', 'images/MapRender-Real-1280x720.jpg')
  ..addBitmapData('hammer', 'images/spaceHammer.jpg')
  ..addSound('ambientMusic', 'sounds/ambient.mp3')
  ..addSound('tensionMusic', 'sounds/moon_virus_Tension_master.wav');
  //..addBitmapData('button', 'images/button.jpg')
  //..addSound('backgroundMusic', 'images/JACKSTEP.mp3');
  


resourceManager.load().then((result) 
{
  
  /*
  var buttonPic = new Bitmap(resourceManager.getBitmapData('button'));
  var buttonSprite = new Sprite();
  buttonSprite.addChild(buttonPic);
  buttonSprite.x = 340;
  buttonSprite.y = 235;
  buttonSprite.onMouseUp.listen(_handleClick);
  textField = new TextField();
  textField.defaultTextFormat = new TextFormat('Spicy Rice', 30, Color.Black);
  textField.text = 'Everything is Great';
  textField.x = 350;
  textField.y = 600;
  textField.width = 500;
  textField.height = 50;
  textField.wordWrap = true;
  */
  
  
  mapPic = new Bitmap(resourceManager.getBitmapData('map'));
  mapPic.x = 5;
  mapPic.y = 5;
  
  listMenu = new Menu(1060,0,0,35,135,250);
  actionMenu = new Menu(1060,0,0, 295, 135, 250);
  testGraph = new Menu.graph(335,200,0, 0, 75, 45);
  
  stage.addChild(mapPic);
  stage.addChild(listMenu);
  stage.addChild(actionMenu);
  stage.addChild(testGraph);
  
  musicLoop();
  //new Timer(new Duration(seconds: 5), fadeTensionIn);

  city_init();
  renderCities();
  startGame();
});


  


}

void musicLoop(){
  print("musicLoop");
  var sound1 = resourceManager.getSound("ambientMusic");
  var soundTransform0 = new SoundTransform(0.5);
  soundChannel1 = sound1.play(false, soundTransform0);
  new Timer(new Duration(seconds: 116), musicLoop);

}


void fadeTensionIn(){
  print("fadeActionIn");
  var sound2 = resourceManager.getSound("tensionMusic");
  var soundTransform0 = new SoundTransform(0.1);
  soundChannel2 = sound2.play(false, soundTransform0);
  new Timer(new Duration(milliseconds: 500), fadeTensionLevel1);
}

void fadeTensionLevel1(){
  print("fadeTensionLevel1");
  soundChannel2.soundTransform = new SoundTransform(0.2);
  new Timer(new Duration(milliseconds: 500), fadeTensionLevel2);
}

void fadeTensionLevel2(){
  print("fadeTensionLevel2");
  soundChannel2.soundTransform = new SoundTransform(0.3);
  new Timer(new Duration(milliseconds: 500), fadeTensionLevel3);
}

void fadeTensionLevel3(){
  print("fadeTensionLevel3");
  soundChannel2.soundTransform = new SoundTransform(0.4);
  new Timer(new Duration(milliseconds: 500), fadeTensionLevel4);
}

void fadeTensionLevel4(){
  print("fadeTensionLevel4");
  soundChannel2.soundTransform = new SoundTransform(0.5);
}

renderCities()
{
  
}

startGame()
{
  
}

