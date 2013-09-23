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


	3. I wanted my feature to modify the rules to make a statement about life (that peace > war), but I wasn't sure what the cleanest way was to apply different rules based on the current mode.
		On one hand, you could have one function that applies the rules in every mode. This could be either by having a lot of if statements to check the mode and apply the corresponding rules, or by coming up with some complex mathematical or logical way of expressing all the rules in one long expression. Another way which came to mind was to just have a separate method for each set of rules. This approach could seem redundant because the basic if/else statements for number of neighbors would be repeated. However, it has the advantage of being a lot cleaner and a lot easier to read and understand. Moreover, it meant if I wanted to change the how the rules were applied for a single mode, I could do so without worrying about affecting any of the others. Since I hadn't worked out exactly how I wanted to modify the rules yet for peace and for war, and I wanted it to be clear to readers which rules went with which mode, I decided that a separate method for each was the best approach.


Notes on Design
===============
	Board is an abstraction for a general game board that maintains the state of the board
	and provides functions for 
	1. checking the state (count_occupied_neighbors, etc.) 
	2. modifying that state (add/remove/reset, etc.)

	Life is an abstraction for the rules of the game of life. It takes a Board object to play the game on, and in each generation it reads the state of the board, applies the rules to determine the next generation, and updates the board with the next generation.

	DrawableGrid is an abstraction for a view that is actually drawn on the webpage. It uses a table to represent the grid and allows the caller to set one of four colors on any given cell.

	The models (board and life) and view (drawablegrid) are connected through setup.js, which acts as a controller and sets the appropriate listeners of one object on another. The Board and DrawableGrid both accept listeners on certain events, which helps decouple the model from the view.


Notes on the Special Feature
============================
	My feature is the option to change the rules of the game to one of two different variations: War and Peace.

	In each variation, the the traditional unified game board is partitioned into 4 cities of different colors based on the 4 quadrants of the board.
	These colors are then applied, and the game proceeds as follows.
		WAR: This variation simulates 4 cities at war. A live cell must have exactly 2 or 3 neighboring cells of the same color in order to live; however, if it has at least 4 neighbors of any other color, it will die as if by war. A dead cell with exactly three neighbors will come to life, and its color will be that of the majority of its neighbors.

		PEACE: This variation simulates 4 cities at peace with each other that intermingle. A live cell must have exactly 2 or 3 neighbors of any color in order to live. A dead cell with exactly three neighbors will come to life, and its color will be a function of the colors of its neighbors, to simulate the intermingling.


Notes on Usage
==============
	The game may be played or paused to stop and resume it at its current state. The Clear button will clear the game board, pause the game, and maintain the current game rules being used. Similarly, Randomize will clear the board and re-populate it with a random initial state, honoring the current rules being used. The button on the far right has a dropdown from which the rules you want to use can be selected. When a rule is selected, it is immediately applied to the current generation, so that it changes the colors of the current cells without resetting the game. Cells on the grid may be clicked to set that cell alive. The color of the cell that you click depends on what rules you are using: if in normal mode, any clicked cell will be red; if in peace/war mode, the color depends on the quadrant of the cell.



Notable Changes from the First Iteration
========================================
	The model and view are now decoupled, and the Board is now a more pure data abstraction that could be reused for a game of checkers or something of the sort. Life can apply a few different rules (normal/peace/war). DrawableGrid is a completely new function that handles the representation of the board as a grid made of DOM elements on the page.