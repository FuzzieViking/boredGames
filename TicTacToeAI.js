/**
 *  Build a reversi table and handle the events.
 *  To save space: 0 = empty, 1 = black, 2 = white
 *
 *  @author Jerry Middlemiss
 *  @copyright (c) Jerry Middlemiss
 *  @link http://www.jerrybear.com
 *  @since 05/12/2003
 *  @version 2.0
 *  @see Reversi
 *  Here are the algorithms that all levels use:
 *  position : each space on the board has an inherint value
 *  mobility : how many moves would be available after this move
 *  stability : how many empty spots are near the piece (empty spots can take that one over)
 *  damage : the most pieces the enemy can take after that move
 *
 *  easy level just calculates position and damage on the current board
 *  medium calculates mobility and stability, but only goes 5 levels deep and makes some adjustments for corner/sides
 *  hard calculates mobility and stability and goes 9 deep  and makes some adjustments for corner/sides
        hard_moves_1:
        {
            corner: ['corner', 'corner', 'win'],
            edge: ['center',
                    {
                        block: ['block', 'tie'],
                        other: ['corner', 'win']
                    }
                   ],
            center: ['kitty',
                    {
                        corner: ['corner', 'win'],
                        edge: ['block', 'tie']
                    }
                    ]
        },
        hard_moves_2:
        {
            center: ['corner', 'corner', 'tie'],
            other: ['center',
                    {
                        corners: ['edge', 'tie'],
                        corner_edges: ['corner', 'tie'],
                        edges: ['edge', 'corner one x', 'win'],
                        other: ['caddy', 'tie']
                    }
                   ]
        },
HARD X
           Play an X to any corner square. Your choice!
Then follow the strategy below after O's turn.

O Plays to a Corner Square
X to either of the remaining open corner squares.
Once O blocks, X the only remaining corner square.
Make three X's in a row on your next turn.

O Plays to an Edge Square
X the center square.
O must block your threatened win.

Then two Scenarios will arise:
Block O's threatened win, if applicable, or
X the corner square not bordered by an O.
Make three X's in a row on your next turn.

O Plays to the Center Square
X the square caddy-corner from your original X.

Then two Scenarios will arise:
O plays to a corner square.
X the only open corner square. Win next move.

O plays second move to an edge square (draw):
Block O's threatened win. Block and draw.




HARD O

X has played to a non-center square.
Play your O to the Center Square.
Then follow the strategy below after X's turn.

One X on a Corner, the other on an Edge
O the corner square caddy-corner to the corner X.
Block or play to any square to draw.

Both X's are on Edge Squares
When both X's border a corner square (draw):
O the corner square bordered by the two X's.
X must block your threatened win.
O any square. Block and draw.

When both X's don't border a corner (O wins!):
O either of the remaining open edge squares.
X must block your threatened win.
O either corner square bordered by only one X.
Win on your next move. Amazing!

Both X's on Corner Squares
O any open edge square.
X must block your threatened win.
Both players block and draw.

Play your O to a Corner Square: If X threatens a win, block and draw. If X does not threaten a win, O a corner square. Block and draw. You're so money and you don't even know it. Thou art master of thy domain.

 */
