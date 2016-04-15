var mainState = {
   preload: function() { 
      game.load.image('monster', 'assets/monster.png'); 
      game.load.image('dead', 'assets/dead.png'); 
      game.load.image('obstacle', 'assets/obstacle.png');
      game.load.audio('jump', 'assets/jump.wav'); 
      game.load.audio('dead', 'assets/dead.wav'); 
      game.load.audio('music', 'assets/music.ogg');
      game.load.image('background', 'assets/background.png');
   },

   

   create: function() { 
      background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
      introText = game.add.text(game.world.centerX, game.world.centerY, '- click to start -', { font: "25px Calibri", fill: "#ffffff", align: "center" });
      introText.anchor.setTo(0.5, 0.5);
      if (game.device.desktop == false) {
         game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
         game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
         game.scale.pageAlignHorizontally = true;
         game.scale.pageAlignVertically = true;
      }
     
      game.physics.startSystem(Phaser.Physics.ARCADE);     
      this.monster = game.add.sprite(30, 30, 'monster');
      this.monster.scale.x = 0.05;
      this.monster.scale.y = 0.05;
      game.physics.arcade.enable(this.monster);
      this.monster.body.gravity.y = 1000;  
      var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      game.input.onDown.add(this.togglePause, this);
      spaceKey.onDown.add(this.jump, this); 

      this.obstacles = game.add.group(); 

      this.timer = game.time.events.loop(1500, this.addRowOfObstacles, this); 

      this.score = 0;
      this.labelScore = game.add.text(20, 20, "0", { font: "50px Calibri", fill: "#d9d9d9" });

      this.monster.anchor.setTo(-0.2, 0.5); 

      this.jumpSound = game.add.audio('jump'); 
      this.deadSound = game.add.audio('dead');
      this.music = game.add.audio('music');
    
      this.music.play();
      
      introText.visible = true;
      game.paused = true;
   },

   addOneObstacle: function(x, y) {
      var obstacle = game.add.sprite(x, y, 'obstacle');
      obstacle.scale.x = 0.05;
      obstacle.scale.y = 0.05;
      this.obstacles.add(obstacle);
      game.physics.arcade.enable(obstacle);
      obstacle.body.velocity.x = -200; 
      obstacle.checkWorldBounds = true;
      obstacle.outOfBoundsKill = true;
   },

   addRowOfObstacles: function() {
      var hole = Math.floor(Math.random() * 5) + 1;
      for (var i = 0; i < 8; i++)
         if (i != hole && i != hole + 1) 
            this.addOneObstacle(400, i * 60 + 10); 
      this.score += 1;
      this.labelScore.text = this.score;  
   },

        
   update: function() {
      if (this.monster.y < 0 || this.monster.y > 490)
         this.restartGame();
      if (this.monster.angle < 20)
         this.monster.angle += 0.5; 
      background.tilePosition.x -= 3;
      game.physics.arcade.overlap(this.monster, this.obstacles, this.hitObstacle, null, this);
      introText.visible = false;
   },

   hitObstacle: function() {
      if (this.monster.alive == false)
         return;
      this.monster.alive = false;
      this.monster.loadTexture('dead', 0, false)
      game.time.events.remove(this.timer);
      this.deadSound.play();
      this.obstacles.forEach(function(p) {
         p.body.velocity.x = 0;
      }, this);
      this.music.stop();
   },

   jump: function() {
      if (this.monster.alive == false)
         return; 
      this.monster.body.velocity.y = -350;
      var animation = game.add.tween(this.monster);
      animation.to({angle: -20}, 100);
      animation.start(); 
      this.jumpSound.play(); 
   },

   restartGame: function() {
      this.music.stop();
      game.state.start('main');
   },

   togglePause: function() {
      game.paused = (game.paused) ? false : true;
      introText.visible = true;
   }
};

var game = new Phaser.Game(400, 500);
game.state.add('main', mainState, true); 
