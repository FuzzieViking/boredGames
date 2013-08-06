/**
 *  Build a tic tac toe table and handle the events.
 */
var TicTacToe =
{
    name: 'TicTacToe',
    display_name: 'Tic-Tac-Toe',
    version: 0.1,
    logo: 'ttt_logo.png',
    blurb: 'You know it. You love it. 3 in a row to win!',
    table: null,
    paths: {},
    onmove: '',
    onfinish: '',
    onstart: '',
    finished: false,
    images: ['', '', ''],
    board: [],
    current_players: [],
    current_turn: 1,
    current_stats: {},
    init: function (theParams)
    {
        var game = this;
        game.table = $E(theParams['table']);
        game.onmove = theParams['onmove'];
        game.onfinish = theParams['onfinish'];
        game.onstart = theParams['onstart'];
        game.paths = theParams['paths'];
        game.image_size = [90, 90];
        game.images[0] = new Image(game.image_size[0], game.image_size[1]);
        game.images[0].src = game.paths.img + 'ttt_empty.png';
        game.images[1] = new Image(game.image_size[0], game.image_size[1]);
        game.images[1].src = game.paths.img + 'ttt_x.png';
        game.images[2] = new Image(game.image_size[0], game.image_size[1]);
        game.images[2].src = game.paths.img + 'ttt_o.png';
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
        {
            game.current_stats =
            {
                xwins: 0,
                xlosses: 0,
                xties: 0,
                owins: 0,
                olosses: 0,
                oties: 0,
                time: 0
            };
        }
        game.start();
        game.setAI(1, null);
        game.setAI(2, 'easy');
    },

    setAI: function (thePlayer, theType)
    {
        var game = this;
        if (isSet(theType))
        {
            game.current_players[thePlayer] = TicTacToeAI(theType);
            game.current_players[thePlayer].getPieces = game.getPieces;
            if (game.current_turn == thePlayer)
            {   game.move();    }
        }
        else
        {   game.current_players[thePlayer] = null;    }
    },

    move: function (theDiv, theRow, theCol)
    {
        var game = this;
        if (!game.finished)
        {
            if (isDom(theDiv) && game.board[theDiv.getAttribute("row")][theDiv.getAttribute("col")] == 0)
            {
                if (isSet(game.current_players[game.current_turn]))
                {   alert("The computer is thinking...");    }
                else if (isSet(game.current_players[game.current_turn]) && isSet(theFlag) || isNotSet(game.current_players[game.current_turn]))
                {
                    game.board[theDiv.getAttribute("row")][theDiv.getAttribute("col")] = game.current_turn;
                    theDiv.src = game.images[game.current_turn].src;
                    return game.nextTurn();
                }
            }
            else if (!isDom(theDiv) && isSet(game.current_players[game.current_turn]))
            {
                var square = game.current_players[game.current_turn].move(game);
                game.board[square['row']][square['col']] = game.current_turn;
                $E('square' + square['row'] + square['col']).src = game.images[game.current_turn].src;
                if (!isDom($E('square' + square['row'] + square['col'])))
                    {   alert("NOOOOOO");    }
                return game.nextTurn();
            }
        }
        return false;
    },

    nextTurn: function ()
    {
        var game = this;
       //Did they win?
        if (
           //Across top
            (game.board[0][0] !== 0 && game.board[0][0] == game.board[0][1] && game.board[0][0] == game.board[0][2]) ||
           //Across middle
            (game.board[1][0] !== 0 && game.board[1][0] == game.board[1][1] && game.board[1][0] == game.board[1][2]) ||
           //Across bottom
            (game.board[2][0] !== 0 && game.board[2][0] == game.board[2][1] && game.board[2][0] == game.board[2][2]) ||
           //Down left
            (game.board[0][0] !== 0 && game.board[0][0] == game.board[1][0] && game.board[0][0] == game.board[2][0]) ||
           //Down middle
            (game.board[0][1] !== 0 && game.board[0][1] == game.board[1][1] && game.board[0][1] == game.board[2][1]) ||
           //Down right
            (game.board[0][2] !== 0 && game.board[0][2] == game.board[1][2] && game.board[0][2] == game.board[2][2]) ||
           //Diagonal down
            (game.board[0][0] !== 0 && game.board[0][0] == game.board[1][1] && game.board[0][0] == game.board[2][2]) ||
           //Diagonal up
            (game.board[0][2] !== 0 && game.board[0][2] == game.board[1][1] && game.board[0][2] == game.board[2][0]))
        {
            if (!game.finished)
            {
                game.finished = true;
                $E("turnDiv").innerHTML = 'Game over!<br />' + ((game.current_turn == 1) ? game.players[0].name : game.players[1].name) + " wins";
                if (!isSet(game.current_players[1]))
                {
                    game.current_stats.xwins += (game.current_turn == 1) ? 1 : 0;
                    game.current_stats.xlosses += (game.current_turn == 2) ? 1 : 0;
                }
                if (!isSet(game.current_players[2]))
                {
                    game.current_stats.owins += (game.current_turn == 2) ? 1 : 0;
                    game.current_stats.olosses += (game.current_turn == 1) ? 1 : 0;
                }
                if (game.onfinish)
                {   game.onfinish();    }
            }
        }
       //Are they out of moves?
        if (!game.finished)
        {
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
                if (!isSet(game.current_players[1]))
                {
                    game.current_stats.xties += 1;
                }
                if (!isSet(game.current_players[2]))
                {
                    game.current_stats.oties += 1;
                }
                $E("turnDiv").innerHTML = 'Game over!<br />You tied';
                if (game.onfinish)
                {   game.onfinish();    }
            }
            else
            {
                game.current_turn = (game.current_turn == 1) ? 2 : 1;
                $E("turnDiv").innerHTML = ((game.current_turn == 1) ? game.players[0].name : game.players[1].name) + "s turn";
                if (isSet(game.current_players[game.current_turn]))
                {   setTimeout("BoredGames.game.move();", 500);    }
            }
        }
        return true;
    },

    start: function()
    {
        var game = this;
        game.board =[
                        [0,0,0],
                        [0,0,0],
                        [0,0,0]
                    ];
        game.finished = false;
        game.current_turn = 1;
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
        html += '<option value="hard" ' + ((isSet(game.current_players[1]) && game.current_players[1].type == 'hard') ? 'selected' : '') + ' >Hard Computer</option>';
        html += '</select></td></tr>';
        html += '<tr><th>' + game.players[1].name + '</th>';
        html += '<td><select onchange="BoredGames.game.setAI(2, $G(this));">';
        html += '<option value="" ' + ((!isSet(game.current_players[2])) ? 'selected' : '') + ' >Person</option>';
        html += '<option value="easy" ' + ((isSet(game.current_players[2]) && game.current_players[2].type == 'easy') ? 'selected' : '') + ' >Easy Computer</option>';
        html += '<option value="hard" ' + ((isSet(game.current_players[2]) && game.current_players[2].type == 'hard') ? 'selected' : '') + ' >Hard Computer</option>';
        html += '</select></td></tr>';
        html += '</table>';
        return html;
    },

    help_pages: 2,
    help: function(thePage)
    {
        var game = this;
        var html = '';
        switch (thePage)
        {
            case 1 :
                html += '<h2>How to play ' + game.name + '</h2>';
                html += '<h3>X stategies</h3>';
                html += '<p>For starters, play a corner! The key to X victory is to start on a corner and then try to create a fork.</p>';
                html += '<p>A fork is where you leave an oppenent with 2 choices where no matter the choice, the opposite move will win.</p>';
                html += '<h3>O strategies</h3>';
                html += '<p>O has 2 starting moves, depending on what X does. If X takes center, then O must take a corner. If X takes any other place it must take center or O will lose.</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 2);">Computer opponents</a>';
            break;
            case 2 :
                html += '<h2>Computer opponents</h2>';
                html += '<p>There are 2 modes of computer opponent.</p>';
                html += '<h3>Easy</h3>';
                html += '<p>Easy randomly chooses spots unless it can win or block</p>';
                html += '<h3>Hard</h3>';
                html += '<p>Hard can not be beat, only tied. X or O.</p>';
                html += '<a href="javascript: BoredGames.showHelp(true, 0);">About ' + game.name + '</a>';
            break;
            default :
                html += '<h2>About ' + game.name + '</h2>';
                html += '<p>Tic-Tac-Toe has been around for so long no one really knows the true origin story.</p>';
                html += '<p>Some interesting facts:<ul>';
                html += '<li>In the UK it is known as "Noughts and Crosses" and has been played for centuries</li>';
                html += '<li>It has been claimed that Egyptians played the game as early as 1300 B.C.</li>';
                html += '<li>Evidence has been found that a game called "Terni Lapilli" was played in Ancient Rome</li>';
                html += '</ul></p>';
                html += '<br /><p>The concept is simple. X goes first, choosing an open square. O follows. The basic objective is to get 3 in a row of your piece.</p>';
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
            xwins: 0,
            xlosses: 0,
            xties: 0,
            owins: 0,
            olosses: 0,
            oties: 0,
            time: 0
        };
    },

    saveStats: function (theTime)
    {
        var game = this;
        if (game.current_stats)
        {
            game.current_stats.time = parseInt(game.current_stats.time) + ((theTime > 0) ? theTime : 0);
            return 'xwins=' + game.current_stats.xwins +
                   '|xlosses=' + game.current_stats.xlosses +
                   '|xties=' + game.current_stats.xties +
                   '|owins=' + game.current_stats.owins +
                   '|olosses=' + game.current_stats.olosses +
                   '|oties=' + game.current_stats.oties +
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
        html += '<tr><th>Wins</th><td>' + game.current_stats.xwins + '</td>';
        html += '<th>Losses</th><td>' + game.current_stats.xlosses + '</td>';
        html += '<th>Ties</th><td>' + game.current_stats.xties + '</td></tr>';
        html += '<tr><td colspan="6"><h3>' + game.players[1].name + '</h3></td></tr>';
        html += '<tr><th>Wins</th><td>' + game.current_stats.owins + '</td>';
        html += '<th>Losses</th><td>' + game.current_stats.olosses + '</td>';
        html += '<th>Ties</th><td>' + game.current_stats.oties + '</td></tr>';
        html += '</table>';
        return html;
    },

    build: function()
    {
        var game = this;
        if (isDom(game.table))
        {
            var html = "<div style='position: relative; width: 310px; padding: 0px; margin-left: 5px; border: 0px solid black; text-align: left; background: #ffffff url(" + game.paths.img + "ttt_board.png) 0px 0px no-repeat;'>";
            for (var row = 0; row < game.board.length; row++)
            {
                for (var col = 0; col < game.board[row].length; col++)
                {   html += "<img id='square" + row + col + "' src='" + game.images[game.board[row][col]].src + "' row='" + row + "' col='" + col + "' style='padding: 0px !important;margin: 4px 5px !important; border: 0px solid green;' onclick='BoredGames.game.move(this);' />";    }
            }
            html += "</div>";
            html += '<div id="controls">';
            html += '   <div id="turnDiv">Xs turn</div>';
            html += '</div>';
            game.table.innerHTML = html;
        }

    }
}
