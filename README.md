# Plan de soutenance

## Démo complète du jeu (~7min)
* Mettre en avant le dessin du chemin de déplacement et que le click ailleurs ne fait rien
* Penser à changer d'arme
* Chaque joueur doit avoir une arme qui n'est pas celle par défaut
* Se positionner sur une case d'arme mais ne pas la prendre
* Tour par tour: Une fois que le combat a commencé, on peut plus se déplacer sur la grille (layer opaque par dessus la grille) 
* C'est le joueur qui lance le combat qui a la main en 1er
* Montrer les attaques et les défenses. Si le joueur est en défense, 
mettre en évidence la division des dommages par 2 (pour un seul coup)
* Monter que le combat s'arrête quand 1 des deux joueurs arrive à 0
* Modal de fin permettant de recommencer la partie
* Recommencer


## Partie technique (~13min)
* Orienté objet: Tout est classe et objet
* Tous les éléments de la grille: Joueur, Arme et Obstacles sont des classes
* Classe Utils: Permet de récupérer un nombre aléatoire afin de positionner les éléments de la grille
* Point d'entrée de l'application: index.js qui permet d'initialiser la grille et de la configurer
* On peut paramétrer la grille sans toucher de code (conf bien centralisée)
* Le nombre de joueurs n'est pas paramétrable car le tour par tour nécessite 2 joueurs
* Recommencer: provoque le rafraichissement et donc la regénération de la grille
* Faire un tour sur l'ajout des scripts dans le fichier index.html pour expliquer que l'ordre d'ajout des scripts est important:
Exemple: le fichier index.js est importé après Grid.js car instanciation de la classe Grid située dans Grid.js
* Faire un tour sur le style.css
* Montrer les classes simples: Weapon, Player, Obstacle (si une fonction se trouve dans une classe, c'est une méthode)
* Sur les classes simples, commencer par Obstacle qui a juste un constructeur mais pas de méthode à la différence de Player et Weapon
* Grid: Le constructeur est appelé en premier par index.js et permet de dessiner la grille, positionner les obstacles, les armes et les joueurs
* Inspecter la grille pour montrer la génération des lignes et des cellules (avec data-x et data-y sur les cellules qui permettent de garder les coordonnées de chaque cellule)
* La méthode createGrid permet de dessiner (au sens html) la grille
* Parler des cases sur lesquelles le joueur actif peut se déplacer. Présenter la méthode playerMove
* PlayerMove: La méthode calcule et retourne les cases sur lesquelles le joueur actif peut se déplacer
* A partir de ces cases, on ajoute un évènement click sur chaque case pour permettre au joueur de se déplacer + class movable pour la colorer
