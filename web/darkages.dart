library darkagesgame;

import 'dart:html';
import 'package:stagexl/stagexl.dart';

part 'menu.dart';
part 'city.dart';

ResourceManager resourceManager;

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
  ..addBitmapData('hammer', 'images/spaceHammer.jpg');
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
  
  
});
  
}


_handleClick(MouseEvent e)
{
  textField.text = "You Vented!";
}


