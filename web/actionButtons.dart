part of darkagesgame;

int buttonHeight = 30;
int buttonWidth = 115;

setupButtons()
{
  createButton ("endTurn", 50, 165, 60, 140, stepTurn, listMenu);
  createButton ("barricade", 17, 150, buttonHeight, buttonWidth, clickOnBarricade, actionMenu);
  createButton ("orbitalStrike", 17, 190, buttonHeight, buttonWidth, clickOnOrbitalStrike, actionMenu);
  createButton ("quarantine", 17, 230, buttonHeight, buttonWidth, clickOnQuarantine, actionMenu);
  createButton ("houseArrest", 17, 270, buttonHeight, buttonWidth, clickOnHouseArrest, actionMenu);
  createButton ("uproot", 17, 310, buttonHeight, buttonWidth, clickOnUproot, actionMenu);
  createButton ("vaccinate", 17, 350, buttonHeight, buttonWidth, clickOnVaccinate, actionMenu);
  createButton ("cull", 17, 390, buttonHeight, buttonWidth, clickOnCull, actionMenu);
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