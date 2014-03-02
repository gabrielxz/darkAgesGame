import 'dart:html' as html;
import 'package:stagexl/stagexl.dart';

html.CanvasElement canvas;
Stage stage;
ResourceManager resourceManager;

void main() 
{
  canvas = html.querySelector('#canvas');
  stage = new Stage(canvas, webGL: false);
  var renderLoop = new RenderLoop();
  renderLoop.addStage(stage);
  
  resourceManager = new ResourceManager()
      ..addSound('houseArrest', 'sounds/brief.mp3')
      ..addBitmapData('map', 'images/Layout720x1280.jpg');
  
  
  stage.onMouseClick.listen(showCoordinates);
  resourceManager.load().then((result) 
  {
    var mapPic = new Bitmap(resourceManager.getBitmapData('map'));
    stage.addChild(mapPic);
  });
}

void showCoordinates(MouseEvent e)
{
  playAudio("houseArrest");
}

SoundChannel playAudio(String trackName){
  var sound = resourceManager.getSound(trackName);
  var soundTransform = new SoundTransform(1.0);
  return sound.play(false, soundTransform);

}