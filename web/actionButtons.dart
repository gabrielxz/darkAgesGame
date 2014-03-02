part of darkagesgame;

int buttonHeight = 30;
int buttonWidth = 85;

setupButtons()
{
  createButton ("endTurn", 1067, 245, 60, 140, stepTurn, stage);
  createButton ("barricade", 17, 150, buttonHeight, buttonWidth, clickOnBarricade, actionMenu);
  createButton ("orbitalStrike", 17, 175, buttonHeight, buttonWidth, clickOnBarricade, actionMenu);
  createButton ("quarantine", 17, 200, buttonHeight, buttonWidth, clickOnBarricade, actionMenu);
  createButton ("houseArrest", 17, 250, buttonHeight, buttonWidth, clickOnBarricade, actionMenu);
  createButton ("uproot", 17, 275, buttonHeight, buttonWidth, clickOnBarricade, actionMenu);
}

createButton(bitmapName, int xCoord, int yCoord, height, width, listenFunction, parentObject)
{
  var thisButton = new Bitmap(resourceManager.getBitmapData(bitmapName));
  thisButton.y = yCoord;
  thisButton.x = xCoord;
  thisButton.height = height;
  thisButton.width = width;

  Sprite thisSprite = new Sprite();
  thisSprite.addChild(thisButton);
  parentObject.addChild(thisSprite);
  thisSprite.onMouseClick.listen(listenFunction);
}