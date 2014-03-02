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
  var healthyBar = new Shape();
  var infectedBar = new Shape();
  var deceasedBar = new Shape();
  
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
    
    healthyBar.graphics.rect(5, 5, 60, 9);
    healthyBar.graphics.fillColor(Color.Lime);
    healthyBar.alpha = 1;
    
    infectedBar.graphics.rect(5, 5, 60, 9);
    infectedBar.graphics.fillColor(Color.Yellow);
    infectedBar.alpha = 1;
    
    deceasedBar.graphics.rect(5, 5, 60, 9);
    deceasedBar.graphics.fillColor(Color.Red);
    deceasedBar.alpha = 1;
    
    hammerPic = new Bitmap(resourceManager.getBitmapData('hammer'));
    hammerPic.y = 23;
    hammerPic.x = 5;
    
    this.addChild(deceasedBar);
    this.addChild(infectedBar);
    this.addChild(healthyBar);
    this.addChild(hammerPic);
    
    this.onMouseClick.listen(handleClickOnMenu);
    
    updateStatusBar();
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
  
  void updateStatusBar(){
    var healthBarLength = ((thisCity.healthy/thisCity.population)*60);
    var infectedBarLength = (((thisCity.healthy+thisCity.infected)/thisCity.population)*60);
    healthyBar.width = healthBarLength;
    infectedBar.width = infectedBarLength;
  }

}