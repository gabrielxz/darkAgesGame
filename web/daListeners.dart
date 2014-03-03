part of darkagesgame;


void clickOnBarricade(MouseEvent e)
{
  colony.barricade();
  playAudio("culling");
  print("barricade!");
  
}

void clickOnOrbitalStrike(MouseEvent e)
{
  colony.orbital_strike();
  playAudio("orbitalStrike");
 
  print("barricade!");
  
}

void clickOnQuarantine(MouseEvent e)
{
  colony.quarantine()
    playAudio("quarantine");
  print("barricade!");
  
}

void clickOnCull(MouseEvent e)
{
  colony.cull();
  playAudio("culling");
  print("barricade!");
  
}

void clickOnVaccinate(MouseEvent e)
{
  colony.vaccinate();
  playAudio("culling");
  print("vaccinate!");
  
}
void clickOnUproot(MouseEvent e)
{
  colony.uproot();
  playAudio("laserBlast");
  print("barricade!");
}

void clickOnHouseArrest(MouseEvent e)
{
  colony.house_arrest();
  playAudio("houseArrest");
  print("barricade!");
  
}
void stepTurn(MouseEvent e){
  playAudio("endTurn");
  print("stepTurn");
  colony.turn_end();
  for(var menu in listOfMenus){
    menu.updateStatusBar();
  }
  
  spaceShip.x += 32; //move the spaceship
  
  if (colony.remaining_turns <= 0 )
  {
    endGame();
    playAudio("victory");
  }
  if (colony.remaining == 0)
  {
    endGame();
    playAudio("death");
  }
  
  if (colony.remaining_turns == 5)
  {
    fadeTensionIn();
  }
  
}