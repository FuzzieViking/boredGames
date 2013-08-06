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
function DotsAI(theType)
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
            for (var row = 0; row < theGame.board.length; row++)
            {
                for (var col = 0; col < theGame.board[row].length; col++)
                {
                    if (theGame.board[row][col] == 0)
                    {
                        //if (!confirm('Sending [' + row + '][' + col + ']'))
                        //{   return;    }
                        var value = ai.getValue(ai.board, row, col);
                        if (value > 0)
                        {
                            ai.piece =
                            {
                                row: row,
                                col: col
                            };
                            ai.score = value;
                            return true;
                        }
                        else
                        {
                            all_scores[all_scores.length] =
                            {
                                piece:
                                {
                                    row: row,
                                    col: col
                                }
                            };
                        }
                    }
                }
            }//end rows
           //Grab 1 at random from all returned results
            if (all_scores.length > 0)
            {
                var choice = all_scores[Math.round(Math.random() * (all_scores.length - 1))];
                ai.piece = choice.piece;
            }
            return true;
        },

       /**
        *   Figure out how many pieces a move will take, then subtract how many the other color can take next move
        **/
        moveMedium: function (theGame)
        {
            var ai = this;
           //now Get scores for all the possible moves
            for (var row = 0; row < theGame.board.length; row++)
            {
                for (var col = 0; col < theGame.board[row].length; col++)
                {
                    if (theGame.board[row][col] == 0)
                    {
                        var value = ai.getValue(ai.board, row, col);
                        if (value == 0)
                        {
                           //See if this creates a closure for the opponent
                            var danger = ai.getDanger(ai.board, row, col);
                           //for fun we will pick one at random if they are equal
                            if (ai.piece.row == null || ai.score < danger || ai.score == danger && ((Math.round(Math.random() * 1)) > 0))
                            {
                                //alert('setting to [' + row + '] [' + col + '] [' + danger + ']');
                                ai.piece =
                                {
                                    row: row,
                                    col: col
                                };
                                ai.score = value + danger;
                            }
                        }
                        else
                        {
                            ai.piece =
                            {
                                row: row,
                                col: col
                            };
                            ai.score = value;
                            return true;
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
            var moves = [];
            var capture_moves = [];
            var value = danger = 0;
           //now Get scores for all the possible moves
            for (var row = 0; row < theGame.board.length; row++)
            {
                for (var col = 0; col < theGame.board[row].length; col++)
                {
                    if (theGame.board[row][col] == 0)
                    {
                        value = ai.getValue(theGame.board, row, col);
                        if (value == 0)
                        {
                            moves[moves.length] =
                            {
                                row: row,
                                col: col
                            };
                        }
                        else
                        {
                            capture_moves[capture_moves.length] =
                            {
                                row: row,
                                col: col
                            };
                        }
                    }
                }//end cols
            }//end rows
            //alert('we have capture: [' + capture_moves.length + '] moves: [' + moves.length + ']');
            if (capture_moves.length > 0)
            {
                for (var i = 0; i < capture_moves.length; i++)
                {
                   //Reset the board for the recursive move check
                    ai.current_turn = theGame.current_turn;
                    ai.board = [];
                    for (var s = 0; s < theGame.board.length; s++)
                    {
                        ai.board[s] = [];
                        for (var j = 0; j < theGame.board[s].length; j++)
                        {   ai.board[s][j] = theGame.board[s][j];    }
                    }
                    ai.board[capture_moves[i].row][capture_moves[i].col] = ai.current_turn;

                   //now set the test board as if that move occured
                    value = ai.getValue(ai.board, capture_moves[i].row, capture_moves[i].col) +
                            ai.getDanger(ai.board, capture_moves[i].row, capture_moves[i].col) +
                            ai.getDamage(0, ai.board, capture_moves[i].row, capture_moves[i].col, theGame.current_turn);
                   //for fun we will pick one at random if they are equal
                    if (ai.piece.row == null || ai.score < value || ai.score == value && ((Math.floor(Math.random() * 5)) > 3))
                    {
                        ai.piece =
                        {
                            row: capture_moves[i].row,
                            col: capture_moves[i].col
                        };
                        ai.score = value;
                    }
                }
            }
            else if (moves.length > 0)
            {
                for (var i = 0; i < moves.length; i++)
                {
                   //Reset the board for the recursive move check
                    ai.current_turn = theGame.current_turn;
                    ai.board = [];
                    for (var s = 0; s < theGame.board.length; s++)
                    {
                        ai.board[s] = [];
                        for (var j = 0; j < theGame.board[s].length; j++)
                        {   ai.board[s][j] = theGame.board[s][j];    }
                    }
                    ai.board[moves[i].row][moves[i].col] = ai.current_turn;

                   //now set the test board as if that move occured
                    value = ai.getValue(ai.board, moves[i].row, moves[i].col) +
                            ai.getDanger(ai.board, moves[i].row, moves[i].col) +
                            ai.getDamage(0, ai.board, moves[i].row, moves[i].col, theGame.current_turn);
                   //for fun we will pick one at random if they are equal
                    if (ai.piece.row == null || ai.score < value || (ai.score == value && ((Math.floor(Math.random() * 5)) > 3)))
                    {
                        //alert('[' + moves[i].row + '] [' + moves[i].col + '] value [' + value + ']');
                        ai.piece =
                        {
                            row: moves[i].row,
                            col: moves[i].col
                        };
                        ai.score = value;
                    }
                }
            }
        },

        /**
         *  See if adding this position creates a weakness
         **/
        getDanger: function (theBoard, theRow, theCol)
        {
            var ai = this;
            var value = 0;
           //right or left
            if (theRow % 2 == 0)
            {
               //Top
                if ((theRow - 1) > 0)
                {
                    if (theBoard[(theRow - 1)][(theCol - 1)] > 0)
                    {   value++;    }
                    if (theBoard[(theRow - 1)][(theCol + 1)] > 0)
                    {   value++;    }
                    if (theBoard[(theRow - 2)][theCol] > 0)
                    {   value++;    }
                }
               //Bottom
                if ((theRow + 1) < theBoard.length)
                {
                    if (theBoard[(theRow + 1)][(theCol - 1)] > 0)
                    {   value++;    }
                    if (theBoard[(theRow + 1)][(theCol + 1)] > 0)
                    {   value++;    }
                    if (theBoard[(theRow + 2)][theCol] > 0)
                    {   value++;    }
                }
            }
           //up or down
            else
            {
               //Left complete
                if ((theCol - 1) > 0)
                {
                    if (theBoard[(theRow - 1)][(theCol - 1)] > 0)
                    {   value++;    }
                    if (theBoard[(theRow + 1)][(theCol - 1)] > 0)
                    {   value++;    }
                    if (theBoard[theRow][(theCol - 2)] > 0)
                    {   value++;    }
                }
               //Right complete
                if ((theCol + 1) < theBoard[theRow].length)
                {
                    if (theBoard[(theRow - 1)][(theCol + 1)] > 0)
                    {   value++;    }
                    if (theBoard[(theRow + 1)][(theCol + 1)] > 0)
                    {   value++;    }
                    if (theBoard[theRow][(theCol + 2)] > 0)
                    {   value++;    }
                }
            }
            return (value * -1);
        },

        /**
         *  This runs through the board and makes sure it can't close a choice
         **/
        getValue: function (theBoard, theRow, theCol)
        {
            var ai = this;
            var value = 0;
           //right or left
            if (theRow % 2 == 0)
            {
               //Top
                if ((theRow - 1) > 0 &&
                    theBoard[(theRow - 1)][(theCol - 1)] > 0 &&
                    theBoard[(theRow - 1)][(theCol + 1)] > 0 &&
                    theBoard[(theRow - 2)][theCol] > 0)
                {   value++;    }
               //Bottom
                if ((theRow + 1) < theBoard.length &&
                    theBoard[(theRow + 1)][(theCol - 1)] > 0 &&
                    theBoard[(theRow + 1)][(theCol + 1)] > 0 &&
                    theBoard[(theRow + 2)][theCol] > 0)
                {   value++;    }
            }
           //up or down
            else
            {
               //Left complete
                if ((theCol - 1) > 0 &&
                    theBoard[(theRow - 1)][(theCol - 1)] > 0 &&
                    theBoard[(theRow + 1)][(theCol - 1)] > 0 &&
                    theBoard[theRow][(theCol - 2)] > 0)
                {   value++;    }
               //Right complete
                if ((theCol + 1) < theBoard[theRow].length &&
                    theBoard[(theRow - 1)][(theCol + 1)] > 0 &&
                    theBoard[(theRow + 1)][(theCol + 1)] > 0 &&
                    theBoard[theRow][(theCol + 2)] > 0)
                {   value++;    }
            }
            return value;
        },

       /**
        *   returns how many pieces the enemy could take after that move
        **/
        getDamage: function (theDepth, theBoard, theTurn)
        {
            if (theDepth > 3)
            {   return 0;    }
            var ai = this;
            var bestRating = null;
            var board = [];
            var turn = theTurn;
            var rating = danger = value = 0;
            //alert('entering depth rating [' + theDepth + ']');
            for (var row = 0; row < theBoard.length; row++)
            {
                for (var col = 0; col < theBoard[row].length; col++)
                {
                    if (theBoard[row][col] == 0)
                    {
                        for (var i = 0; i < theBoard.length; i++)
                        {
                            board[i] = [];
                            for (var j = 0; j < theBoard[i].length; j++)
                            {   board[i][j] = theBoard[i][j];    }
                        }
                        board[row][col] = theTurn;
                        value = (ai.getValue(board, row, col) * (theDepth + 1));
                        //danger = ai.getDanger(board, row, col);
                        rating = value + ((value > 0) ? (danger * -1) : danger);
                        if (bestRating == null || rating > bestRating)
                        {
                            turn = (value > 0) ? theTurn : ((theTurn == 1) ? 2 : 1);
                            bestRating = ai.getDamage((theDepth + 1), board, turn);
                        }
                    }
                }
            }
           //Remeber, all odds are flipped because it is the opponent!
            return (bestRating === null) ? 0 : ((turn != theTurn) ? (bestRating * -1) : bestRating);
        }

    };
    return ai;
}
/*
    Author: Jerry Middlemiss
    Created: 6/6/2003
    Requires: BaseUtils.js, BoxWars.js
    Purpose: To emulate a player in the game of box wars
function DotsAI(theGame)
{
    //global pointers
    this.win = self;
    this.doc = this.win.document;
    this.game = theGame;

    //external functions
    this.findMove = findMove;

    //internal functions
    this.getValue = getValue;

    //internal vars
    this.score = "none";
    this.piece = "";
    this.turn = "";
    this.enemy = "";
    this.height = this.game.height;
    this.width = this.game.width;

    //figure out the best move
    //can we move there?
    //what is the value of moving there?
    //set the best score, ties are randomly chosen
    function findMove(theLevel)
    {
       //set the stage
        this.score = "none";
        this.piece = "";
        this.turn = this.game.turn;
        this.enemy = (this.turn == "blue") ? "red" : "blue";
        this.equalArray = new Array();
        //this.msg = "Current Standings:<br>";
        if (this.game.gameOver)
        {   return;    }

        for (var rowIndex = 0; rowIndex < (this.height + 1); rowIndex++)//(this.height + 1)
        {
            for (var colIndex = 0; colIndex < (this.width + 1); colIndex++)
            {
                var hor = this.doc.getElementById("hor" + rowIndex + colIndex);
                var ver = this.doc.getElementById("ver" + rowIndex + colIndex);
                var s = 0;
                if (isDom(hor) && hor.src == this.game.drop["emptyHor"].src)
                {
                    var s = this.getValue(rowIndex,colIndex,"hor");
                    if (this.score == "none" || s > this.score)
                    {
                        this.score = s;
                        this.equalArray = new Array();
                        this.equalArray[this.equalArray.length] = hor;
                    }
                    else if (s == this.score)
                    {
                        this.equalArray[this.equalArray.length] = hor;
                    }
                }
                if (isDom(ver) && ver.src == this.game.drop["emptyVer"].src)
                {
                    var s = this.getValue(rowIndex,colIndex,"ver");
                    if (this.score == "none" || s > this.score)
                    {
                        this.score = s;
                        this.equalArray = new Array();
                        this.equalArray[this.equalArray.length] = ver;
                    }
                    else if (s == this.score)
                    {
                        this.equalArray[this.equalArray.length] = ver;
                    }
                }
            }//end colIndex
        }//end rowIndex
        this.piece = (this.equalArray.length == 1) ? this.equalArray[0] : this.equalArray[(Math.round(Math.random() * (this.equalArray.length - 1)))];
        //this.msg += " piece chosen " + this.piece.id + " out of " + this.equalArray.length;
        //this.doc.getElementById("tempDiv").innerHTML = this.msg;
       //move the piece
        if (isDom(this.piece))
        {
            move(this.piece,true);
        }
        else
        {  this.findMove(theLevel);  }
    }//end findmove

    function getValue(theRow,theCol,theType)
    {
        var square1 = (theType == "ver" && (theCol < this.width)) ? this.doc.getElementById("square" + theRow + theCol) : (theType == "hor" && (theRow > 0)) ? this.doc.getElementById("square" + (theRow - 1) + theCol) : "";
        var s1test1 = (theType == "ver") ? this.doc.getElementById("hor" + theRow + theCol) : this.doc.getElementById("ver" + (theRow - 1) + theCol);
        var s1test2 = (theType == "ver") ? this.doc.getElementById("hor" + (theRow + 1) + theCol) : this.doc.getElementById("ver" + (theRow - 1) + (theCol + 1));
        var s1test3 = (theType == "ver") ? this.doc.getElementById("ver" + theRow + (theCol + 1)) : this.doc.getElementById("hor" + (theRow - 1) + theCol);
        var square2 = (theType == "ver" && (theCol > 0)) ? this.doc.getElementById("square" + theRow + (theCol - 1)) : (theType == "hor" && (theRow < this.height)) ? this.doc.getElementById("square" + theRow + theCol) : "";
        var s2test1 = (theType == "ver") ? this.doc.getElementById("hor" + theRow + (theCol - 1)) : this.doc.getElementById("ver" + theRow + theCol);
        var s2test2 = (theType == "ver") ? this.doc.getElementById("hor" + (theRow + 1) + (theCol - 1)) : this.doc.getElementById("ver" + theRow + (theCol + 1));
        var s2test3 = (theType == "ver") ? this.doc.getElementById("ver" + theRow + (theCol - 1)) : this.doc.getElementById("hor" + (theRow + 1) + theCol)
        var compare1 = (theType == "ver") ? this.game.drop["emptyHor"].src : this.game.drop["emptyVer"].src;
        var compare2 = (theType == "ver") ? this.game.drop["emptyHor"].src : this.game.drop["emptyVer"].src;
        var compare3 = (theType == "ver") ? this.game.drop["emptyVer"].src : this.game.drop["emptyHor"].src;
        var one = 0;
        var two = 0;
        var curScore = 0;

        if (isDom(square1) && square1.src == this.game.squares["empty"].src)
        {
            one += (s1test1.src != compare1) ?  1 : 0;
            one += (s1test2.src != compare2) ?  1 : 0;
            one += (s1test3.src != compare3) ?  1 : 0;
        }
        if (isDom(square2) && square2.src == this.game.squares["empty"].src)
        {
            two += (s2test1.src != compare1) ?  1 : 0;
            two += (s2test2.src != compare2) ?  1 : 0;
            two += (s2test3.src != compare3) ?  1 : 0;
        }
        curScore = (one == 2 && two == 2) ? -2 : (one == 2 && two != 3 || two == 2 && one != 3) ? -1 : (one == 3 && two == 3) ? 2 : (one == 3 || two == 3) ? 1 : 0;//(one && two) ? 2 : (one || two) ? 1 : 0;
        //this.msg += "type[" + theType + "] row/col[" + theRow + theCol + "] one/two[" + one + two + "] score[" + curScore + "]<br>";
        return curScore;
    }

}//end BoxWarAI
*/
