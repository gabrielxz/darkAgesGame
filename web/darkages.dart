library darkagesgame;

import 'dart:html';
import 'package:stagexl/stagexl.dart';

part 'menu.dart';

Sprite countryOneButton;
TextField textField;
CanvasElement canvas;
Stage stage;
Menu listMenu;
Menu actionMenu;
Menu spaceShipMenu;
Bitmap mapPic;

void main() 
{
  canvas = querySelector('#canvas');
  stage = new Stage(canvas, webGL: false);
  var renderLoop = new RenderLoop();
  renderLoop.addStage(stage);
  
  var resourceManager = new ResourceManager()
  ..addBitmapData('map', 'images/mapLayout.jpg')
  //..addBitmapData('button', 'images/button.jpg')
  ..addBitmapData('spaceShip', 'images/rocketShip.png');
  //..addSound('backgroundMusic', 'images/JACKSTEP.mp3');
  


resourceManager.load().then((result) 
{
  var spaceShip = new Bitmap(resourceManager.getBitmapData('spaceShip'));
  mapPic = new Bitmap(resourceManager.getBitmapData('map'));
  mapPic.x = 150;
  mapPic.y = 5;
  
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
  
  
  listMenu = new Menu(5,0,0,35,135,250);
  
  actionMenu = new Menu(5,0,0, 295, 135, 250);
  spaceShipMenu = new Menu(160,550,0, 0, 700, 150);
  
  stage.addChild(mapPic);
  stage.addChild(listMenu);
  stage.addChild(actionMenu);
  stage.addChild(spaceShipMenu);
  
  spaceShipMenu.addChild(spaceShip);
  
});
  
}


_handleClick(MouseEvent e)
{
  textField.text = "You Vented!";
}


