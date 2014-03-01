part of darkagesgame;

class Menu extends DisplayObjectContainer
{
  
  Menu(displayObjectX, displayObjectY, xLoc, yLoc, width, height) 
  {
    this.x = displayObjectX;
    this.y = displayObjectY;
    var shape = new Shape();
    shape.graphics.rect(xLoc, yLoc, width, height);
    shape.graphics.strokeColor(Color.Blue);
    this.addChild(shape);
  }
}