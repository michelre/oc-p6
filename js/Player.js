class Player {

    constructor(x, y, active, weapon, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.active = active;
        this.weapon = weapon;
        this.points = 100;
        this.defendre = false;
    }

    setWeapon(weapon){
        this.weapon = weapon
    }

}
