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
 */
function ReversiAI(theType)
{
    var ai =
    {
        name: 'ai',
        type: theType,
        current_turn: 0,
        enemy: 0,
        score: 0,
        piece:
        {
            row: null,
            col: null
        },
        nav_rows: [-1,1,0,0,-1,-1,1,1],
        nav_cols: [0,0,-1,1,1,-1,1,-1],
        table_weights:
        [
            [100,-15,  5,  5,  5,  5,-15,100],
            [-15,-15, -5, -5, -5, -5,-15,-15],
            [  5, -5,  0,  0,  0,  0, -5,  5],
            [  5, -5,  0,  0,  0,  0, -5,  5],
            [  5, -5,  0,  0,  0,  0, -5,  5],
            [  5, -5,  0,  0,  0,  0, -5,  5],
            [-15,-15, -5, -5, -5, -5,-15,-15],
            [100,-15,  5,  5,  5,  5,-15,100]
        ],
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
            ai.score = 0;
            ai.piece =
            {
                row: null,
                col: null
            };
            switch (ai.type)
            {
                case ('medium') : ai.moveMedium(theGame); break;
                case ('hard') : ai.moveHard(theGame); break;
                case ('easy') :
                default: ai.moveEasy(theGame); break;
            }
            return ai.piece;
        },

       /**
        *   This works very simply.  Take the # of pieces they will get, and add it to the positions value.
        **/
        moveEasy: function (theGame)
        {
            var ai = this;
           //now Get scores for all the possible moves
            var all_scores = [];
            for (var rowIndex = 0; rowIndex < theGame.board.length; rowIndex++)
            {
                for (var colIndex = 0; colIndex < theGame.board[rowIndex].length; colIndex++)
                {
                    if (theGame.board[rowIndex][colIndex] == 0)
                    {
                        var test = theGame.getPieces(rowIndex,colIndex);
                        if (isSet(test) && test.length > 0)
                        {
                            all_scores[all_scores.length] =
                            {
                                piece:
                                {
                                    row: rowIndex,
                                    col: colIndex
                                },
                                score: test.length
                            };
                        }
                    }
                }
            }//end rows
           //Grab 1 at random from all returned results
            if (all_scores.length > 0)
            {
                var choice = all_scores[Math.round(Math.random() * (all_scores.length - 1))];
                //choice = (choice >= all_scores.length) ? all_scores.length - 1 : choice;
                ai.score = choice.score;
                ai.piece = choice.piece;
            }
        },

       /**
        *   Figure out how many pieces a move will take, then subtract how many the other color can take next move
        **/
        moveMedium: function (theGame)
        {
            var ai = this;
           //now Get scores for all the possible moves
            for (var rowIndex = 0; rowIndex < theGame.board.length; rowIndex++)
            {
                for (var colIndex = 0; colIndex < theGame.board[rowIndex].length; colIndex++)
                {
                    if (theGame.board[rowIndex][colIndex] == 0)
                    {
                        var test = theGame.getPieces(rowIndex,colIndex);
                        if (isSet(test) && test.length > 0)
                        {
                            var rating = test.length * ai.getWeight(rowIndex,colIndex);
                           //for fun we will pick one at random
                            if (ai.score == rating)
                            {    ai.score = ((Math.round(Math.random() * 1)) > 0) ? --ai.score : ai.score;    }
                            if (ai.score == 0 || ai.score < rating)
                            {
                                ai.piece =
                                {
                                    row: rowIndex,
                                    col: colIndex
                                };
                                ai.score = rating;
                            }
                        }
                    }
                }
            }//end rows
        },

       /**
        *   Hard calculates position,mobility,damage,stability
        **/
        moveHard: function (theGame)
        {
            var ai = this;
           //now Get scores for all the possible moves
            for (var rowIndex = 0; rowIndex < theGame.board.length; rowIndex++)
            {
                for (var colIndex = 0; colIndex < theGame.board[rowIndex].length; colIndex++)
                {
                    if (theGame.board[rowIndex][colIndex] == 0)
                    {
                        var test = ai.getPieces(theGame.board, rowIndex, colIndex, theGame.current_turn);
                        //if (!confirm('here! [' + rowIndex + '][' + colIndex + '] [' + theGame.board[rowIndex][colIndex] + '] [' + test + ']')) { return; }
                        if (isSet(test) && test.length > 0)
                        {
                            //if (!confirm('testing [' + rowIndex + '][' + colIndex + ']')) { return; }
                           //We reset each time around because getDamage pretends to make the moves described to see what happens
                            ai.current_turn = theGame.current_turn;
                            ai.enemy = (theGame.current_turn == 1) ? 2 : 1;
                           //now set the test board as if that move occured
                            ai.board = [];
                            for (var i = 0; i < theGame.board.length; i++)
                            {
                                ai.board[i] = [];
                                for (var j = 0; j < theGame.board[i].length; j++)
                                {   ai.board[i][j] = theGame.board[i][j];    }
                            }
                            for (var testIndex = 0; testIndex < test.length; testIndex++)
                            {
                                ai.board[test[testIndex][0]][test[testIndex][1]] = ai.current_turn;//alert(this.board[r][c])
                            }
                            var position = ai.getWeight(rowIndex,colIndex);
                            var stability = ai.getStability(rowIndex,colIndex);
                            var mobility = ai.getMobility();
                            var damage = ai.getDamage(0, ai.board, ai.current_turn);
                            //alert('got it! [' + rowIndex + '] [' + colIndex + '] = [' + damage + ']');
                            var rating = (test.length + position + mobility + stability + damage);
                            //alert('pos [' + position + ']\nsta[' + stability + ']\nmob[' + mobility + ']\ndam[' + damage + ']\nrating[' + rating + ']');
                           //for fun we will pick one at random
                            if (ai.score == rating)
                            {    ai.score = ((Math.round(Math.random() * 1)) > 0) ? --ai.score : ai.score;    }
                           //now score it
                            if (ai.score == 0 || ai.score < rating)
                            {
                                ai.piece =
                                {
                                    row: rowIndex,
                                    col: colIndex
                                };
                                ai.score = rating;
                            }
                           //TAKE ME OUT WHEN DONE! HERE FOR DEBUGGING!
                           //return;
                        }
                    }
                }//end cols
            }//end rows
        },

       /**
        *   This is a function of how few empty spaces there are surrounding their color pieces
        **/
        getStability: function (theRow, theCol)
        {
            var ai = this;
            var s = 0;
            for (var srowIndex = 0; srowIndex < 8; srowIndex++)
            {
                for (var scolIndex = 0; scolIndex < 8; scolIndex++)
                {
                    if (ai.board[srowIndex][scolIndex] == ai.current_turn)
                    {
                        for (var sIndex = 0; sIndex < 8; sIndex++)
                        {
                            var r = (srowIndex + ai.nav_rows[sIndex]);
                            var c = (scolIndex + ai.nav_cols[sIndex]);
                            if (r < 0 || r > 7 || c < 0 || c > 7)
                            {    s += 2;    }
                            else if (ai.board[r][c] == 0)
                            {    s--;    }
                        }
                    }
                }
            }
            return s;
        },

       /**
        *   returns how many moves there are after this move
        **/
        getMobility: function ()
        {
            var ai = this;
            var m = 0;
            for (var mrowIndex = 0; mrowIndex < 8; mrowIndex++)
            {
                for (var mcolIndex = 0; mcolIndex < 8; mcolIndex++)
                {
                    if ((ai.board[mrowIndex][mcolIndex] == 0) && ai.getPieces(ai.board, mrowIndex, mcolIndex, ai.current_turn))
                    {    m += 2;    }
                }
            }
            return m;
        },

       /**
        *   returns how many pieces the enemy could take after that move
        **/
        getDamage: function (theDepth, theBoard, theTurn)
        {
            if (theDepth > 1)
            {   return 0;    }
            var ai = this;
            var damage = 0;
            var bestRating = null;
            var board = [];
            var pieces = false;
            var rating = r = c = 0;
            //alert('entering depth rating [' + theDepth + ']');
            for (var row = 0; row < theBoard.length; row++)
            {
                for (var col = 0; col < theBoard[row].length; col++)
                {
                    if (theBoard[row][col] == 0)
                    {
                        pieces = ai.getPieces(theBoard, row, col, theTurn);
                        if (pieces && pieces.length > 0)
                        {
                            for (var i = 0; i < theBoard.length; i++)
                            {
                                board[i] = [];
                                for (var j = 0; j < theBoard[i].length; j++)
                                {   board[i][j] = theBoard[i][j];    }
                            }
                            rating = pieces.length * 4;
                           //Set the pieces
                            for (var placement = 0; placement < pieces.length; placement++)
                            {   board[pieces[placement][0]][pieces[placement][1]] = theTurn;    }
                           //Get Stability
                            for (var srowIndex = 0; srowIndex < board.length; srowIndex++)
                            {
                                for (var scolIndex = 0; scolIndex < board[srowIndex].length; scolIndex++)
                                {
                                    if (board[srowIndex][scolIndex] == theTurn)
                                    {
                                        for (var sIndex = 0; sIndex < 8; sIndex++)
                                        {
                                            r = (srowIndex + ai.nav_rows[sIndex]);
                                            c = (scolIndex + ai.nav_cols[sIndex]);
                                            if (r < 0 || r >= board.length || c < 0 || c >= board[r].length)
                                            {    rating += 2;    }
                                            else if (board[r][c] == 0)
                                            {    rating--;    }
                                        }
                                    }
                                }
                            }
                           //Get mobility
                            for (var mrowIndex = 0; mrowIndex < board.length; mrowIndex++)
                            {
                                for (var mcolIndex = 0; mcolIndex < board[mrowIndex].length; mcolIndex++)
                                {
                                    if ((board[mrowIndex][mcolIndex] == 0) && ai.getPieces(board, mrowIndex, mcolIndex, theTurn))
                                    {    rating += 2;    }
                                }
                            }
                           //Get weight
                            rating += ai.table_weights[row][col];
                            //if (ai.table_weights[row][col] == 100 && confirm('turn [' + theTurn + '] [' + row + '] [' + col + '] has a rating of [' + rating + ']'))
                            //{   return;    }
                            if (bestRating == null || rating > bestRating)
                            {    bestRating = rating + ai.getDamage((theDepth + 1), board, ((theTurn == 1) ? 2 : 1));    }
                        }
                    }
                }
            }
           //Remeber, all odds are flipped because it is the opponent!
            return (bestRating === null) ? 0 : ((theDepth == 0) ? (bestRating * -1) : bestRating);
        },

        getWeight: function (theRow,theCol)
        {
            var ai = this;
            return ai.table_weights[theRow][theCol];
        },

        getPieces: function (theBoard, theRow, theCol, theTurn)
        {
            var ai = this;
            var pieces = [];
            var flag = false;
            var tempPieces = [];
            for (var row = 0; row < theBoard.length; row++)
            {
                flag = false;
                tempPieces = [];
                for (var col = 1; col < theBoard[row].length; col++)
                {
                    var r = (theRow + (ai.nav_rows[row] * col));
                    var c = (theCol + (ai.nav_cols[row] * col));
                    if (r < 0 || r >= theBoard.length || c < 0 || c >= theBoard[row].length)
                    {    break;    }
                    if (theBoard[r][c] == 0)
                    {    break;    }
                    else if (theBoard[r][c] != theTurn)
                    {    tempPieces[tempPieces.length] = [r, c];    }
                    else if (theBoard[r][c] == theTurn)
                    {    flag = true; break;    }
                }
                if (tempPieces.length > 0 && flag)
                {
                    for (var i = 0; i < tempPieces.length; i++)
                    {   pieces[pieces.length] = tempPieces[i];   }
                }
            }
            return (pieces.length > 0) ? pieces : false;
        }

    };
    return ai;
}
