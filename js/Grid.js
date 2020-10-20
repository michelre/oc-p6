class Grid {

    /**
     * Constructeur appelé dans index.js au moment du new Grid()
     * @param totalCols
     * @param totalRows
     * @param nbObstacles
     * @param nbWeapons
     * @param nbPlayers
     */
    constructor(totalCols, totalRows, nbObstacles, nbWeapons) {
        this.nbCols = totalCols;
        this.nbRows = totalRows;
        this.combat = false;
        const nbPlayers = 2;

        /**
         * Etape 1 - Dessin de la grille et positionnement des éléménts
         */
        this.createObstacles(nbObstacles)
        this.createWeapons(nbWeapons);
        this.createPlayers(nbPlayers);

        const moveCoordinates = this.playerMove()
        // Dessin de la grille
        this.createGrid(moveCoordinates);
        //Création de l'évènement de reload sur le bouton en dessous des cartes des joueurs
        //document.querySelector('#reload').addEventListener('click', this.reload)
        $('#reload').on('click', this.reload) // Syntaxe jQuery
    }

    /**
     * Créer des objets de type Player qui contiennent les coordonnées et la propriété active pour gérer le tour par tour
     */
    createPlayers(nbPlayers) {
        const playersCoordinates = this.createElements(nbPlayers, [], this.weapons.concat(this.obstacles));
        this.players = [];
        for (let i = 0; i < playersCoordinates.length; i++) {
            const weapon = new Weapon(-1, -1, 'img/weapon0.png');
            weapon.setDegat(0)
            const player = new Player(playersCoordinates[i].x, playersCoordinates[i].y, false, weapon, 'img/player' + (i + 1) + '.png')
            this.players.push(player)
        }
        this.players[0].active = true;

        // Si nos joueurs sont côte à côte, on recrée nos joueurs
        if(this.isPlayersSideBySide()){
            this.createPlayers(nbPlayers)
        }
    }

    /**
     * Création des objets de type Weapon
     */
    createWeapons() {
        this.weapons = [];
        const weapons = this.createElements(nbWeapons, [], this.obstacles);
        for (let i = 0; i < weapons.length; i++) {
            const weapon = new Weapon(weapons[i].x, weapons[i].y, 'img/weapon' + (i + 1) + '.png');
            weapon.setDegat(i + 1);
            this.weapons.push(weapon)
        }
    }

    /**
     * Création des objets de type Obstacle
     */
    createObstacles() {
        this.obstacles = [];
        const obstacles = this.createElements(nbObstacles);
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = new Obstacle(obstacles[i].x, obstacles[i].y)
            this.obstacles.push(obstacle)
        }
    }

    /**
     * Déterminer si une cellule a un élément
     * @param cellX
     * @param cellY
     * @param elements
     * @returns {boolean}
     */
    cellHasElement(cellX, cellY, elements) {
        for (let i = 0; i < elements.length; i++) {

            if (elements[i].x === cellX && elements[i].y === cellY) {
                return elements[i];
            }
        }
        return null;
    }

    /**
     * Tableau de coordonnées des éléments de notre grille
     * @param nbElements
     * @param coordinates
     * @returns {*[]}
     */
    createElements(nbElements, coordinates = [], excludeCoordinates = []) {
        if (coordinates.length === nbElements) {
            return coordinates;
        }

        const coordinate = {
            x: Utils.getRandomNumber(0, this.nbCols - 1),
            y: Utils.getRandomNumber(0, this.nbRows - 1)
        }

        let coordinateExists = false;
        /**
         * On vérifie que la case est vide
         * la case est vide si notre coordonnées n'apparait pas dans le tableau coordinates
         * ni que la case est déjà prise par un autre élément
         * ex: Pour les armes, on vérifie que la case n'a pas déjà une arme et n'a pas d'obstacle
         */
        for (let j = 0; j < coordinates.length; j++) {
            // Pour les armes, on vérifie que la case n'a pas déjà une arme
            if (coordinate.x === coordinates[j].x && coordinate.y === coordinates[j].y) {
                coordinateExists = true;
            }
        }

        for (let k = 0; k < excludeCoordinates.length; k++) {
            // Pour les armes, on vérifie que la case n'a pas déjà un obstacle
            if (coordinate.x === excludeCoordinates[k].x && coordinate.y === excludeCoordinates[k].y) {
                coordinateExists = true;
            }
        }

        if (!coordinateExists) {
            coordinates.push(coordinate)
        }

        // Appel récursif: Appel de la fonction dans la fonction
        return this.createElements(nbElements, coordinates, excludeCoordinates)
    }

    /**
     * Récupérer les coordonnées du joueur actif
     */
    getPlayerActive() {
        if (this.players[0].active) {
            return this.players[0];
        }
        return this.players[1]
    }

    /**
     * On vérifie que les cases à tester (en paramètre) sont vides et ne contiennent pas d'obstacle
     * @param casesATester
     * @returns {[]}
     */
    deplacementPossible(casesATester) {
        const moveCoordinates = [];
        let obstacleFound = false;
        for (let i = 0; i < casesATester.length; i++) {
            const cell = casesATester[i]
            //Tester si la cellule a un obstacle et qu'aucun obstacle n'a été trouvé sur le chemin
            if (this.cellHasElement(cell.x, cell.y, this.obstacles) === null && this.cellHasElement(cell.x, cell.y, this.players) === null && obstacleFound === false) {
                moveCoordinates.push(cell)
            } else {
                obstacleFound = true;
            }
        }

        return moveCoordinates
    }

    /**
     * Déterminer le chemin de déplacement des joueurs
     * @returns {[]}
     */
    playerMove() {
        let moveCoordinates = [];
        const playerActive = this.getPlayerActive()
        let cases = []

        // Déterminer si possibilité de déplacement en haut
        for (let y = playerActive.y - 1; y >= playerActive.y - 3; y--) {
            cases.push({x: playerActive.x, y})
        }
        moveCoordinates = moveCoordinates.concat(this.deplacementPossible(cases))

        // Déterminer si possibilité de déplacement en bas
        cases = []
        for (let y = playerActive.y + 1; y <= playerActive.y + 3; y++) {
            cases.push({x: playerActive.x, y})
        }
        moveCoordinates = moveCoordinates.concat(this.deplacementPossible(cases))

        // Déterminer si possibilité de déplacement à gauche
        cases = []
        for (let x = playerActive.x - 1; x >= playerActive.x - 3; x--) {
            cases.push({x, y: playerActive.y})
        }
        moveCoordinates = moveCoordinates.concat(this.deplacementPossible(cases))

        // Déterminer si possibilité de déplacement à droite
        cases = []
        for (let x = playerActive.x + 1; x <= playerActive.x + 3; x++) {
            cases.push({x, y: playerActive.y})
        }
        moveCoordinates = moveCoordinates.concat(this.deplacementPossible(cases))

        return moveCoordinates;
    }

    /**
     * Changer l'arme du joueur
     * @param player
     */
    changeWeapon(player) {
        for (let i = 0; i < this.weapons.length; i++) {
            const weapon = this.weapons[i]
            if (weapon.x === player.x && weapon.y === player.y) {
                this.weapons[i] = player.weapon
                this.weapons[i].x = player.x
                this.weapons[i].y = player.y
            }
        }
    }

    /**
     * Déplacement du joueur actif
     * @param x
     * @param y
     */
    moveActivePlayer(x, y) {
        for (let i = 0; i < this.players.length; i++) {
            // Mise à jour des nouvelles coordonnées du player actif et changement de joueur
            if (this.players[i].active) {
                this.players[i].x = parseInt(x);
                this.players[i].y = parseInt(y);
                const weapon = this.cellHasElement(parseInt(x), parseInt(y), this.weapons);
                //Si la case possède une arme, on l'associe au joueur
                if (weapon !== null) {
                    let diffDegat = weapon.degat - this.players[i].weapon.degat
                    if (diffDegat > 0) {
                        diffDegat = '+' + diffDegat
                    }
                    const v = confirm("Souhaitez-vous changer d'arme (Degat: " + diffDegat + ")?")
                    if (v) {
                        this.changeWeapon(this.players[i])
                        this.players[i].setWeapon(weapon)
                    }

                }
                // Si on est en mode combat, on ne change pas le joueur actif
                if (this.isPlayersSideBySide(x, y)) {
                    this.combat = true;
                    this.setActivePlayer(i)
                } else {
                    this.players[i].active = false;
                }
            } else {
                if (!this.isPlayersSideBySide(x, y)) {
                    this.players[i].active = true
                }
            }
        }

        // Puisque c'est un nouveau joueur, on détermine les coordonnées de déplacement possible
        const moveCoordinates = this.playerMove()

        // Redessiner la grille
        this.createGrid(moveCoordinates);
    }

    /**
     * Permet de déterminer si les joueurs sont côte à côte
     * @returns {boolean|boolean}
     */
    isPlayersSideBySide() {
        const player1 = this.players[0];
        const player2 = this.players[1];
        const top = player1.x - player2.x === 0 && player1.y - player2.y === -1;
        const bottom = player1.x - player2.x === 0 && player1.y - player2.y === 1;
        const right = player1.x - player2.x === 1 && player1.y - player2.y === 0;
        const left = player1.x - player2.x === -1 && player1.y - player2.y === 0;

        return top || bottom || right || left;
    }

    /**
     * Fonction qui permet de générer la grille
     * @param moveCoordinates
     */
    createGrid(moveCoordinates) {
        const game = document.querySelector('#game');
        let tbody = ''
        for (let y = 0; y < this.nbRows; y++) {
            tbody += '<tr>'
            for (let x = 0; x < this.nbCols; x++) {
                if (this.cellHasElement(x, y, this.obstacles)) {
                    tbody += '<td class="obstacle" data-x="' + x + '" data-y="' + y + '"></td>'
                } else if (this.cellHasElement(x, y, this.weapons)) {
                    let weapon = this.cellHasElement(x, y, this.weapons)
                    // Si la case possède une arme ET un joueur
                    if (this.cellHasElement(x, y, this.players)) {
                        const player = this.cellHasElement(x, y, this.players)
                        const activeClass = player.active ? 'active' : ''
                        tbody += '<td class="weapon player ' + activeClass + '" data-x="' + x + '" data-y="' + y + '">' +
                            '<div class="weapon-player">' +
                            '<div class="case-player">' +
                            '<img src="' + player.image + '" ' + ' data-x="' + x + '" data-y="' + y + '">' +
                            '<img src="' + player.weapon.image + '" ' + ' data-x="' + x + '" data-y="' + y + '">' +
                            '</div>' +
                            '<img class="case-weapon" src="' + weapon.image + '" ' + ' data-x="' + x + '" data-y="' + y + '">' +
                            '</div>' +
                            '</td>'

                    } else {
                        tbody += '<td class="weapon" data-x="' + x + '" data-y="' + y + '">' +
                            '<img src="' + weapon.image + '" ' + ' data-x="' + x + '" data-y="' + y + '">' +
                            '</td>'
                    }

                } else if (this.cellHasElement(x, y, this.players)) {
                    const player = this.cellHasElement(x, y, this.players)
                    if (player.active) {
                        tbody += '<td class="player active" data-x="' + x + '" data-y="' + y + '">' +
                            '<img src="' + player.image + '" width="50">' +
                            '<img class="player-weapon" src="' + player.weapon.image + '">' +
                            '</td>'
                    } else {
                        tbody += '<td class="player" data-x="' + x + '" data-y="' + y + '">' +
                            '<img src="' + player.image + '" width="50">' +
                            '<img class="player-weapon" src="' + player.weapon.image + '">' +
                            '</td>'
                    }
                } else {
                    tbody += '<td data-x="' + x + '" data-y="' + y + '"></td>'
                }
            }
            tbody += '</tr>'
        }

        const combatClass = this.combat ? 'combat' : '';
        game.innerHTML = '<table class="' + combatClass + '"><tbody>' + tbody + '</tbody></table>';

        /**
         * Pour chaque case sur laquelle le joueur peut se déplacer, on active l'évènement click sur la case
         */
        for (let i = 0; i < moveCoordinates.length; i++) {
            const td = document.querySelector('td[data-x="' + moveCoordinates[i].x + '"][data-y="' + moveCoordinates[i].y + '"]')
            if (td) {
                td.classList.add('movable')
                /**
                 * Lorsqu'un évènement click se produit sur la case, on déplace le joueur
                 */
                td.addEventListener('click', (e) => {
                    this.moveActivePlayer(e.target.dataset.x, e.target.dataset.y)
                })
            }
        }

        this.drawPlayerCards()
    }

    /**
     * Redessiner les cartes des joueurs et des armes correspondantes
     */
    drawPlayerCards(recreateEvents = true) {
        const player1CardWeapon = document.querySelector('#player-cards #player1 .weapon');
        const player2CardWeapon = document.querySelector('#player-cards #player2 .weapon');
        const player1Image = document.querySelector('#player-cards #player1 .player-logo');
        const player2Image = document.querySelector('#player-cards #player2 .player-logo');
        const buttonAttaquerPlayer1 = document.querySelector('#player-cards #player1 #player1-attaquer');
        const buttonDefendrePlayer1 = document.querySelector('#player-cards #player1 #player1-defendre');
        const buttonAttaquerPlayer2 = document.querySelector('#player-cards #player2 #player2-attaquer');
        const buttonDefendrePlayer2 = document.querySelector('#player-cards #player2 #player2-defendre');


        player1Image.setAttribute('src', this.players[0].image)
        player2Image.setAttribute('src', this.players[1].image)

        player1CardWeapon.innerHTML = `
            <img src="${this.players[0].weapon.image}" width="100"/>
            Degat: ${this.players[0].weapon.degat} / Points: ${this.players[0].points <= 0 ? 0 : this.players[0].points}
        `

        player2CardWeapon.innerHTML = `
            <img src="${this.players[1].weapon.image}" width="100"/>
            Degat: ${this.players[1].weapon.degat} / Points: ${this.players[1].points <= 0 ? 0 : this.players[1].points}          
        `

        if (this.combat && recreateEvents) {

            this.tourParTour()

            /* On rend actif nos boutons en ajoutant un évènement click */

            buttonAttaquerPlayer1.addEventListener('click', () => {
                this.joueurAttaquer(this.players[0], this.players[1])
            })

            buttonDefendrePlayer1.addEventListener('click', () => {
                this.joueurDefendre(this.players[0], this.players[1])
            })

            buttonAttaquerPlayer2.addEventListener('click', () => {
                this.joueurAttaquer(this.players[1], this.players[0])
            })

            buttonDefendrePlayer2.addEventListener('click', () => {
                this.joueurDefendre(this.players[1], this.players[0])
            })

        }
    }

    /**
     * Fonction qui est appelée lorsqu'un joueur décide d'attaquer
     * On calcule les points attribués à l'autre joueur
     * @param joueurEnCours
     * @param autreJoueur
     */
    joueurAttaquer(joueurEnCours, autreJoueur){
        if (autreJoueur.defendre) {
            autreJoueur.points -= (joueurEnCours.weapon.degat / 2)
            autreJoueur.defendre = false;
        } else {
            autreJoueur.points -= joueurEnCours.weapon.degat
        }
        if (autreJoueur.points <= 0) {
            this.endGame(0)
        }
        joueurEnCours.active = false;
        autreJoueur.active = true;
        this.tourParTour()
        this.drawPlayerCards(false)
    }

    /**
     * Fonction qui est appelée lorsqu'un joueur décide de défendre
     * On active le booléen "défendre" sur le joueur en cours
     * @param joueurEnCours
     * @param autreJoueur
     */
    joueurDefendre(joueurEnCours, autreJoueur){
        joueurEnCours.defendre = true;
        autreJoueur.active = true;
        joueurEnCours.active = false;
        this.tourParTour()
        this.drawPlayerCards(false)
    }

    /**
     * Permet d'activer ou de désactiver les actions des joueurs dans les cartes à droite
     */
    tourParTour() {
        const actionsPlayer1 = document.querySelector('#player-cards #player1 .actions');
        const actionsPlayer2 = document.querySelector('#player-cards #player2 .actions');
        if (this.players[0].active) {
            actionsPlayer1.style.display = 'flex';
            actionsPlayer2.style.display = 'none';
        } else if (this.players[1].active) {
            actionsPlayer1.style.display = 'none';
            actionsPlayer2.style.display = 'flex';
        }
    }

    /**
     * Permet de déclencher la fin de partie (modale + bouton recommencer)
     * @param playerWinnerIndex
     */
    endGame(playerWinnerIndex) {
        const modal = document.querySelector('.modal-container')
        const winnerText = modal.querySelector('#winner');
        const button = modal.querySelector('button')
        winnerText.textContent = playerWinnerIndex === 0 ? '1' : '2'
        modal.style.display = 'block';

        button.addEventListener('click', this.reload)
    }

    /**
     * Permet de rafraichir la page et de relancer une partie
     */
    reload() {
        window.location.reload()
    }

    /**
     * Permet de changer la main d'un joueur à l'autre à chaque tour
     * @param index
     */
    setActivePlayer(index){
        for(let i = 0; i < this.players.length; i++){
            this.players[i].active = false;
            if(i === index){
                this.players[i].active = true;
            }
        }
    }

}
