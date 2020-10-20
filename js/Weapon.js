class Weapon {

    constructor(x, y, image, degat = 10) {
        //Attributs
        this.x = x;
        this.y = y;
        this.image = image;
        this.degat = degat;
    }

    /**
     * Méthode setDegat
     * @param id
     */
    setDegat(id){
        const degats = {
            0: 5,
            1: 10,
            2: 20,
            3: 30,
            4: 40
        }
        this.degat = degats[id]
    }

}
