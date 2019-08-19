class Shotgun extends Weapon {
    constructor(character) {
        super(character);
        this.shotInterval = 0.3;
        this.angleRandomFactor = PI / 64;
        this.bulletCount = 5;
        this.sprite = SHOTGUN;
        this.bulletSpeed = BLOCK_SIZE * 30;
    }
}
