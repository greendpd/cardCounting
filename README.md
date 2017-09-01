# cardCounting
9/1, 16:05
Got most endpoints working
Need to check deleteHistory.sql to make sure that it will delete games, despite the foreign keys
Removed bogus endpoints

9/1, 13:58
Got it to write the correct date into sql tables
Still need to create the files in folder ./db


9/1, 11:52
Corrected so you can't double if dealt a blackjack
Can still stand
Need to update so if it's a blackjack, it automatically increments the player

8/31, 12:20
Fixed bugs in gameSrvc
Added a post-game call to server with game data
Added an endpoint in server for game data
Also added test endpoints that can be removed later, as well as test db files in db folder


8/30, 04:03
Corrected cardValue function in gameSrvc
Can no longer keep standing

8/30, 03:44
Bet values are added and subtracted correctly
Need to update game end so that you can't keep standing...

8/30, 00:24
Made deck shuffle before dealing any cards
Displaying cards on the freestyle controller


8/29, 17:19
Added dealer into the game. Adding chart moves to check on compliance.
Added function documentation to gameSrvc
Need to store data on chart compliance

8/29, 14:53
The controllers for managing the deck and game are complete. Now, views.

8/29, 12:45
added services to handle the logic
Still need to resolve the game, and get it displaying

All views accounted for, skeleton is complete except for any services
Each html endpoint is working
