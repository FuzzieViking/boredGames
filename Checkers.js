/**
 *  Build a checkers table and handle the events.
 */
var Checkers =
{
    name: 'Checkers',
    display_name: 'Checkers',
    version: 0.1,
    logo: '/js/lib/boredgames/img/check_logo.png',
    blurb: 'Battle the computer or a friend in this classic game!',
    table: null,
    onmove: '',
    onfinish: '',
    onstart: '',
    finished: false,
    see_moves: false,
    totals: [60, 2, 2],
    image_size: [38, 38],
    images: ['', '', '', ''],
    board: [],
    current_players: [],
    current_turn: 1,
    current_moves: 0,
    current_stats: {},
    init: function (theParams)
    {
        var game = this;
        game.table = $E(theParams['table']);
        game.onmove = theParams['onmove'];
        game.onfinish = theParams['onfinish'];
        game.onstart = theParams['onstart'];
        game.image_size = (theParams['image_size'] && theParams['image_size'].length > 0) ? theParams['image_size'] : [38, 38];
        game.images[0] = new Image(game.image_size[0], game.image_size[1]);
        game.images[0].src = '/js/lib/boredgames/img/rev_empty.gif';
        game.images[1] = new Image(game.image_size[0], game.image_size[1]);
        game.images[1].src = '/js/lib/boredgames/img/rev_black.gif';
        game.images[2] = new Image(game.image_size[0], game.image_size[1]);
        game.images[2].src = '/js/lib/boredgames/img/rev_white.gif';
        game.images[3] = new Image(game.image_size[0], game.image_size[1]);
        game.images[3].src = '/js/lib/boredgames/img/rev_good.gif';
       //Turn the stats into a usuable object
        if (isSet(theParams['stats']))
        {
            var pairs = theParams['stats'].split('|');
            for (var i = 0; i < pairs.length; i++)
            {
                var values = pairs[i].split('=');
                game.current_stats[values[0]] = parseFloat(values[1]);
            }
        }
        else
        {   game.resetStats();    }
        game.start();
        game.setAI(1, null);
        game.setAI(2, 'easy');
    },

    setAI: function (thePlayer, theType)
    {
        var game = this;
        if (isSet(theType))
        {
            game.current_players[thePlayer] = ReversiAI(theType);
            game.current_players[thePlayer].getPieces = game.getPieces;
            if (game.current_turn == thePlayer)
            {   game.move();    }
        }
        else
        {   game.current_players[thePlayer] = null;    }
    },

    getPieces: function (theDiv, theCol)
    {
        var game = this;

        //if (theDiv == 3 && theCol == 2) { alert(game.name); }
        var enemyColor = (game.current_turn == 1) ? 2 : 1;
        var row = (isDom(theDiv)) ? parseInt(theDiv.getAttribute("row")) : theDiv;
        var col = (isDom(theDiv)) ? parseInt(theDiv.getAttribute("col")) : theCol;
        var pieces = [];
        var total_rows = 0;
        for (var index = 0; index < game.board.length; index++)
        {total_rows++;
            var flag = false;
            var tempPieces = [];
            for (var innerIndex = 1; innerIndex < game.board[index].length; innerIndex++)
            {total_rows++;
                var r = (row + (game.nav_rows[index] * innerIndex));
                var c = (col + (game.nav_cols[index] * innerIndex));
                if (r < 0 || r > 7 || c < 0 || c > 7)
                {    break;    }
                if (!isSet(game.board[r]))
                {  alert('[' + r + '] [' + c + '] [' + row + '] [' + col + '] id [' + theDiv + '] [' + theCol + '] total [' + total_rows + ']');  }
                var s = game.board[r][c];
                if (s == 0)
                {    break;    }
                else if (s == enemyColor)
                {    tempPieces[tempPieces.length] = (("" + r) + c);    }
                else if (s == game.current_turn)
                {    flag = true; break;    }
            }
            if (tempPieces.length > 0 && isSet(flag))
            {
                for (var i = 0; i < tempPieces.length; i++)
                {   pieces[pieces.length] = tempPieces[i];   }
            }
        }
        //alert('id [' + theDiv + '] [' + theCol + '] total [' + total_rows + ']');
        return (pieces.length > 0) ? pieces : false;
    },

    flipPieces: function (theArray)
    {
        if (isSet(theArray) && theArray.length > 0)
        {
            var game = this;
            var enemy_color = (game.current_turn == 1) ? 2 : 1;
            for (var index = 0; index < theArray.length; index++)
            {
                var square = $E("square" + theArray[index]);
                if (isDom(square) && square.src != game.images[game.current_turn].src)
                {
                    square.src = game.images[game.current_turn].src;
                    game.board[square.getAttribute("row")][square.getAttribute("col")] = game.current_turn;
                    game.totals[game.current_turn]++;
                   //The first piece is the new piece added
                    if (index == 0)
                    {   game.totals[0]--;    }
                    else
                    {   game.totals[enemy_color]--;    }
                }
            }
        }
    },

    move: function (theDiv, theRow, theCol)
    {
        var game = this;
        var count = game.getTotals();
        if (!game.finished)
        {
            if (isDom(theDiv) && game.board[theDiv.getAttribute("row")][theDiv.getAttribute("col")] == 0)
            {
                if (isSet(game.current_players[game.current_turn]))
                {   alert("The computer is thinking...");    }
                else if (isSet(game.current_players[game.current_turn]) && isSet(theFlag) || isNotSet(game.current_players[game.current_turn]))
                {
                    var pieces = game.getPieces(theDiv);
                    if (isSet(pieces) && pieces.length > 0)
                    {
                        pieces[pieces.length] = theDiv.getAttribute("row") + '' + theDiv.getAttribute("col");
                        game.flipPieces(pieces);
                        game.board[theDiv.getAttribute("row")][theDiv.getAttribute("col")] = game.current_turn;
                        $E("turnDiv").innerHTML = (game.finished) ? 'Game over!' : (game.current_turn == 1) ? "Blacks turn" : "Whites turn";
                        $E("blackInfoDiv").innerHTML = "[<span class='headerText'>" + count[1] + "</span>] Black";
                        $E("whiteInfoDiv").innerHTML = "[<span class='headerText'>" + count[2] + "</span>] White";
                        game.current_moves++;
                        return game.nextTurn();
                    }
                }
            }
            else if (!isDom(theDiv) && isSet(game.current_players[game.current_turn]))
            {
                var square = game.current_players[game.current_turn].move(game);
                //alert(square['row'] + '\n' + square['col']);
                var pieces = game.getPieces(square['row'], square['col']);
                if (isSet(pieces) && pieces.length > 0)
                {
                    pieces[pieces.length] = square['row'] + '' + square['col'];
                    game.flipPieces(pieces);
                    game.board[square['row']][square['col']] = game.current_turn;
                    $E("turnDiv").innerHTML = (game.finished) ? 'Game over!' : (game.current_turn == 1) ? "Blacks turn" : "Whites turn";
                    $E("blackInfoDiv").innerHTML = "[<span class='headerText'>" + count[1] + "</span>] Black";
                    $E("whiteInfoDiv").innerHTML = "[<span class='headerText'>" + count[2] + "</span>] White";
                    game.current_moves++;
                    return game.nextTurn();
                }
            }
        }
        return false;
    },

    nextTurn: function ()
    {
        var game = this;
        game.current_turn = (game.current_turn == 1) ? 2 : 1;
        if (!game.showMoves())
        {
            game.current_turn = (game.current_turn == 1) ? 2 : 1;
            if (!game.showMoves())
            {
                game.finished = true;
                var count = game.getTotals();
                if (!isSet(game.current_players[1]))
                {
                    game.current_stats.b_games++;
                    if (count[1] > count[2])
                    {
                        game.current_stats.b_wins++;
                        game.current_stats.b_wins_streak++;
                        game.current_stats.b_wins_streak_max = (game.current_stats.b_wins_streak > game.current_stats.b_wins_streak_max) ? game.current_stats.b_wins_streak : game.current_stats.b_wins_streak_max;
                    }
                    else if (count[2] > count[1])
                    {
                        game.current_stats.b_losses++;
                        game.current_stats.b_wins_streak = 0;
                    }
                    else
                    {
                        game.current_stats.b_ties++;
                        game.current_stats.b_wins_streak = 0;
                    }

                    game.current_stats.b_max_moves = (game.current_moves > game.current_stats.b_max_moves || game.current_stats.b_max_moves == 0) ? game.current_moves : game.current_stats.b_max_moves;
                    game.current_stats.b_min_moves = (game.current_moves < game.current_stats.b_min_moves || game.current_stats.b_min_moves == 0) ? game.current_moves : game.current_stats.b_min_moves;
                   //Now calculate averages
                    game.current_stats.b_total_moves += game.current_moves;alert(game.current_stats.b_total_moves);
                    game.current_stats.b_average_moves = Math.round((game.current_stats.b_total_moves / game.current_stats.b_games) * 100) / 100;
                }
                if (!isSet(game.current_players[2]))
                {
                    game.current_stats.w_games++;
                    if (count[1] > count[2])
                    {
                        game.current_stats.w_wins++;
                        game.current_stats.w_wins_streak++;
                        game.current_stats.w_wins_streak_max = (game.current_stats.w_wins_streak > game.current_stats.w_wins_streak_max) ? game.current_stats.w_wins_streak : game.current_stats.w_wins_streak_max;
                    }
                    else if (count[2] > count[1])
                    {
                        game.current_stats.w_losses++;
                        game.current_stats.w_wins_streak = 0;
                    }
                    else
                    {
                        game.current_stats.w_ties++;
                        game.current_stats.w_wins_streak = 0;
                    }

                    game.current_stats.w_max_moves = (game.current_moves > game.current_stats.w_max_moves || game.current_stats.w_max_moves == 0) ? game.current_moves : game.current_stats.w_max_moves;
                    game.current_stats.w_min_moves = (game.current_moves < game.current_stats.w_min_moves || game.current_stats.w_min_moves == 0) ? game.current_moves : game.current_stats.w_min_moves;
                   //Now calculate averages
                    game.current_stats.w_total_moves += game.current_moves;
                    game.current_stats.w_average_moves = Math.round((game.current_stats.w_total_moves / game.current_stats.w_games) * 100) / 100;
                }
                $E("turnDiv").innerHTML = 'Game over!<br />' + ((game.totals[1] > game.totals[2]) ? "Black wins" : ((game.totals[1] < game.totals[2]) ? "White wins" : "This is rare, you tied"));
                $E("blackInfoDiv").innerHTML = "[<span class='headerText'>" + count[1] + "</span>] Black";
                $E("whiteInfoDiv").innerHTML = "[<span class='headerText'>" + count[2] + "</span>] White";
                if (game.onfinish)
                {   game.onfinish();    }
            }
            else if (isSet(game.current_players[game.current_turn]))
            {    setTimeout("Reversi.move()", 500);    }
            else
            {
                var count = game.getTotals();
                $E("turnDiv").innerHTML = (game.finished) ? 'Game over!' : (game.current_turn == 1) ? "Blacks turn" : "Whites turn";
                $E("blackInfoDiv").innerHTML = "[<span class='headerText'>" + count[1] + "</span>] Black";
                $E("whiteInfoDiv").innerHTML = "[<span class='headerText'>" + count[2] + "</span>] White";
            }
        }
        else if (isSet(game.current_players[game.current_turn]))
        {    setTimeout("Reversi.move()", 500);    }
        return true;
    },

    showMoves: function (theFlag)
    {
        var flag = false;
        var game = this;
        if (theFlag === true || theFlag === false)
        {   game.see_moves = theFlag;    }
       //now show/turnoff the possible moves
        for (var row = 0; row < game.board.length; row++)
        {
            for (var col = 0; col < game.board[row].length; col++)
            {
                var piece = game.board[row][col];
                if (piece == 0)
                {
                    if (isSet(game.getPieces(row, col)))
                    {
                        flag = true;
                        $E("square" + row + col).src = game.images[((game.see_moves && !isSet(game.current_players[game.current_turn])) ? 3 : 0)].src;
                    }
                    else if (isDom($E("square" + row + col)))
                    {   $E("square" + row + col).src = game.images[0].src;    }
                }
            }
            //if (isSet(flag) && !game.see_moves && isNotSet(theFlag))
            //{   break;   }
        }//end rows
        return flag;
    },

    start: function()
    {
        var game = this;
        game.board =[
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,2,1,0,0,0],
                        [0,0,0,1,2,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0]
                    ];
        game.finished = false;
        game.current_turn = 1;
        game.current_moves = 0;
        game.totals = [60, 2, 2];
        game.build();
        game.showMoves();
        if (game.onstart)
        {   game.onstart();    }
        if (isSet(game.current_players[2]))
        {   game.setAI(2, game.current_players[2].type);    }
        if (isSet(game.current_players[1]))
        {
            game.setAI(1, game.current_players[1].type);
            setTimeout("BoredGames.game.move()", 500);
        }
    },

    settings: function()
    {
        var game = this;
        var html = '';
        html += '<h2>Settings</h2>';
        html += '<table>';
        html += '<tr><th>Black Player</th>';
        html += '<td><select onchange="BoredGames.game.setAI(1, $G(this));">';
        html += '<option value="" ' + ((!isSet(game.current_players[1])) ? 'selected' : '') + ' >Person</option>';
        html += '<option value="easy" ' + ((isSet(game.current_players[1]) && game.current_players[1].type == 'easy') ? 'selected' : '') + ' >Easy Computer</option>';
        html += '<option value="medium" ' + ((isSet(game.current_players[1]) && game.current_players[1].type == 'medium') ? 'selected' : '') + ' >Normal Computer</option>';
        html += '<option value="hard" ' + ((isSet(game.current_players[1]) && game.current_players[1].type == 'hard') ? 'selected' : '') + ' >Hard Computer</option>';
        html += '</select></td></tr>';
        html += '<tr><th>White Player</th>';
        html += '<td><select onchange="BoredGames.game.setAI(2, $G(this));">';
        html += '<option value="" ' + ((!isSet(game.current_players[2])) ? 'selected' : '') + ' >Person</option>';
        html += '<option value="easy" ' + ((isSet(game.current_players[2]) && game.current_players[2].type == 'easy') ? 'selected' : '') + ' >Easy Computer</option>';
        html += '<option value="medium" ' + ((isSet(game.current_players[2]) && game.current_players[2].type == 'medium') ? 'selected' : '') + ' >Normal Computer</option>';
        html += '<option value="hard" ' + ((isSet(game.current_players[2]) && game.current_players[2].type == 'hard') ? 'selected' : '') + ' >Hard Computer</option>';
        html += '</select></td></tr>';
        html += '<tr><th></th>';
        html += '<td><button type="button" onclick="BoredGames.game.resetStats(); BoredGames.saveStats();">Reset Stats</button>';
        html += '</table>';
        return html;
    },

    resetStats: function ()
    {
        var game = this;
        game.current_stats =
        {
            b_wins: 0,
            b_losses: 0,
            b_ties: 0,
            b_total_moves: 0,
            b_average_moves: 0,
            b_max_moves: 0,
            b_min_moves: 0,
            b_games: 0,
            b_wins_streak: 0,
            b_wins_streak_max: 0,
            w_wins: 0,
            w_losses: 0,
            w_ties: 0,
            w_total_moves: 0,
            w_average_moves: 0,
            w_max_moves: 0,
            w_min_moves: 0,
            w_games: 0,
            w_wins_streak: 0,
            w_wins_streak_max: 0,
            time: 0
        };
    },

    saveStats: function (theTime)
    {
        var game = this;
        if (game.current_stats)
        {
            game.current_stats.time = parseInt(game.current_stats.time) + ((theTime > 0) ? theTime : 0);
            return 'b_wins=' + game.current_stats.b_wins +
                   '|b_losses=' + game.current_stats.b_losses +
                   '|b_ties=' + game.current_stats.b_ties +
                   '|b_average_moves=' + game.current_stats.b_average_moves +
                   '|b_max_moves=' + game.current_stats.b_max_moves +
                   '|b_min_moves=' + game.current_stats.b_min_moves +
                   '|b_games=' + game.current_stats.b_games +
                   '|b_wins_streak=' + game.current_stats.b_wins_streak +
                   '|b_wins_streak_max=' + game.current_stats.b_wins_streak_max +
                   '|w_wins=' + game.current_stats.w_wins +
                   '|w_losses=' + game.current_stats.w_losses +
                   '|w_ties=' + game.current_stats.w_ties +
                   '|w_average_moves=' + game.current_stats.w_average_moves +
                   '|w_max_moves=' + game.current_stats.w_max_moves +
                   '|w_min_moves=' + game.current_stats.w_min_moves +
                   '|w_games=' + game.current_stats.w_games +
                   '|w_wins_streak=' + game.current_stats.w_wins_streak +
                   '|w_wins_streak_max=' + game.current_stats.w_wins_streak_max +
                   '|time=' + game.current_stats.time;
        }
        return '';
    },

    stats: function ()
    {
        var game = this;
        var display_time = Math.round(((game.current_stats.time / 60) / 60) * 100) / 100;
        var html = '<h3>Stats</h3>';
        html += (game.current_stats.time > 0) ? "<p>You've played " + game.name + " for " + display_time + " hours" : "<p>You haven't played " + game.name + " yet";
        html += '<table>';
        html += '<tr><td colspan="6"><h3>As Black Player</h3></td></tr>';
        html += '<tr>';
        html += '<th>Wins</th><td>' + game.current_stats.b_wins + '</td>';
        html += '<th>Losses</th><td>' + game.current_stats.b_losses + '</td>';
        html += '<th>Ties</th><td>' + game.current_stats.b_ties + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<th>Average Moves</th><td>' + game.current_stats.b_average_moves + '</td>';
        html += '<th>Min Moves</th><td>' + game.current_stats.b_min_moves + '</td>';
        html += '<th>Max Moves</th><td>' + game.current_stats.b_max_moves + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<th>Current Win Streak</th><td>' + game.current_stats.b_wins_streak + '</td>';
        html += '<th>Max Win Streak</th><td>' + game.current_stats.b_wins_streak_max + '</td>';
        html += '<th></th><td></td>';
        html += '</tr>';
        html += '<tr><td colspan="6"><h3>As White Player</h3></td></tr>';
        html += '<tr>';
        html += '<th>Wins</th><td>' + game.current_stats.w_wins + '</td>';
        html += '<th>Losses</th><td>' + game.current_stats.w_losses + '</td>';
        html += '<th>Ties</th><td>' + game.current_stats.w_ties + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<th>Average Moves</th><td>' + game.current_stats.w_average_moves + '</td>';
        html += '<th>Min Moves</th><td>' + game.current_stats.w_min_moves + '</td>';
        html += '<th>Max Moves</th><td>' + game.current_stats.w_max_moves + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<th>Current Win Streak</th><td>' + game.current_stats.w_wins_streak + '</td>';
        html += '<th>Max Win Streak</th><td>' + game.current_stats.w_wins_streak_max + '</td>';
        html += '<th></th><td></td>';
        html += '</tr>';
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
                html += '<p>The 8 x 8 grid starts with the middle 4 squares taken by 2 white and 2 black pieces.</p>';
                html += '<p>Black goes first. Players take turns placing a new piece on the board in their color until the board is full or there are no more valid moves.</p>';
                html += '<p>A play is valid only when there are pieces of the opposite color between the newly placed piece and another piece of the players. No spaces can exist between this "line".</p>';
                html += '<p>All of the opponents pieces are then converted to the players color.</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 2);">Strategies</a>';
            break;
            case 2 :
                html += '<h3>Strategies</h3>';
                html += '<p>Corners are key, as they are the only positions that cannot be turned. Edges are next in importance since they are harder to turn.</p>';
                html += '<p>Try not to focus on how many pieces you can take in a single move, especially in the beginning. Your position and where your opponent can move after is more important.';
                html += '<p>Towards the end of the game (last 20 moves or so), focus on building a spread of pieces from the corners/edges you control that can not be taken back. This can lead to a series of moves where the opponent has no play so you get to go again!</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 3);">Computer opponents</a>';
            break;
            case 3 :
                html += '<h3>Computer opponents</h3>';
                html += '<p>There are 3 modes of computer opponent.</p>';
                html += '<h4>Easy</h4>';
                html += '<p>Moves are chosen randomly.</p>';
                html += '<h4>Normal</h4>';
                html += '<p>The computer looks at each move and tallies how many pieces it can take, then checks where it is on the board.</p>';
                html += '<h4>Hard</h4>';
                html += '<p>This opponent will check a pieces stability (how many pieces can cause it to be turned), mobility (how many empty spaces surround it), where it resides on the board, and then how many pieces you can take afterwards.</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 0);">About ' + game.name + '</a>';
            break;
            default :
                html += '<h3>About</h3>';
                html += '<p>The first documentable versions of the game come from England in 1883, where it grew in popularity through the 19th century.</p>';
                html += '<p>The modern tournament rules originated in the 1970s when a Japenese game company Tsukuda Original released a version of the game called Othello.</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 1);">How to play</a>';
            break;
        }
        return html;
    },

    build: function()
    {
        var game = this;
        if (isDom(game.table))
        {
            var html = "<div style='position: relative; width: 304px; margin-left: 7px; border: 1px solid black;'>";
            //var html = "<table style='border-collapse:collapse;padding: 0px !important;background: #ff00ff;'>";
            for (var row = 0; row < game.board.length; row++)
            {
                //html += "<tr>";
                for (var col = 0; col < game.board[row].length; col++)
                //{   html += "<td><img id='square" + row + col + "' src='" + game.images[game.board[row][col]].src + "' row='" + row + "' col='" + col + "' onclick='Reversi.move(this);' style='padding: 0px 0px 0px !important;margin: 0px 0px -3px 0px!important;' /></td>";    }
                {   html += "<img id='square" + row + col + "' src='" + game.images[game.board[row][col]].src + "' row='" + row + "' col='" + col + "' style='padding: 0px 0px 0px !important;margin: 0px 0px -3px 0px!important;' onclick='Reversi.move(this);' />";    }
                //html += "</tr>";
            }
            html += "</div>";
            //html += "</table>";
            html += '<div id="controls">';
            html += '   <div id="turnDiv">Blacks turn</div>';
            html += '   <div id="blackInfoDiv">[<span>2</span>] Black</div>';
            html += '   <div id="whiteInfoDiv">[<span>2</span>] White</div>';
            html += '</div>';
            game.table.innerHTML = html;
        }
    },

    getTotals: function ()
    {
        var game = this;
        return game.totals;
    }
}
