library darkagesgame;

import 'dart:html' hide MouseEvent;
import 'dart:async' show Timer;
import 'package:stagexl/stagexl.dart';

part 'menu.dart';
part 'city.dart';

ResourceManager resourceManager;
var soundChannel;

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

void main() 
{
  canvas = querySelector('#canvas');
  stage = new Stage(canvas, webGL: false);
  var renderLoop = new RenderLoop();
  renderLoop.addStage(stage);
  
  resourceManager = new ResourceManager()
  ..addBitmapData('map', 'images/MapRender-445pm.png')
  ..addBitmapData('hammer', 'images/spaceHammer.jpg')
  ..addSound('ambientMusic', 'sounds/ambient.mp3');
  //..addBitmapData('button', 'images/button.jpg')
  //..addSound('backgroundMusic', 'images/JACKSTEP.mp3');
  
  stage.onMouseClick.listen(showCoordinates);


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
  //mapPic.x = 5;
  //mapPic.y = 5;
  
  listMenu = new Menu(1060,0,0,0,135,250);
  actionMenu = new Menu(1060,295,0, 0, 135, 250);
  //Menu(displayObjectX, displayObjectY, xLoc, yLoc, width, height) 
  //testGraph = new Menu.graph(335,200,0, 0, 75, 45);
  
  stage.addChild(mapPic);
  stage.addChild(listMenu);
  stage.addChild(actionMenu);
  //stage.addChild(testGraph);
  
  musicLoop();

  city_init();
  createMenus();
  startGame();
});

}

void musicLoop(){
  print("musicLoop");
  var sound1 = resourceManager.getSound("ambientMusic");
  var soundTransform1 = new SoundTransform(0.5);
  soundChannel = sound1.play(false, soundTransform1);
  new Timer(new Duration(seconds: 10), musicLoop);
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
  
}

setSelected(City thisCity)
{
  selectedCity = thisCity;
  actionMenu.cityName.text = thisCity.name;
}


void showCoordinates(MouseEvent e)
{
  print("${e.localX} ${e.localY}");
}

