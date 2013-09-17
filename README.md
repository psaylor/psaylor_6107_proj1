Project 1 is live at http://psaylor.scripts.mit.edu/gol/

Third-party code citations:
	Bootstrap: http://getbootstrap.com/getting-started/#download
	JQuery: http://jquery.com/download/
	JUnit: http://qunitjs.com/

Design Challenges
=================
1. Should there be one object that handles everything, or should the game board be separate from the game rules?
	If one object handles everything, then the question of who maintains the state (discussed next) disappears, which is one advantage. It also avoids the challenge of creating a meaningful interaction between the two other objects. However, the board and the rules are distinct notions and can very intuitively be separated. In terms of reusability, it would be better to have a board representation that I could reuse later to make a checkers game, and similarly if the rules are abstracted away from the board, then any abstract board could be used to create a different looking or better-performing game. Moreover, this follows the paradigm of separation of concerns, since the board doesn't have to worry about what game is being played on it or what the rules are. Thus I decided to make separate abstractions for a board (board.js) and the game rules (life.js).

2. Since the game board and the game rules are separated, where should the state of the game be maintained? By board.js or by life.js?
	Applying the rules requires detailed knowledge of the state of the board, so if life.js maintains the state, then it has direct access to all those details; otherwise, board.js needs to have a way to expose its state to other objects. If the board maintains the state, then the board could easily be reused for other games without each game having to re-implement how the state should be represented. Since this seemed like a better general purpose solution, I had board.js maintain the state of the game.

Notes on Design
===============
Board is an abstraction for the life game board that maintains the state of the board
and provides functions for 
1. checking the state (count_occupied_neighbors, etc.) 
2. modifying that state (add/remove/reset, etc.)
3. visually representing that state
The state of the board will be visually represented on the provided pad.

Life is an abstraction for the rules of the game of life. It takes a Board object to play the game on, and in each generation it reads the state of the board, applies the rules to determine the next generation, and updates the board with the next generation.sec