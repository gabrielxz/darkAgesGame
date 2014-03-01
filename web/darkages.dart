library darkagesgame;

import 'dart:html' as html;
import 'package:stagexl/stagexl.dart';

//part 'sound_demo.dart';


Stage stage = new Stage(html.querySelector('#canvas'));
RenderLoop renderLoop = new RenderLoop();
ResourceManager resourceManager  = new ResourceManager();

void main() {
     
  renderLoop.addStage(stage);
  
  //resourceManager
 //   ..addBitmapData('KeyBlack','images/piano/KeyBlack.png')
  //  ..addSound('Cheer','sounds/Cheer.mp3')
     
  
  resourceManager.load()
    .then((_) => stage.addChild(new SoundDemo()))
    .catchError((e) => print(e));
}
