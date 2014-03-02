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
    
    cityName = new TextField();
    setTextFieldValues(cityName, "cityName", 15, 30);
    
    originalPopulation = new TextField();
    setTextFieldValues(originalPopulation, "originalPopulation", 15, 30);
    
    deathToll = new TextField();
    setTextFieldValues(deathToll, "deathToll", 15, 30);
    
    infected = new TextField();
    setTextFieldValues(infected, "infected", 15, 30);
    
    uninfected = new TextField();
    setTextFieldValues(uninfected, "uninfected", 15, 30);
    
    productionRate = new TextField();
    setTextFieldValues(productionRate, "productionRate", 15, 30);
    
    expectedProduction = new TextField();
    setTextFieldValues(expectedProduction, "expectedProduction", 15, 30);

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
    setSelected(thisCity);
  }
  
  TextField setTextFieldValues(var theTextField, var textValue, var xCoord, var yCoord )
  {
    theTextField.defaultTextFormat = new TextFormat('Spicy Rice', 15, Color.Red);
    theTextField.text = '$textValue';
    theTextField.x = 15;
    theTextField.y = 30;
    theTextField.width = 100;
    theTextField.height = 50;
    theTextField.wordWrap = true;
    theTextField.type = "DYNAMIC";
    this.addChild(theTextField);
  }

}