function TicTacToeAI(theType)
{
    var ai =
    {
        name: 'ai',
        version: 0.1,
        type: theType,
        current_turn: 0,
        enemy: 0,
        enemy_moves: [],
        move_count: 0,
        hard_path: null,
        piece:
        {
            row: null,
            col: null
        },
        board: [],
        move: function (theGame)
        {
            var ai = this;
            ai.board = [];
            for (var i = 0; i < theGame.board.length; i++)
            {
                ai.board[i] = [];
                for (var j = 0; j < theGame.board[i].length; j++)
                {   ai.board[i][j] = theGame.board[i][j];    }
            }
            ai.current_turn = theGame.current_turn;
            ai.enemy = (theGame.current_turn == 1) ? 2 : 1;
            ai.piece =
            {
                row: null,
                col: null
            };
            switch (ai.type)
            {
                case ('hard') : ai.moveHard(theGame); break;
                case ('easy') :
                default: ai.moveEasy(theGame); break;
            }
            return ai.piece;
        },

       /**
        *   This works very simply.  Get all available moves and pick one at random.
        **/
        moveEasy: function (theGame)
        {
            var ai = this;
            if (!ai.canWin() && !ai.canBlock())
            {
               //now Get scores for all the possible moves
                var all_moves = [];
                for (var rowIndex = 0; rowIndex < theGame.board.length; rowIndex++)
                {
                    for (var colIndex = 0; colIndex < theGame.board[rowIndex].length; colIndex++)
                    {
                        if (theGame.board[rowIndex][colIndex] == 0)
                        {
                            all_moves[all_moves.length] =
                            {
                                row: rowIndex,
                                col: colIndex
                            };
                        }
                    }
                }//end rows
               //Grab 1 at random from all returned results
                if (all_moves.length > 0)
                {   ai.piece = all_moves[Math.round(Math.random() * (all_moves.length - 1))];    }
            }
        },

       /**
        *   Hard calculates position,mobility,damage,stability
        **/
        moveHard: function (theGame)
        {
            var ai = this;
            ai.move_count++;
           //x strategies
            if (ai.current_turn == 1)
            {
               //first move just picks a random corner
                if (ai.move_count == 1)
                {
                    var all_moves = [{ row: 0, col: 0 },
                                     { row: 0, col: 2 },
                                     { row: 2, col: 0 },
                                     { row: 2, col: 2 }];
                    ai.piece = all_moves[Math.round(Math.random() * (all_moves.length - 1))];
                }
               //second move
                else if (ai.move_count == 2)
                {
                    var enemy_move = null;
                   //Is this the first move?
                    for (var rowIndex = 0; rowIndex < theGame.board.length; rowIndex++)
                    {
                        for (var colIndex = 0; colIndex < theGame.board[rowIndex].length; colIndex++)
                        {
                            if (theGame.board[rowIndex][colIndex] == ai.enemy)
                            {
                                enemy_move = { row: rowIndex, col: colIndex };
                                ai.enemy_moves[ai.enemy_moves.length] = enemy_move;
                                break;
                            }
                        }
                        if (enemy_move)
                        {   break;    }
                    }
                   //O Plays to a Corner Square
                    if ((enemy_move.row == 0 && (enemy_move.col == 0 || enemy_move.col == 2)) ||
                        (enemy_move.row == 2 && (enemy_move.col == 0 || enemy_move.col == 2)))
                    {
                        ai.hard_path = 'corner';
                        var all_moves = [];
                        if (ai.board[0][0] == 0)
                        {   all_moves[all_moves.length] = { row: 0, col: 0 };    }
                        if (ai.board[0][2] == 0)
                        {   all_moves[all_moves.length] = { row: 0, col: 2 };    }
                        if (ai.board[2][0] == 0)
                        {   all_moves[all_moves.length] = { row: 2, col: 0 };    }
                        if (ai.board[2][2] == 0)
                        {   all_moves[all_moves.length] = { row: 2, col: 2 };    }
                        ai.piece = all_moves[Math.round(Math.random() * (all_moves.length - 1))];
                    }
                   //O plays middle
                    else if (enemy_move.row == 1 && enemy_move.col == 1)
                    {
                        ai.hard_path = 'center';
                        if (ai.board[0][0] == ai.current_turn)
                        {   ai.piece = { row: 2, col: 2 };    }
                        else if (ai.board[0][2] == ai.current_turn)
                        {   ai.piece = { row: 2, col: 0 };    }
                        else if (ai.board[2][0] == ai.current_turn)
                        {   ai.piece = { row: 0, col: 2 };    }
                        else if (ai.board[2][2] == ai.current_turn)
                        {   ai.piece = { row: 0, col: 0 };    }
                    }
                   //O plays edge then
                    else
                    {
                        ai.hard_path = 'edge';
                        ai.piece = { row: 1, col: 1 };
                    }
                }
               //Else we follow the script from hard_moves_1
                else
                {
                    if (!ai.canWin() && !ai.canBlock())
                    {
                       //Move after this wins!
                        if (ai.hard_path == 'corner' || ai.hard_path == 'center')
                        {
                            if (ai.board[0][0] == 0)
                            {   ai.piece = { row: 0, col: 0 };    }
                            else if (ai.board[0][2] == 0)
                            {   ai.piece = { row: 0, col: 2 };    }
                            else if (ai.board[2][0] == 0)
                            {   ai.piece = { row: 2, col: 0 };    }
                            else if (ai.board[2][2] == 0)
                            {   ai.piece = { row: 2, col: 2 };    }
                        }
                       //If we haven't blocked automatically we don't need to, next move wins!
                        else if (ai.hard_path == 'edge')
                        {
                            if (ai.board[0][0] == 0 && ai.board[0][1] == 0 && ai.board[1][0] == 0)
                            {   ai.piece = { row: 0, col: 0 };    }
                            else if (ai.board[0][2] == 0 && ai.board[0][1] == 0 && ai.board[1][2] == 0)
                            {   ai.piece = { row: 0, col: 2 };    }
                            else if (ai.board[2][0] == 0 && ai.board[1][0] == 0 && ai.board[2][1] == 0)
                            {   ai.piece = { row: 2, col: 0 };    }
                            else
                            {   ai.piece = { row: 2, col: 2 };    }
                        }
                    }
                }
            }
           //o strategies
            else
            {
                var enemy_move = null;
               //Is this the first move?
                for (var rowIndex = 0; rowIndex < theGame.board.length; rowIndex++)
                {
                    for (var colIndex = 0; colIndex < theGame.board[rowIndex].length; colIndex++)
                    {
                        if (theGame.board[rowIndex][colIndex] == ai.enemy)
                        {
                            var found = false;
                            for (var i = 0; i < ai.enemy_moves.length; i++)
                            {
                                if (ai.enemy_moves[i].row == rowIndex && ai.enemy_moves[i].col == colIndex)
                                {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found)
                            {
                                enemy_move = { row: rowIndex, col: colIndex };
                                ai.enemy_moves[ai.enemy_moves.length] = enemy_move;
                                break;
                            }
                        }
                    }
                    if (enemy_move)
                    {   break;    }
                }
               //first move just picks a random corner
                if (ai.move_count == 1)
                {
                    if (enemy_move.row == 1 && enemy_move.col == 1)
                    {
                        ai.hard_path = 'center';
                        var all_moves = [{ row: 0, col: 0 },
                                         { row: 0, col: 2 },
                                         { row: 2, col: 0 },
                                         { row: 2, col: 2 }];
                        ai.piece = all_moves[Math.round(Math.random() * (all_moves.length - 1))];
                    }
                    else
                    {
                        ai.hard_path = 'other';
                        ai.piece = { row: 1, col: 1 };
                    }
                }
                else if (ai.move_count == 2)
                {
                    if (!ai.canWin() && !ai.canBlock())
                    {
                        if (ai.hard_path == 'center')
                        {
                            if (ai.board[0][0] == 0)
                            {   ai.piece = { row: 0, col: 0 };    }
                            else if (ai.board[0][2] == 0)
                            {   ai.piece = { row: 0, col: 2 };    }
                            else if (ai.board[2][0] == 0)
                            {   ai.piece = { row: 2, col: 0 };    }
                            else if (ai.board[2][2] == 0)
                            {   ai.piece = { row: 2, col: 2 };    }
                        }
                        else
                        {
                            if (((enemy_move.row == 0 && enemy_move.col == 0) ||
                                 (enemy_move.row == 0 && enemy_move.col == 2) ||
                                 (enemy_move.row == 2 && enemy_move.col == 0) ||
                                 (enemy_move.row == 2 && enemy_move.col == 2)) &&
                                ((ai.enemy_moves[0].row == 0 && ai.enemy_moves[0].col == 0) ||
                                 (ai.enemy_moves[0].row == 0 && ai.enemy_moves[0].col == 2) ||
                                 (ai.enemy_moves[0].row == 2 && ai.enemy_moves[0].col == 0) ||
                                 (ai.enemy_moves[0].row == 2 && ai.enemy_moves[0].col == 2)))
                            {
                                ai.hard_path = 'corners';
                                var all_moves = [{ row: 0, col: 1 },
                                                 { row: 1, col: 0 },
                                                 { row: 1, col: 2 },
                                                 { row: 2, col: 1 }];
                                ai.piece = all_moves[Math.round(Math.random() * (all_moves.length - 1))];
                            }
                            else if ((ai.board[0][1] == ai.enemy && ai.board[1][0] == ai.enemy) ||
                                     (ai.board[0][1] == ai.enemy && ai.board[1][2] == ai.enemy) ||
                                     (ai.board[1][0] == ai.enemy && ai.board[2][1] == ai.enemy) ||
                                     (ai.board[1][2] == ai.enemy && ai.board[2][1] == ai.enemy))
                            {
                                ai.hard_path = 'corner_edges';
                                if (ai.board[0][1] == ai.enemy && ai.board[1][0] == ai.enemy)
                                {   ai.piece = { row: 0, col: 0 };    }
                                if (ai.board[0][1] == ai.enemy && ai.board[1][2] == ai.enemy)
                                {   ai.piece = { row: 0, col: 2 };    }
                                if (ai.board[1][0] == ai.enemy && ai.board[2][1] == ai.enemy)
                                {   ai.piece = { row: 2, col: 0 };    }
                                if (ai.board[1][2] == ai.enemy && ai.board[2][1] == ai.enemy)
                                {   ai.piece = { row: 2, col: 2 };    }
                            }
                            else if (((enemy_move.row == 0 && enemy_move.col == 1) ||
                                      (enemy_move.row == 1 && enemy_move.col == 0) ||
                                      (enemy_move.row == 1 && enemy_move.col == 2) ||
                                      (enemy_move.row == 2 && enemy_move.col == 1)) &&
                                     ((ai.enemy_moves[0].row == 0 && ai.enemy_moves[0].col == 1) ||
                                      (ai.enemy_moves[0].row == 1 && ai.enemy_moves[0].col == 0) ||
                                      (ai.enemy_moves[0].row == 1 && ai.enemy_moves[0].col == 2) ||
                                      (ai.enemy_moves[0].row == 2 && ai.enemy_moves[0].col == 1)))
                            {
                                ai.hard_path = 'edges';
                                var all_moves = [];
                                if (ai.board[0][1] == 0)
                                {   all_moves[all_moves.length] = { row: 0, col: 1 };    }
                                if (ai.board[1][0] == 0)
                                {   all_moves[all_moves.length] = { row: 1, col: 0 };    }
                                if (ai.board[1][2] == 0)
                                {   all_moves[all_moves.length] = { row: 1, col: 2 };    }
                                if (ai.board[2][1] == 0)
                                {   all_moves[all_moves.length] = { row: 2, col: 1 };    }
                                ai.piece = all_moves[Math.round(Math.random() * (all_moves.length - 1))];
                            }
                            else
                            {
                                ai.hard_path = 'other';
                                if (ai.board[0][0] == ai.enemy)
                                {   ai.piece = { row: 2, col: 2 };    }
                                if (ai.board[0][2] == ai.enemy)
                                {   ai.piece = { row: 2, col: 0 };    }
                                if (ai.board[2][0] == ai.enemy)
                                {   ai.piece = { row: 0, col: 2 };    }
                                if (ai.board[2][2] == ai.enemy)
                                {   ai.piece = { row: 0, col: 0 };    }
                            }
                        }
                    }
                }
                else
                {
                    if (!ai.canWin() && !ai.canBlock())
                    {
                        if (ai.hard_path == 'edges')
                        {
                            if (ai.board[0][0] == 0 && (ai.board[0][1] != ai.enemy || ai.board[1][0] != ai.enemy))
                            {   ai.piece = { row: 0, col: 0 };    }
                            else if (ai.board[0][2] == 0 && (ai.board[0][1] != ai.enemy || ai.board[1][2] != ai.enemy))
                            {   ai.piece = { row: 0, col: 2 };    }
                            else if (ai.board[2][0] == 0 && (ai.board[0][1] != ai.enemy || ai.board[2][1] != ai.enemy))
                            {   ai.piece = { row: 2, col: 0 };    }
                            else if (ai.board[2][2] == 0 && (ai.board[1][2] != ai.enemy || ai.board[2][1] != ai.enemy))
                            {   ai.piece = { row: 2, col: 2 };    }
                        }
                        else
                        {   ai.moveEasy(theGame);    }
                    }
                }
            }
        },

        /**
         *  This runs through the board and makes sure it can't just win
         **/
        canWin: function ()
        {
            var ai = this;
           //first row
            if (ai.board[0][0] == ai.current_turn && ai.board[0][1] == ai.current_turn && ai.board[0][2] == 0)
            {   ai.piece = { row: 0, col: 2 }; return true;    }
            else if (ai.board[0][0] == ai.current_turn && ai.board[0][2] == ai.current_turn && ai.board[0][1] == 0)
            {   ai.piece = { row: 0, col: 1 }; return true;    }
            else if (ai.board[0][1] == ai.current_turn && ai.board[0][2] == ai.current_turn && ai.board[0][0] == 0)
            {   ai.piece = { row: 0, col: 0 }; return true;    }
           //middle row
            else if (ai.board[1][0] == ai.current_turn && ai.board[1][1] == ai.current_turn && ai.board[1][2] == 0)
            {   ai.piece = { row: 1, col: 2 }; return true;    }
            else if (ai.board[1][0] == ai.current_turn && ai.board[1][2] == ai.current_turn && ai.board[1][1] == 0)
            {   ai.piece = { row: 1, col: 1 }; return true;    }
            else if (ai.board[1][1] == ai.current_turn && ai.board[1][2] == ai.current_turn && ai.board[1][0] == 0)
            {   ai.piece = { row: 1, col: 0 }; return true;    }
           //last row
            else if (ai.board[2][0] == ai.current_turn && ai.board[2][1] == ai.current_turn && ai.board[2][2] == 0)
            {   ai.piece = { row: 2, col: 2 }; return true;    }
            else if (ai.board[2][0] == ai.current_turn && ai.board[2][2] == ai.current_turn && ai.board[2][1] == 0)
            {   ai.piece = { row: 2, col: 1 }; return true;    }
            else if (ai.board[2][1] == ai.current_turn && ai.board[2][2] == ai.current_turn && ai.board[2][0] == 0)
            {   ai.piece = { row: 2, col: 0 }; return true;    }
           //first col
            else if (ai.board[0][0] == ai.current_turn && ai.board[1][0] == ai.current_turn && ai.board[2][0] == 0)
            {   ai.piece = { row: 2, col: 0 }; return true;    }
            else if (ai.board[0][0] == ai.current_turn && ai.board[2][0] == ai.current_turn && ai.board[1][0] == 0)
            {   ai.piece = { row: 1, col: 0 }; return true;    }
            else if (ai.board[1][0] == ai.current_turn && ai.board[2][0] == ai.current_turn && ai.board[0][0] == 0)
            {   ai.piece = { row: 0, col: 0 }; return true;    }
           //middle column
            else if (ai.board[0][1] == ai.current_turn && ai.board[1][1] == ai.current_turn && ai.board[2][1] == 0)
            {   ai.piece = { row: 2, col: 1 }; return true;    }
            else if (ai.board[0][1] == ai.current_turn && ai.board[2][1] == ai.current_turn && ai.board[1][1] == 0)
            {   ai.piece = { row: 1, col: 1 }; return true;    }
            else if (ai.board[1][1] == ai.current_turn && ai.board[2][1] == ai.current_turn && ai.board[0][1] == 0)
            {   ai.piece = { row: 0, col: 1 }; return true;    }
           //last col
            else if (ai.board[0][2] == ai.current_turn && ai.board[1][2] == ai.current_turn && ai.board[2][2] == 0)
            {   ai.piece = { row: 2, col: 2 }; return true;    }
            else if (ai.board[0][2] == ai.current_turn && ai.board[2][2] == ai.current_turn && ai.board[1][2] == 0)
            {   ai.piece = { row: 1, col: 2 }; return true;    }
            else if (ai.board[1][2] == ai.current_turn && ai.board[2][2] == ai.current_turn && ai.board[0][2] == 0)
            {   ai.piece = { row: 0, col: 2 }; return true;    }
           //diagonal down
            else if (ai.board[0][0] == ai.current_turn && ai.board[1][1] == ai.current_turn && ai.board[2][2] == 0)
            {   ai.piece = { row: 2, col: 2 }; return true;    }
            else if (ai.board[0][0] == ai.current_turn && ai.board[2][2] == ai.current_turn && ai.board[1][1] == 0)
            {   ai.piece = { row: 1, col: 1 }; return true;    }
            else if (ai.board[2][2] == ai.current_turn && ai.board[1][1] == ai.current_turn && ai.board[0][0] == 0)
            {   ai.piece = { row: 0, col: 0 }; return true;    }
           //diagonal up
            else if (ai.board[0][2] == ai.current_turn && ai.board[1][1] == ai.current_turn && ai.board[2][0] == 0)
            {   ai.piece = { row: 2, col: 0 }; return true;    }
            else if (ai.board[0][2] == ai.current_turn && ai.board[2][0] == ai.current_turn && ai.board[1][1] == 0)
            {   ai.piece = { row: 1, col: 1 }; return true;    }
            else if (ai.board[2][0] == ai.current_turn && ai.board[1][1] == ai.current_turn && ai.board[0][2] == 0)
            {   ai.piece = { row: 0, col: 2 }; return true;    }
            return false;
        },

        /**
         *  This runs through the board and makes sure it doesn't have to block
         **/
        canBlock: function ()
        {
            var ai = this;
           //first row
            if (ai.board[0][0] == ai.enemy && ai.board[0][1] == ai.enemy && ai.board[0][2] == 0)
            {   ai.piece = { row: 0, col: 2 }; return true;    }
            else if (ai.board[0][0] == ai.enemy && ai.board[0][2] == ai.enemy && ai.board[0][1] == 0)
            {   ai.piece = { row: 0, col: 1 }; return true;    }
            else if (ai.board[0][1] == ai.enemy && ai.board[0][2] == ai.enemy && ai.board[0][0] == 0)
            {   ai.piece = { row: 0, col: 0 }; return true;    }
           //middle row
            else if (ai.board[1][0] == ai.enemy && ai.board[1][1] == ai.enemy && ai.board[1][2] == 0)
            {   ai.piece = { row: 1, col: 2 }; return true;    }
            else if (ai.board[1][0] == ai.enemy && ai.board[1][2] == ai.enemy && ai.board[1][1] == 0)
            {   ai.piece = { row: 1, col: 1 }; return true;    }
            else if (ai.board[1][1] == ai.enemy && ai.board[1][2] == ai.enemy && ai.board[1][0] == 0)
            {   ai.piece = { row: 1, col: 0 }; return true;    }
           //last row
            else if (ai.board[2][0] == ai.enemy && ai.board[2][1] == ai.enemy && ai.board[2][2] == 0)
            {   ai.piece = { row: 2, col: 2 }; return true;    }
            else if (ai.board[2][0] == ai.enemy && ai.board[2][2] == ai.enemy && ai.board[2][1] == 0)
            {   ai.piece = { row: 2, col: 1 }; return true;    }
            else if (ai.board[2][1] == ai.enemy && ai.board[2][2] == ai.enemy && ai.board[2][0] == 0)
            {   ai.piece = { row: 2, col: 0 }; return true;    }
           //first col
            else if (ai.board[0][0] == ai.enemy && ai.board[1][0] == ai.enemy && ai.board[2][0] == 0)
            {   ai.piece = { row: 2, col: 0 }; return true;    }
            else if (ai.board[0][0] == ai.enemy && ai.board[2][0] == ai.enemy && ai.board[1][0] == 0)
            {   ai.piece = { row: 1, col: 0 }; return true;    }
            else if (ai.board[1][0] == ai.enemy && ai.board[2][0] == ai.enemy && ai.board[0][0] == 0)
            {   ai.piece = { row: 0, col: 0 }; return true;    }
           //middle column
            else if (ai.board[0][1] == ai.enemy && ai.board[1][1] == ai.enemy && ai.board[2][1] == 0)
            {   ai.piece = { row: 2, col: 1 }; return true;    }
            else if (ai.board[0][1] == ai.enemy && ai.board[2][1] == ai.enemy && ai.board[1][1] == 0)
            {   ai.piece = { row: 1, col: 1 }; return true;    }
            else if (ai.board[1][1] == ai.enemy && ai.board[2][1] == ai.enemy && ai.board[0][1] == 0)
            {   ai.piece = { row: 0, col: 1 }; return true;    }
           //last col
            else if (ai.board[0][2] == ai.enemy && ai.board[1][2] == ai.enemy && ai.board[2][2] == 0)
            {   ai.piece = { row: 2, col: 2 }; return true;    }
            else if (ai.board[0][2] == ai.enemy && ai.board[2][2] == ai.enemy && ai.board[1][2] == 0)
            {   ai.piece = { row: 1, col: 2 }; return true;    }
            else if (ai.board[1][2] == ai.enemy && ai.board[2][2] == ai.enemy && ai.board[0][2] == 0)
            {   ai.piece = { row: 0, col: 2 }; return true;    }
           //diagonal down
            else if (ai.board[0][0] == ai.enemy && ai.board[1][1] == ai.enemy && ai.board[2][2] == 0)
            {   ai.piece = { row: 2, col: 2 }; return true;    }
            else if (ai.board[0][0] == ai.enemy && ai.board[2][2] == ai.enemy && ai.board[1][1] == 0)
            {   ai.piece = { row: 1, col: 1 }; return true;    }
            else if (ai.board[2][2] == ai.enemy && ai.board[1][1] == ai.enemy && ai.board[0][0] == 0)
            {   ai.piece = { row: 0, col: 0 }; return true;    }
           //diagonal up
            else if (ai.board[0][2] == ai.enemy && ai.board[1][1] == ai.enemy && ai.board[2][0] == 0)
            {   ai.piece = { row: 2, col: 0 }; return true;    }
            else if (ai.board[0][2] == ai.enemy && ai.board[2][0] == ai.enemy && ai.board[1][1] == 0)
            {   ai.piece = { row: 1, col: 1 }; return true;    }
            else if (ai.board[2][0] == ai.enemy && ai.board[1][1] == ai.enemy && ai.board[0][2] == 0)
            {   ai.piece = { row: 0, col: 2 }; return true;    }
            return false;
        },
    };
    return ai;
}
