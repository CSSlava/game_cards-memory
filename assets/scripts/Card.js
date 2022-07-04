class Card extends Phaser.GameObjects.Sprite {
   constructor(scene, value) {
      super(scene, 0, 0, `card`);
      this.scene = scene;
      this.value = value;
      // this.setOrigin(0, 0);
      this.scene.add.existing(this);
      this.setInteractive(); 
      this.opened = false;


      // this.setScale(0.9);
      // this.on('pointerdown', this.open);
      // this.flip()
   }

   init(position) {
      this.position = position;
      this.close();
      this.setPosition(-this.width, -this.height);
   }

   move({x, y, delay}) {
      this.scene.tweens.add({
         targets: this,
         x: x,
         y: y,
         delay: delay,
         ease: 'Linear',
         duration: 250,
         onComplete: () => {

         }
      });

      // this.setPosition(x, y);
   }

   flip() {
      this.scene.tweens.add({
         targets: this,
         scaleX: 0,
         ease: 'Linear',
         duration: 150,
         onComplete: () => {
            this.show();
         }
      });
   }

   show() {
      const texture = this.opened ? `card_${this.value}` : 'card';
      this.setTexture(texture);
      this.scene.tweens.add({
         targets: this,
         scaleX: 1,
         ease: 'Linear',
         duration: 150,
      })
   }

   open() {
      this.opened = true;
      this.flip();
   }

   close() {
      if (this.opened) {
         this.opened = false;
         this.flip();
      }
   }
}