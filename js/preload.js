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
  game.load.image('rightUpperArm', '../assets/images/upperarm.png');
  game.load.image('rightLowerArm', '../assets/images/lowerarm.png');
  game.load.image('body', '../assets/images/jackbody.png');
  game.load.image('head', '../assets/images/jackhead.png');
  game.load.image('leftUpperArm', '../assets/images/upperarm.png');
  game.load.image('leftLowerArm', '../assets/images/lowerarm.png');
  game.load.image('leg', '../assets/images/jackleg.png');
  game.load.image('thigh', '../assets/images/jackthigh.png');
  game.load.image('foot', '../assets/images/jackfoot.png');
  game.load.image('maxxdaddy', '../assets/images/maxxdaddy.gif');
 
}

function loadStart() {
  loadText.setText('Loading ...');
}

function loadComplete() {
  loadText.setText('Load Complete');
}
