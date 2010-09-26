/*
    Author: Jerry Middlemiss
    Created: 6/4/2003
    Requires: BaseUtils.js
    Purpose: game where you try to capture the most squares
*/
var Dots =
{
    name: 'Dots',
    display_name: 'Dots',
    version: 0.1,
    logo: '/js/lib/boredgames/img/dots_logo.png',
    blurb: "Simple game you haven't played in a long time",
    table: null,
    onmove: '',
    onfinish: '',
    onstart: '',
    finished: false,
    totals: [0, 0],
    image_size: [10, 10],
    images: ['', '', ''],
   /**
    *   -1: Not valid
    *   0: unpicked border
    *   1: picked border
    *   2: dot
    *   3: block space
    **/
    boards:
    {
        Easy:
        [
            [2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2]
        ],
        Normal:
        [
            [2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2]
        ],
        Hard:
        [
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
            [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0],
            [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2]
        ],
        Chakana:
        [
           //Top
            [-1,-1,-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1],
           //Tier
            [-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1],
            [-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1],
            [-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1],
            [-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1],
           //Middle
            [ 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [ 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0],
            [ 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [ 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0],
            [ 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
           //Tier
            [-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1],
            [-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1],
            [-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1],
            [-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1],
           //Bottom
            [-1,-1,-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1,-1,-1]
        ],
        Diamond:
        [
            [-1,-1,-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1],
            [-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1],
            [-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1],
            [-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1],
            [ 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [ 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
            [ 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [ 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
            [ 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1],
            [-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1],
            [-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1],
            [-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1,-1,-1]
        ],
        Triangle:
        [
            [-1,-1,-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1],
            [-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1],
            [-1,-1,-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1,-1,-1],
            [-1,-1,-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1,-1,-1],
            [-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1],
            [-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1],
            [-1,-1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2,-1,-1],
            [-1,-1, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,-1,-1],
            [ 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [ 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
            [ 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2]
        ]
    },
    old_boards:
    {
        Easy:
        [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ],
        Normal:
        [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]
        ],
        Hard:
        [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ],
        Chakana:
        [
            [-1,-1,-1,-1, 0, 0,-1,-1,-1,-1],
            [-1,-1,-1,-1, 0, 0,-1,-1,-1,-1],
            [-1,-1, 0, 0, 0, 0, 0, 0,-1,-1],
            [-1,-1, 0, 0, 0, 0, 0, 0,-1,-1],
            [ 0, 0, 0, 0,-1,-1, 0, 0, 0, 0],
            [ 0, 0, 0, 0,-1,-1, 0, 0, 0, 0],
            [-1,-1, 0, 0, 0, 0, 0, 0,-1,-1],
            [-1,-1, 0, 0, 0, 0, 0, 0,-1,-1],
            [-1,-1,-1,-1, 0, 0,-1,-1,-1,-1],
            [-1,-1,-1,-1, 0, 0,-1,-1,-1,-1]
        ],
        Diamond:
        [
            [-1,-1,-1,-1, 0, 0,-1,-1,-1,-1],
            [-1,-1,-1, 0, 0, 0, 0,-1,-1,-1],
            [-1,-1, 0, 0, 0, 0, 0, 0,-1,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1,-1, 0, 0, 0, 0, 0, 0,-1,-1],
            [-1,-1,-1, 0, 0, 0, 0,-1,-1,-1],
            [-1,-1,-1,-1, 0, 0,-1,-1,-1,-1]
        ],
        Triangle:
        [
            [-1,-1,-1,-1, 0, 0,-1,-1,-1,-1],
            [-1,-1,-1,-1, 0, 0,-1,-1,-1,-1],
            [-1,-1,-1, 0, 0, 0, 0,-1,-1,-1],
            [-1,-1,-1, 0, 0, 0, 0,-1,-1,-1],
            [-1,-1, 0, 0, 0, 0, 0, 0,-1,-1],
            [-1,-1, 0, 0, 0, 0, 0, 0,-1,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    board: [],
    current_players: [],
    current_turn: 1,
    current_piece: null,
    current_board: 'Normal',
    current_stats: {},
    init: function (theParams)
    {
        var game = this;
        game.table = $E(theParams['table']);
        game.onmove = theParams['onmove'];
        game.onfinish = theParams['onfinish'];
        game.onstart = theParams['onstart'];
        game.image_size = [10, 10];
        game.images[0] = new Image(game.image_size[0], game.image_size[1]);
        game.images[0].src = '/js/lib/boredgames/img/dots_dot.png';
        game.images[1] = new Image(game.image_size[0], game.image_size[1]);
        game.images[1].src = '/js/lib/boredgames/img/dots_selected.png';
        game.images[2] = new Image(game.image_size[0], game.image_size[1]);
        game.images[2].src = '/js/lib/boredgames/img/dots_option.png';
       //Turn the stats into a usuable object
        if (theParams['stats'])
        {
            var pairs = theParams['stats'].split('|');
            for (var i = 0; i < pairs.length; i++)
            {
                var values = pairs[i].split('=');
                game.current_stats[values[0]] = parseInt(values[1]);
            }
        }
        else
        {   game.resetStats();    }
        game.start();
        game.setAI(1, null);
        game.setAI(2, 'medium');
    },

    setAI: function (thePlayer, theType)
    {
        var game = this;
        if (isSet(theType))
        {
            game.current_players[thePlayer] = DotsAI(theType);
            game.current_players[thePlayer].getPieces = game.getPieces;
            if (game.current_turn == thePlayer)
            {   game.move();    }
        }
        else
        {   game.current_players[thePlayer] = null;    }
    },

    move: function (theImg, theRow, theCol)
    {
        var game = this;
        if (!game.finished)
        {
            var row = (isDom(theImg)) ? parseInt(theImg.getAttribute('row')) : theRow;
            var col = (isDom(theImg)) ? parseInt(theImg.getAttribute('col')) : theCol;
            if (isDom(theImg) && isSet(game.current_players[game.current_turn]))
            {   alert("The computer is thinking...");    }
            else if (isNotSet(game.current_players[game.current_turn]) || theRow > -1 && theCol > -1)
            {
                if (theImg.src == game.images[0].src)
                {//alert('' + row + col);
                    if (isDom(game.current_piece))
                    {   game.move(game.current_piece);    }
                    var found = false;
                   //right
                    if ((col + 1) < game.board[row].length && game.board[row][(col + 1)] == 0)
                    {
                        found = true;
                        $E('dot_' + row + '_' + (col + 2)).src = game.images[2].src;
                    }
                   //left
                    if (col > 0 && game.board[row][(col - 1)] == 0)
                    {
                        found = true;
                        $E('dot_' + row + '_' + (col - 2)).src = game.images[2].src;
                    }
                   //top
                    if (row > 0 && game.board[(row - 1)][col] == 0)
                    {
                        found = true;
                        $E('dot_' + (row - 2) + '_' + col).src = game.images[2].src;
                    }
                   //bottom
                    if ((row + 1) < game.board.length && game.board[(row + 1)][col] == 0)
                    {
                        found = true;
                        $E('dot_' + (row + 2) + '_' + col).src = game.images[2].src;
                    }

                    if (found)
                    {
                        theImg.src = game.images[1].src;
                        game.current_piece = theImg;
                    }
                    return true;
                }
                else if (theImg.src == game.images[2].src)
                {
                    var row_start = parseInt(game.current_piece.getAttribute('row'));
                    var col_start = parseInt(game.current_piece.getAttribute('col'));
                    var complete;
                   //right or left
                    if (row == row_start)
                    {
                       //right
                        if (col > col_start)
                        {
                            game.board[row][(col_start + 1)] = 1;
                            $E('hor_' + row + '_' + (col_start + 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                            $E('hor_' + row + '_' + (col_start + 1)).style.visibility = 'visible';
                            //alert('START [' + row_start + '] [' + col_start + ']\nEND [' + row + '] [' + col + ']\nBOARD [' + game.board[(row - 1)][col] + '] [' + game.board[(row - 1)][col_start] + ']');
                           //Top
                            if (((row - 1) > 0) &&
                                game.board[(row - 1)][col] > 0 &&
                                game.board[(row - 1)][col_start] > 0 &&
                                game.board[(row - 2)][(col_start + 1)] > 0)
                            {
                                $E('box_' + (row - 1) + '_' + (col_start + 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                                game.totals[(game.current_turn - 1)]++;
                                complete = true;
                            }
                           //Bottom
                            if ((row + 1) < game.board.length &&
                                game.board[(row + 1)][col] > 0 &&
                                game.board[(row + 1)][col_start] > 0 &&
                                game.board[(row + 2)][(col_start + 1)] > 0)
                            {
                                $E('box_' + (row + 1) + '_' + (col_start + 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                                game.totals[(game.current_turn - 1)]++;
                                complete = true;
                            }
                        }
                       //left
                        else
                        {
                            game.board[row][(col + 1)] = 1;
                            $E('hor_' + row + '_' + (col + 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                            $E('hor_' + row + '_' + (col + 1)).style.visibility = 'visible';
                            //alert('START [' + row_start + '] [' + col_start + ']\nEND [' + row + '] [' + col + ']\nBOARD [' + game.board[(row - 1)][col] + '] [' + game.board[(row - 1)][col_start] + ']');
                           //Top
                            if (((row - 1) > 0) &&
                                game.board[(row - 1)][col] > 0 &&
                                game.board[(row - 1)][col_start] > 0 &&
                                game.board[(row - 2)][(col + 1)] > 0)
                            {
                                $E('box_' + (row - 1) + '_' + (col + 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                                game.totals[(game.current_turn - 1)]++;
                                complete = true;
                            }
                           //Bottom complete
                            if ((row + 1) < game.board.length &&
                                game.board[(row + 1)][col] > 0 &&
                                game.board[(row + 1)][col_start] > 0 &&
                                game.board[(row + 2)][(col + 1)] > 0)
                            {
                                $E('box_' + (row + 1) + '_' + (col + 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                                game.totals[(game.current_turn - 1)]++;
                                complete = true;
                            }
                        }
                    }
                   //up or down
                    else
                    {
                       //Down
                        if (row > row_start)
                        {
                            game.board[(row_start + 1)][col] = 1;
                            $E('ver_' + (row_start + 1) + '_' + col).style.backgroundColor = game.players[game.current_turn - 1].color;
                            $E('ver_' + (row_start + 1) + '_' + col).style.visibility = 'visible';
                           //Left complete
                            if ((col - 1) > 0 &&
                                game.board[row][(col - 1)] > 0 &&
                                game.board[row_start][(col - 1)] > 0 &&
                                game.board[(row_start + 1)][(col - 2)] > 0)
                            {
                                $E('box_' + (row_start + 1) + '_' + (col - 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                                game.totals[(game.current_turn - 1)]++;
                                complete = true;
                            }
                           //Right complete
                            if ((col + 1) < game.board[row_start].length &&
                                game.board[row_start][(col + 1)] > 0 &&
                                game.board[row][(col + 1)] > 0 &&
                                game.board[(row_start + 1)][(col + 2)] > 0)
                            {
                                $E('box_' + (row_start + 1) + '_' + (col + 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                                game.totals[(game.current_turn - 1)]++;
                                complete = true;
                            }
                        }
                       //Up
                        else
                        {
                            game.board[(row + 1)][col] = 1;
                            $E('ver_' + (row + 1) + '_' + col).style.backgroundColor = game.players[game.current_turn - 1].color;
                            $E('ver_' + (row + 1) + '_' + col).style.visibility = 'visible';
                           //Left complete
                            if ((col - 1) > 0 &&
                                game.board[row][(col - 1)] > 0 &&
                                game.board[row_start][(col - 1)] > 0 &&
                                game.board[(row + 1)][(col - 2)] > 0)
                            {
                                $E('box_' + (row + 1) + '_' + (col - 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                                game.totals[(game.current_turn - 1)]++;
                                complete = true;
                            }
                           //Right complete
                            if ((col + 1) < game.board[row_start].length &&
                                game.board[row_start][(col + 1)] > 0 &&
                                game.board[row][(col + 1)] > 0 &&
                                game.board[(row + 1)][(col + 2)] > 0)
                            {
                                $E('box_' + (row + 1) + '_' + (col + 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                                game.totals[(game.current_turn - 1)]++;
                                complete = true;
                            }
                        }
                    }
                    game.move(game.current_piece);
                    return game.nextTurn(complete);
                }
                else
                {
                    theImg.src = game.images[0].src;
                   //right
                    if ((col + 1) < game.board[row].length && game.board[row][(col + 1)] > -1)
                    {   $E('dot_' + row + '_' + (col + 2)).src = game.images[0].src;    }
                   //left
                    if (col > 0 && game.board[row][(col - 1)] > -1)
                    {   $E('dot_' + row + '_' + (col - 2)).src = game.images[0].src;    }
                   //top
                    if (row > 0 && game.board[(row - 1)][col] > -1)
                    {   $E('dot_' + (row - 2) + '_' + col).src = game.images[0].src;    }
                   //bottom
                    if ((row + 1) < game.board.length && game.board[(row + 1)][col] > -1)
                    {   $E('dot_' + (row + 2) + '_' + col).src = game.images[0].src;    }
                    game.current_piece = null;
                    return true;
                }
            }
            else if (isSet(game.current_players[game.current_turn]))
            {
                var border = game.current_players[game.current_turn].move(game);
               // alert(game.current_players[game.current_turn].score);
                //for (var k in border)
                //    {   alert('k [' + k + '] [' + border[k] + ']');    }
                var type = (border.row % 2 != 0) ? 'ver_' : 'hor_';
                var complete;
                game.board[border.row][border.col] = 1;
                $E(type + border.row + '_' + border.col).style.backgroundColor = game.players[game.current_turn - 1].color;
                $E(type + border.row + '_' + border.col).style.visibility = 'visible';
               //right or left
                if (type == 'hor_')
                {
                   //Top
                    if ((border.row - 1) > 0 &&
                        game.board[(border.row - 1)][(border.col - 1)] > 0 &&
                        game.board[(border.row - 1)][(border.col + 1)] > 0 &&
                        game.board[(border.row - 2)][border.col] > 0)
                    {
                        $E('box_' + (border.row - 1) + '_' + border.col).style.backgroundColor = game.players[game.current_turn - 1].color;
                        game.totals[(game.current_turn - 1)]++;
                        complete = true;
                    }
                   //Bottom
                    if ((border.row + 1) < game.board.length &&
                        game.board[(border.row + 1)][(border.col - 1)] > 0 &&
                        game.board[(border.row + 1)][(border.col + 1)] > 0 &&
                        game.board[(border.row + 2)][border.col] > 0)
                    {
                        $E('box_' + (border.row + 1) + '_' + border.col).style.backgroundColor = game.players[game.current_turn - 1].color;
                        game.totals[(game.current_turn - 1)]++;
                        complete = true;
                    }
                }
               //up or down
                else
                {
                   //Left complete
                    if ((border.col - 1) > 0 &&
                        game.board[(border.row - 1)][(border.col - 1)] > 0 &&
                        game.board[(border.row + 1)][(border.col - 1)] > 0 &&
                        game.board[border.row][(border.col - 2)] > 0)
                    {
                        $E('box_' + border.row + '_' + (border.col - 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                        game.totals[(game.current_turn - 1)]++;
                        complete = true;
                    }
                   //Right complete
                    if ((border.col + 1) < game.board[border.row].length &&
                        game.board[(border.row - 1)][(border.col + 1)] > 0 &&
                        game.board[(border.row + 1)][(border.col + 1)] > 0 &&
                        game.board[border.row][(border.col + 2)] > 0)
                    {
                        $E('box_' + border.row + '_' + (border.col + 1)).style.backgroundColor = game.players[game.current_turn - 1].color;
                        game.totals[(game.current_turn - 1)]++;
                        complete = true;
                    }
                }
                return game.nextTurn(complete);
            }
        }
        return false;
    },

    nextTurn: function (theFlag)
    {
        var game = this;
       //Are they out of moves?
        game.finished = true;
        for (var row = 0; row < game.board.length; row++)
        {
            for (var col = 0; col < game.board[row].length; col++)
            {
                if (game.board[row][col] == 0)
                {   game.finished = false; break;    }
            }
            if (!game.finished)
            {   break;    }
        }
        if (game.finished)
        {
            var count = game.getTotals();
            if (!isSet(game.current_players[1]))
            {
                game.current_stats.one_games++;
                if (count[1] > count[2])
                {
                    game.current_stats.one_wins++;
                    game.current_stats.one_wins_streak++;
                    game.current_stats.one_wins_streak_max = (game.current_stats.one_wins_streak > game.current_stats.one_wins_streak_max) ? game.current_stats.one_wins_streak : game.current_stats.one_wins_streak_max;
                }
                else if (count[2] > count[1])
                {
                    game.current_stats.one_losses++;
                    game.current_stats.one_wins_streak = 0;
                }
                else
                {
                    game.current_stats.one_ties++;
                    game.current_stats.one_wins_streak = 0;
                }

                game.current_stats.one_max_pieces = (count[1] > game.current_stats.one_max_pieces || game.current_stats.one_max_pieces == 0) ? count[1] : game.current_stats.one_max_pieces;
                game.current_stats.one_min_pieces = (count[1] < game.current_stats.one_min_pieces || game.current_stats.one_min_pieces == 0) ? count[1] : game.current_stats.one_min_pieces;
                game.current_stats.one_total_pieces += count[1];
                game.current_stats.one_average_pieces = Math.round((game.current_stats.one_total_pieces / game.current_stats.one_games) * 100) / 100;
            }
            if (!isSet(game.current_players[2]))
            {
                game.current_stats.two_games++;
                if (count[2] > count[1])
                {
                    game.current_stats.two_wins++;
                    game.current_stats.two_wins_streak++;
                    game.current_stats.two_wins_streak_max = (game.current_stats.two_wins_streak > game.current_stats.two_wins_streak_max) ? game.current_stats.two_wins_streak : game.current_stats.two_wins_streak_max;
                }
                else if (count[1] > count[2])
                {
                    game.current_stats.two_losses++;
                    game.current_stats.two_wins_streak = 0;
                }
                else
                {
                    game.current_stats.two_ties++;
                    game.current_stats.two_wins_streak = 0;
                }

                game.current_stats.two_max_pieces = (count[2] > game.current_stats.two_max_pieces || game.current_stats.two_max_pieces == 0) ? count[2] : game.current_stats.two_max_pieces;
                game.current_stats.two_min_pieces = (count[2] < game.current_stats.two_min_pieces || game.current_stats.two_min_pieces == 0) ? count[2] : game.current_stats.two_min_pieces;
               //Now calculate averages
                game.current_stats.two_total_pieces += count[2];
                game.current_stats.two_average_pieces = Math.round((game.current_stats.two_total_pieces / game.current_stats.two_games) * 100) / 100;
            }
            $E("turnDiv").innerHTML = 'Game over!<br />' + ((game.totals[0] > game.totals[1]) ? game.players[0].name + ' wins!' : ((game.totals[1] > game.totals[0]) ? game.players[1].name + ' wins!' : 'You tied'));
            if (game.onfinish)
            {   game.onfinish();    }
        }
        else
        {
            if (!theFlag)
            {   game.current_turn = (game.current_turn == 1) ? 2 : 1;    }
            $E("turnDiv").innerHTML = 'TURN: ' + ((game.current_turn == 1) ? game.players[0].name : game.players[1].name);
            $E("1InfoDiv").innerHTML = "[<span class='headerText'>" + game.totals[0] + "</span>] " + ((game.players[0]) ? game.players[0].name : 'Player 1');
            $E("2InfoDiv").innerHTML = "[<span class='headerText'>" + game.totals[1] + "</span>] " + ((game.players[1]) ? game.players[1].name : 'Player 2');
            if (isSet(game.current_players[game.current_turn]))
            {   setTimeout("BoredGames.game.move();", 500);    }
        }
        return true;
    },

    start: function()
    {
        var game = this;
        game.finished = false;
        game.current_turn = 1;
        game.totals =  [0, 0];
        game.board = [];
        for (var i = 0; i < game.boards[game.current_board].length; i++)
        {
            game.board[i] = [];
            for (var j = 0; j < game.boards[game.current_board][i].length; j++)
            {   game.board[i][j] = game.boards[game.current_board][i][j];    }
        }
        game.build();
        if (game.onstart)
        {   game.onstart();    }
        if (isSet(game.current_players[2]))
        {   game.setAI(2, game.current_players[2].type);    }
        if (isSet(game.current_players[1]))
        {
            game.setAI(1, game.current_players[1].type);
            setTimeout("BoredGames.game.move();", 500);
        }
    },

    settings: function()
    {
        var game = this;
        var html = '';
        html += '<h2>Settings</h2>';
        html += '<table>';
        html += '<tr><th>' + game.players[0].name + '</th>';
        html += '<td><select onchange="BoredGames.game.setAI(1, $G(this));">';
        html += '<option value="" ' + ((!isSet(game.current_players[1])) ? 'selected' : '') + ' >Person</option>';
        html += '<option value="easy" ' + ((isSet(game.current_players[1]) && game.current_players[1].type == 'easy') ? 'selected' : '') + ' >Easy Computer</option>';
        html += '<option value="medium" ' + ((isSet(game.current_players[1]) && game.current_players[1].type == 'medium') ? 'selected' : '') + ' >Normal Computer</option>';
        html += '<option value="hard" ' + ((isSet(game.current_players[1]) && game.current_players[1].type == 'hard') ? 'selected' : '') + ' >Hard Computer</option>';
        html += '</select></td></tr>';
        html += '<tr><th>' + game.players[1].name + '</th>';
        html += '<td><select onchange="BoredGames.game.setAI(2, $G(this));">';
        html += '<option value="" ' + ((!isSet(game.current_players[2])) ? 'selected' : '') + ' >Person</option>';
        html += '<option value="easy" ' + ((isSet(game.current_players[2]) && game.current_players[2].type == 'easy') ? 'selected' : '') + ' >Easy Computer</option>';
        html += '<option value="medium" ' + ((isSet(game.current_players[2]) && game.current_players[2].type == 'medium') ? 'selected' : '') + ' >Normal Computer</option>';
        html += '<option value="hard" ' + ((isSet(game.current_players[2]) && game.current_players[2].type == 'hard') ? 'selected' : '') + ' >Hard Computer</option>';
        html += '</select></td></tr>';
        html += '<tr><th>Board</th>';
        html += '<td><select onchange="BoredGames.game.current_board = $G(this); BoredGames.game.start();">';
        for (var name in game.boards)
        {
            html += '<option value="' + name + '" ' + ((name == game.current_board) ? 'selected' : '') + ' >' + name + '</option>';
        }
        html += '</select></td></tr>';
        html += '</table>';
        return html;
    },

    help_pages: 3,
    help: function(thePage)
    {
        var game = this;
        var html = '';
        switch (thePage)
        {
            case 1 :
                html += '<h3>How to play</h3>';
                html += '<p>Starting with the dots players alternate creating vertical or horizonal lines between unjoined dots.</p>';
                html += '<p>First select the dot you wish to start from. Follow up with the dot you want to connect too. The side between the two dots will turn your color.</p>';
                html += '<p>The player who finishes the last side of a box earns a "point" and gets to take another turn.</p>';
                html += '<p>The game is over when all the boxes are filled. High score wins.</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 2);">Strategies</a>';
            break;
            case 2 :
                html += '<h3>Strategies</h3>';
                html += '<p>The beginning of the game is random. There is no real advantage other than not placing a 3rd row anywhere to give the opponent a point.</p>';
                html += '<p>As the play progresses and players avoid creating the third row, this creates what is called "chains". These are the long string of 4th rows that can be placed sequentially.</p>';
                html += '<p>To keep the board from forming one giant chain that can win/lose the game, work on splitting the board into sections. This keeps the board more managable and losing a chain to your opponent less damaging.</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 3);">Computer opponents</a>';
            break;
            case 3 :
                html += '<h3>Computer opponents</h3>';
                html += '<p>There are 3 modes of computer opponent.</p>';
                html += '<h4>Easy</h4>';
                html += '<p>Moves are chosen randomly unless a box can be completed.</p>';
                html += '<h4>Normal</h4>';
                html += '<p>The computer avoids trying to place the 3rd row and then looks at each move and tallies how many pieces it can take.</p>';
                html += '<h4>Hard</h4>';
                html += '<p>This opponent will do all of the above as well as see how many pieces you can take afterwards.</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 0);">About ' + game.name + '</a>';
            break;
            default :
                html += '<h2>About ' + game.name + '</h2>';
                html += '<p>The Dot game (also know as Dots and Boxes or "Timbiriche", among others) is a two player game first published in 1889 by Édouard Lucas.</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 1);">How to play</a>';
            break;
        }
        return html;
    },

    resetStats: function ()
    {
        var game = this;
        game.current_stats =
        {
            one_wins: 0,
            one_losses: 0,
            one_ties: 0,
            one_total_pieces: 0,
            one_average_pieces: 0,
            one_max_pieces: 0,
            one_min_pieces: 0,
            one_games: 0,
            one_wins_streak: 0,
            one_wins_streak_max: 0,
            two_wins: 0,
            two_losses: 0,
            two_ties: 0,
            two_total_pieces: 0,
            two_average_pieces: 0,
            two_max_pieces: 0,
            two_min_pieces: 0,
            two_games: 0,
            two_wins_streak: 0,
            two_wins_streak_max: 0,
            time: 0
        };
    },

    saveStats: function (theTime)
    {
        var game = this;
        if (game.current_stats)
        {
            game.current_stats.time = parseInt(game.current_stats.time) + ((theTime > 0) ? theTime : 0);
            return 'one_wins=' + game.current_stats.one_wins +
                   '|one_losses=' + game.current_stats.one_losses +
                   '|one_ties=' + game.current_stats.one_ties +
                   '|one_total_pieces=' + game.current_stats.one_total_pieces +
                   '|one_average_pieces=' + game.current_stats.one_average_pieces +
                   '|one_max_pieces=' + game.current_stats.one_max_pieces +
                   '|one_min_pieces=' + game.current_stats.one_min_pieces +
                   '|one_games=' + game.current_stats.one_games +
                   '|one_wins_streak=' + game.current_stats.one_wins_streak +
                   '|one_wins_streak_max=' + game.current_stats.one_wins_streak_max +
                   '|two_wins=' + game.current_stats.two_wins +
                   '|two_losses=' + game.current_stats.two_losses +
                   '|two_ties=' + game.current_stats.two_ties +
                   '|two_total_pieces=' + game.current_stats.two_total_pieces +
                   '|two_average_pieces=' + game.current_stats.two_average_pieces +
                   '|two_max_pieces=' + game.current_stats.two_max_pieces +
                   '|two_min_pieces=' + game.current_stats.two_min_pieces +
                   '|two_games=' + game.current_stats.two_games +
                   '|two_wins_streak=' + game.current_stats.two_wins_streak +
                   '|two_wins_streak_max=' + game.current_stats.two_wins_streak_max +
                   '|time=' + game.current_stats.time;
        }
        return '';
    },

    stats: function ()
    {
        var game = this;
        var display_time = Math.round(((game.current_stats.time / 60) / 60) * 100) / 100;
        var html = '<h3>Stats</h3>';
        html += (game.current_stats.time > 0) ? "<p>You've played " + game.name + " for " + display_time + " hours</p>" : "<p>You haven't played " + game.name + " yet</p>";
        html += '<p><button type="button" onclick="BoredGames.game.resetStats(); BoredGames.saveStats(); BoredGames.showStats(true);">Reset Stats</button></p>';
        html += '<table>';
        html += '<tr><td colspan="6"><h3>' + game.players[0].name + '</h3></td></tr>';
        html += '<tr>';
        html += '<th>Wins</th><td>' + game.current_stats.one_wins + '</td>';
        html += '<th>Losses</th><td>' + game.current_stats.one_losses + '</td>';
        html += '<th>Ties</th><td>' + game.current_stats.one_ties + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<th>Average Pieces</th><td>' + game.current_stats.one_average_pieces + '</td>';
        html += '<th>Min Pieces</th><td>' + game.current_stats.one_min_pieces + '</td>';
        html += '<th>Max Pieces</th><td>' + game.current_stats.one_max_pieces + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<th>Current Win Streak</th><td>' + game.current_stats.one_wins_streak + '</td>';
        html += '<th>Max Win Streak</th><td>' + game.current_stats.one_wins_streak_max + '</td>';
        html += '<th></th><td></td>';
        html += '</tr>';
        html += '<tr><td colspan="6"><h3>' + game.players[1].name + '</h3></td></tr>';
        html += '<tr>';
        html += '<th>Wins</th><td>' + game.current_stats.two_wins + '</td>';
        html += '<th>Losses</th><td>' + game.current_stats.two_losses + '</td>';
        html += '<th>Ties</th><td>' + game.current_stats.two_ties + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<th>Average Pieces</th><td>' + game.current_stats.two_average_pieces + '</td>';
        html += '<th>Min Pieces</th><td>' + game.current_stats.two_min_pieces + '</td>';
        html += '<th>Max Pieces</th><td>' + game.current_stats.two_max_pieces + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<th>Current Win Streak</th><td>' + game.current_stats.two_wins_streak + '</td>';
        html += '<th>Max Win Streak</th><td>' + game.current_stats.two_wins_streak_max + '</td>';
        html += '<th></th><td></td>';
        html += '</tr>';
        html += '</table>';
        return html;
    },

    build: function()
    {
        var game = this;
        if (isDom(game.table))
        {
            var html = '';
            html += '<table id="controls"><tr>';
            html += '   <td id="1InfoDiv">[<span>0</span>] ' + game.players[0].name + '</td>';
            html += '   <td id="turnDiv">TURN: ' + game.players[0].name + '</td>';
            html += '   <td id="2InfoDiv">[<span>0</span>] ' + game.players[1].name + '</td>';
            html += '</tr></table>';
            html += "<div style='position: relative; width: 310px; padding: 0px; text-align: center; margin-left: 5px; border: 0px solid black; text-align: left; background: #ffffff url() 0px 0px no-repeat;'>";
            html += '<table id="dots" style="position: relative;">';
            for (var row = 0; row < game.boards[game.current_board].length; row++)
            {
                html += "<tr>";
                for (var col = 0; col < game.boards[game.current_board][row].length; col++)
                {
                    switch (game.boards[game.current_board][row][col])
                    {
                       //Blank
                        case -1 : html += '<td></td>'; break;
                       //Border
                        case 0 : html += (row % 2 != 0) ? '<td><div id="ver_' + row + '_' + col + '" class="ver_bar"></div></td>' : '<td><div id="hor_' + row + '_' + col + '" class="hor_bar"></div></td>'; break;
                       //Blank
                        case 2 : html += '<td><img id="dot_' + row + '_' + col + '" src="' + game.images[0].src + '" row="' + row + '" col="' + col + '" class="dot" onclick="BoredGames.game.move(this);" /></td>'; break;
                       //Blank
                        case 3 : html += '<td><div id="box_' + row + '_' + col + '" class="empty"></div></td>'; break;
                    }
                }
                html += "</tr>";
            }
            html += "</table></div>";
            game.table.innerHTML = html;
        }
    }
}
