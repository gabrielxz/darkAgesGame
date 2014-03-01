library darkagesgame;

import 'dart:html';
import 'package:stagexl/stagexl.dart';
Sprite countryOneButton;

void main() 
{
  var canvas = querySelector('#canvas');
  var stage = new Stage(canvas);
  var renderLoop = new RenderLoop();
  renderLoop.addStage(stage);
  
  var resourceManager = new ResourceManager()
  ..addBitmapData('map', 'images/map.jpg')
  ..addBitmapData('button', 'images/button.jpg');
  //..addSound('backgroundMusic', 'images/JACKSTEP.mp3');
  


resourceManager.load().then((result) 
{
  var mapPic = new Bitmap(resourceManager.getBitmapData('map'));
  mapPic.x = 200;
  mapPic.y = 200;
  
  var buttonPic = new Bitmap(resourceManager.getBitmapData('button'));
  var buttonSprite = new Sprite();
  buttonSprite.addChild(buttonPic);
  buttonSprite.x = 220;
  buttonSprite.y = 220;
  buttonSprite.onMouseUp.listen(_handleClick);
  
  stage.addChild(mapPic);
  stage.addChild(buttonSprite);
});
  
}


_handleClick(MouseEvent e)
{
  print("You Vented!");
}


