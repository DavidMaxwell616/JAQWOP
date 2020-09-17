function preload() {
  game.load.onLoadStart.add(loadStart, this);
  game.load.onFileComplete.add(fileComplete, this);
  game.load.onLoadComplete.add(loadComplete, this);
  loadText = game.add.text(32, 32, '', {
    fill: '#ffffff',
  });
  
  
rightArmImage = new Image();
rightArmImage.src = "assets/images/jackrarm.png";
leftArmImage = new Image();
leftArmImage.src = "assets/images/jacklarm.png";
bodyImage = new Image();
bodyImage.src = "assets/images/jackbody.png";
thighImage = new Image();
thighImage.src = "assets/images/jackthigh.png";
legImage = new Image();
legImage.src = "assets/images/jackleg.png";
headImage = new Image();
headImage.src = "assets/images/jackhead.png";
background = new Image();
background.src = "assets/images/background.JPG";

  this.load.start();

}

function loadStart() {
  loadText.setText('Loading ...');
}

function loadComplete() {
  loadText.setText('Load Complete');
  loadText.destroy();
}
//	This callback is sent the following parameters:
function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {

  loadText.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);


}