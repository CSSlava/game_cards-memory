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
   }

   create() {
      this.createBackground();
      this.createText();
      this.createCards();
      this.start();
   }

   start() {
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

   createBackground() {
      const canvasWidth = this.sys.game.config.width;
      const canvasHeight = this.sys.game.config.height;

      this.add.image(canvasWidth / 2, canvasHeight / 2, 'background');
   }

   createText() {
      this.timeoutText = this.add.text(10, 330, 'Time:', {
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

   if (this.openedCard) {
      if (this.openedCard.value === card.value) {
         // save opened cards
         this.openedCard = null;
         ++this.openedCardsCount;
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
}