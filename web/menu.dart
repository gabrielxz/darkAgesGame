part of darkagesgame;

class Menu extends DisplayObjectContainer
{
  int infectedPercent;
  int healthyPercent;
  int deadPerfect;
  City thisCity;
  TextField cityName;
  
  Menu(displayObjectX, displayObjectY, xLoc, yLoc, width, height) 
  {
    this.x = displayObjectX;
    this.y = displayObjectY;
    var shape = new Shape();
    shape.graphics.rect(xLoc, yLoc, width, height);
    shape.graphics.strokeColor(Color.Blue);
    this.addChild(shape);
    
    cityName = new TextField();
    cityName.defaultTextFormat = new TextFormat('Spicy Rice', 30, Color.Red);
    cityName.text = 'null';
    cityName.x = 15;
    cityName.y = 30;
    cityName.width = 100;
    cityName.height = 50;
    cityName.wordWrap = true;
    this.addChild(cityName);
  }
  
  Menu.graph(displayObjectX, displayObjectY, xLoc, yLoc, width, height, city) 
  {
    thisCity = city;
    this.x = displayObjectX;
    this.y = displayObjectY;
    var shape = new Shape();
    shape.graphics.rectRound(xLoc, yLoc, width, height, 5, 5);
    shape.graphics.fillColor(Color.LightGray);
    shape.alpha = .5;
    this.addChild(shape);
    
    var infectedGraph = new Shape();
    infectedGraph.graphics.rect(5, 5, 60, 15);
    infectedGraph.graphics.fillColor(Color.Aqua);
    infectedGraph.alpha = .55;
    
    hammerPic = new Bitmap(resourceManager.getBitmapData('hammer'));
    hammerPic.y = 23;
    hammerPic.x = 5;
    
    this.addChild(infectedGraph);
    this.addChild(hammerPic);
    
    this.onMouseClick.listen(handleClickOnMenu);
  }
  
  void handleClickOnMenu(MouseEvent e)
  {
    print(thisCity);
    setSelected(thisCity);
  }
  

}