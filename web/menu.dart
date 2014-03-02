part of darkagesgame;

class Menu extends DisplayObjectContainer
{
  int infectedPercent;
  int healthyPercent;
  int deadPerfect;
  City thisCity;
  
  /* text fields for action menu */
  TextField cityName;
  TextField originalPopulation;
  TextField deathToll;
  TextField infected;
  TextField uninfected;
  TextField productionRate;
  TextField expectedProduction;
  /* end text fields for action menu */
  
  /* text fields for list menu */
  TextField resourcesLabel;
  TextField globalDeathTollLabel;
  TextField turnsRemainingLabel;
  /* end text fields for list menu */
  
  TextField productTextField;
  
  
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
    hammerPic.x = 25;
    hammerPic.width = 20;
    hammerPic.height = 20;
    
    /* adding production value to display to graph */
    productTextField = new TextField();
    productTextField.defaultTextFormat = new TextFormat('Spicy Rice', 12, Color.Azure);
    productTextField.text = '500K';
    productTextField.x = 45;
    productTextField.y = 25;
    productTextField.width = 50;
    productTextField.height = 20;
    productTextField.wordWrap = true;
    productTextField.type = "DYNAMIC";
    
    //end text
    
    this.addChild(deceasedBar);
    this.addChild(infectedBar);
    this.addChild(healthyBar);
    this.addChild(hammerPic);
    this.addChild(productTextField);
    
    this.onMouseClick.listen(handleClickOnMenu);
    
    updateStatusBar();
  }
  
  void setupAllText()
  {
    /* Start setting actionMenu text */
    cityName = new TextField();
    setTextFieldValues(cityName, "cityName", 15, 5, actionMenu);
    
    deathToll = new TextField();
    setTextFieldValues(deathToll, "deathToll", 15, 35, actionMenu);
    
    infected = new TextField();
    setTextFieldValues(infected, "infected", 15, 50, actionMenu);
    
    uninfected = new TextField();
    setTextFieldValues(uninfected, "uninfected", 15, 65, actionMenu);
    
    productionRate = new TextField();
    setTextFieldValues(productionRate, "Productivity", 15, 80, actionMenu);
    
    expectedProduction = new TextField();
    setTextFieldValues(expectedProduction, "Production", 15, 95, actionMenu);
    /* end setting actionMenu text */
    
    
    /* Start setting listMenu text */
    resourcesLabel = new TextField();
    setTextFieldValues(resourcesLabel, "resourcesLabel", 15, 5, listMenu);
    
    globalDeathTollLabel = new TextField();
    setTextFieldValues(globalDeathTollLabel, "deathTollLabel", 15, 20, listMenu);
    
    turnsRemainingLabel = new TextField();
    setTextFieldValues(turnsRemainingLabel, "turnsRemainingLabel", 15, 35, listMenu);
    /* end setting listMenu text */
  }
  
  void setupAllButtons()
  {

  }
  
  void handleClickOnMenu(MouseEvent e)
  {
    setSelected(thisCity);
  }
  
  TextField setTextFieldValues(var theTextField, var textValue, var xCoord, var yCoord, parentObject )
  {
    theTextField.defaultTextFormat = new TextFormat('Spicy Rice', 14, Color.Red);
    theTextField.text = '$textValue';
    theTextField.x = xCoord;
    theTextField.y = yCoord;
    theTextField.width = 150;
    theTextField.height = 50;
    theTextField.wordWrap = true;
    theTextField.type = "DYNAMIC";
    parentObject.addChild(theTextField);
  }
  
  void updateStatusBar(){
    var healthBarLength = ((thisCity.healthy/thisCity.population)*60);
    var infectedBarLength = (((thisCity.healthy+thisCity.infected)/thisCity.population)*60);
    healthyBar.width = healthBarLength;
    infectedBar.width = infectedBarLength;
    
    //update production text
    var val = (thisCity.harvest()~/1000);
    productTextField.text = "${val}K";
  }
  
  

}