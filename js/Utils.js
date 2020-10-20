class Utils {

    /**
     * Méthode statique: Permet d'être appelée sans instancier d'objet
     * @param min
     * @param max
     * @returns {*}
     */
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
