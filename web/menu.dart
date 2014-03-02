part of darkagesgame;

class Menu extends DisplayObjectContainer
{
  int infectedPercent;
  int healthyPercent;
  int deadPerfect;
  City thisCity;
  TextField cityName;
  TextField originalPopulation;
  TextField deathToll;
  TextField infected;
  TextField uninfected;
  TextField productionRate;
  TextField expectedProduction;
  
  Menu(displayObjectX, displayObjectY, xLoc, yLoc, width, height) 
  {
    this.x = displayObjectX;
    this.y = displayObjectY;
    var shape = new Shape();
    shape.graphics.rect(xLoc, yLoc, width, height);
    shape.graphics.strokeColor(Color.Blue);
    this.addChild(shape);

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
  
  void setupAllText()
  {
    cityName = new TextField();
    setTextFieldValues(cityName, "cityName", 15, 5);
    
    deathToll = new TextField();
    setTextFieldValues(deathToll, "deathToll", 15, 35);
    
    infected = new TextField();
    setTextFieldValues(infected, "infected", 15, 50);
    
    uninfected = new TextField();
    setTextFieldValues(uninfected, "uninfected", 15, 65);
    
    productionRate = new TextField();
    setTextFieldValues(productionRate, "Productivity", 15, 80);
    
    expectedProduction = new TextField();
    setTextFieldValues(expectedProduction, "Production", 15, 95);
  }
  
  void setupAllButtons()
  {

  }
  
  void handleClickOnMenu(MouseEvent e)
  {
    setSelected(thisCity);
  }
  
  TextField setTextFieldValues(var theTextField, var textValue, var xCoord, var yCoord )
  {
    theTextField.defaultTextFormat = new TextFormat('Spicy Rice', 13, Color.Red);
    theTextField.text = '$textValue';
    theTextField.x = xCoord;
    theTextField.y = yCoord;
    theTextField.width = 150;
    theTextField.height = 50;
    theTextField.wordWrap = true;
    theTextField.type = "DYNAMIC";
    this.addChild(theTextField);
  }

}