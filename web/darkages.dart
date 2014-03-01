library darkagesgame;

import 'dart:html';
import 'package:stagexl/stagexl.dart';
import 'city.dart';
Sprite countryOneButton;
TextField textField;

void main() 
{
  var canvas = querySelector('#canvas');
  var stage = new Stage(canvas);
  var renderLoop = new RenderLoop();
  renderLoop.addStage(stage);
  
  var resourceManager = new ResourceManager()
  ..addBitmapData('map', 'images/mapLayout.jpg')
  ..addBitmapData('button', 'images/button.jpg');
  //..addSound('backgroundMusic', 'images/JACKSTEP.mp3');
  
  city_init();


resourceManager.load().then((result) 
{
  var mapPic = new Bitmap(resourceManager.getBitmapData('map'));
  mapPic.x = 35;
  mapPic.y = 35;
  
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
  
  
  stage.addChild(mapPic);
  stage.addChild(buttonSprite);
  stage.addChild(textField);
});
  
}


_handleClick(MouseEvent e)
{
  textField.text = "You Vented!";
}


