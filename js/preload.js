function preload() {
  game.load.onLoadStart.add(loadStart, this);
  game.load.onFileComplete.add(fileComplete, this);
  game.load.onLoadComplete.add(loadComplete, this);
  loadText = game.add.text(32, 32, '', {
    fill: '#ffffff',
  });
  
this.load.path = '../assets/images/';
  this.load.image('background', 'background.JPG');
  this.load.image('maxxdaddy', 'maxxdaddy.gif');
  this.load.image('UpperArmImage', 'upperarm.png');
  this.load.image('LowerArmImage', 'lowerarm.png');
  this.load.image('bodyImage', 'jackbody.png');
  this.load.image('thighImage', 'jackthigh.png');
  this.load.image('legImage', 'jackleg.png');
  this.load.image('headImage', 'jackhead.png');
  this.load.image('footImage', 'jackfoot.png');
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