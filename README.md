proj1
=====

Project 1

Design Challenges
=================
where should the state be maintained? by board or by life?

if by board, then could reuse it for a checkers game more easily
have life be separate and make calls to the board that reflect the
rules of the game
could easily do the same for checkers game without having to rebuild the way the board and the graphics work much

have board encapsulate all the drawing stuff so that life can just
focus on the game rules

iterating over all the board elements happened pretty frequently so abstracted it

===
put all of state handling logic in Life and then have only the view handled in Board?
sounds like good use of MVC, b