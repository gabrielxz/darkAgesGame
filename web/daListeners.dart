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
  playAudio("culling");
  print("barricade!");
  
}

void clickOnQuarantine(MouseEvent e)
{
  colony.quarantine();
  playAudio("quarantine");
  print("barricade!");
  
}

void clickOnCull(MouseEvent e)
{
  colony.cull();
  playAudio("culling");
  print("barricade!");
  
}

void clickOnUproot(MouseEvent e)
{
  colony.uproot();
  playAudio("culling");
  print("barricade!");
}

void clickOnHouseArrest(MouseEvent e)
{
  colony.house_arrest();
  playAudio("culling");
  print("barricade!");
  
}