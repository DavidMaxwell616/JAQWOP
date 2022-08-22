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
  this.load.image('upperArm', 'upperarm.png');
  this.load.image('lowerArm', 'lowerarm.png');
  this.load.image('body', 'jackbody.png');
  this.load.image('thigh', 'jackthigh.png');
  this.load.image('leg', 'jackleg.png');
  this.load.image('head', 'jackhead.png');
  this.load.image('foot', 'jackfoot.png');
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