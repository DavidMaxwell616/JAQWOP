var loadText;
function preload() {
  game.load.crossOrigin = 'anonymous';
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.refresh();

  game.load.onLoadStart.add(loadStart, this);
  game.load.onLoadComplete.add(loadComplete, this);
  loadText = game.add.text(32, 32, '', {
    fill: '#ffffff',
  });

  game.load.image('background', '../assets/images/background.JPG');
  game.load.image('rightArm', '../assets/images/jackLarm.png');
  game.load.image('body', '../assets/images/jackbody.png');
  game.load.image('head', '../assets/images/jackhead.png');
  game.load.image('leftArm', '../assets/images/jacklarm.png');
  game.load.image('leg', '../assets/images/jackleg.png');
  game.load.image('thigh', '../assets/images/jackthigh.png');
  game.load.image('maxxdaddy', '../assets/images/maxxdaddy.gif');
 
}

function loadStart() {
  loadText.setText('Loading ...');
}

function loadComplete() {
  loadText.setText('Load Complete');
}
