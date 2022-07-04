class GameScene extends Phaser.Scene {
   constructor() {
      super('Game');
   }

   preload() {
      this.load.image('background', 'assets/img/bg.webp');
      this.load.image('card', 'assets/img/card_bg.png');

      for (let i = 1; i < 6; i++) {
         this.load.image(`card_${i}`, `assets/img/card_${i}.png`);
      }

      this.load.audio('theme', 'assets/sounds/theme.wav');
      this.load.audio('card', 'assets/sounds/card.mp3');
      this.load.audio('complete', 'assets/sounds/complete.mp3');
      this.load.audio('success', 'assets/sounds/success.mp3');
      this.load.audio('timeout', 'assets/sounds/timeout.mp3');
   }

   create() {
      this.timeout = config.timeout;
      this.createSounds();
      this.createBackground();
      this.createTimer();
      this.createText();
      this.createCards();
      this.start();
   }

   start() {
      this.timeout = config.timeout;
      this.openedCard = null;
      this.openedCardsCount = 0;
      this.initCards();
   }

   initCards() {
      let positions = this.getCardsPositions();

      this.cards.forEach(card => {
         let position = positions.pop();
         card.close();
         card.setPosition(position.x, position.y);
      });
   }

   createSounds() {
      this.sounds = {
         card: this.sound.add('card'),
         success: this.sound.add('success'),
         complete: this.sound.add('complete'),
         theme: this.sound.add('theme'),
         timeout: this.sound.add('timeout'),
      };

      this.sounds.theme.play({
         volume: 0.1,
         loop: true,
      })
   }

   createBackground() {
      const canvasWidth = this.sys.game.config.width;
      const canvasHeight = this.sys.game.config.height;

      this.add.image(canvasWidth / 2, canvasHeight / 2, 'background');
   }

   createTimer() {
      this.time.addEvent({
         delay: 1000,
         callback: this.onTimerTick,
         callbackScope: this,
         loop: true,
      });
   }

   createText() {
      this.timeoutText = this.add.text(10, 330, '', {
         font: '36px Grames',
         fill: '#fff',
      })
   }

   createCards() {
      this.cards = [];

      for (let value of config.cards) {
          for (let i = 0; i < 2; i++) {
              this.cards.push(new Card(this, value));
          }
      }

      this.input.on('gameobjectdown', this.onCardClicked, this);
  }

  onCardClicked(pointer, card) {
   if (card.opened) {
      return false;
   }

   this.sounds.card.play();

   if (this.openedCard) {
      if (this.openedCard.value === card.value) {
         // save opened cards
         this.openedCard = null;
         ++this.openedCardsCount;
         this.sounds.complete.play();
      } else {
         // close opened card
         this.openedCard.close();
         this.openedCard = card;
      }
   } else {
      // open card
      this.openedCard = card;
   }

   card.open();

   if (this.openedCardsCount === this.cards.length / 2) {
      this.sounds.success.play();
      this.start();
   }

  }

  getCardsPositions() {
      let positions = [];
      let cardTexture = this.textures.get('card').getSourceImage();
      let cardWidth = cardTexture.width + 4;
      let cardHeight = cardTexture.height + 4;
      let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2;
      let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;
  
      for (let row = 0; row < config.rows; row++) {
          for (let col = 0; col < config.cols; col++) {
              positions.push({
                  x: offsetX + col * cardWidth,
                  y: offsetY + row * cardHeight,
              });
          }
      }
  
      return Phaser.Utils.Array.Shuffle(positions);
  }

  onTimerTick() {
   this.timeoutText.setText(`Time: ${this.timeout}`);

   if (this.timeout <= 0) {
      this.sounds.timeout.play();
      this.start();
   } else {
      --this.timeout;
   }
  }
}