/**
 *  These classes control the
GAME:win=x|losses=y|ties=z|time=q
 **/
var BoredGames =
{
    version: 0.1,
    name: 'Board Games',
    games: ['TicTacToe', 'Reversi', 'Dots', 'Checkers'],//, 'InARow', ],
    stats: {},
    paths: {},
    target: '',
    game: null,
    game_start: null,
    current_theme: 0,
    themes:
    [
        {
            name: 'default',
            display_name: 'Default',
            img_path: '',

        },
        {
            name: 'forest',
            display_name: 'Forest',
            img_path: '',

        }
    ],
    players:
    [
        {
            name: 'Player 1',
            color: '000000'
        },
        {
            name: 'Player 2',
            color: 'fffafa'
        }
    ],
    init: function (theParams)
    {
        var bg = this;
        bg.target = theParams['target'];
        bg.paths = theParams['paths'] || { css: '/js/lib/boredgames/css/', img: '/js/lib/boredgames/img/' };
        var raw_stats = Cookie.get('BoredGames');
        if (raw_stats)
        {
            var all_game_stats = raw_stats.split('~');
            for (var i = 0; i < all_game_stats.length; i++)
            {
                var game_stats = all_game_stats[i].split(':');
                if (game_stats[0] == 'settings')
                {
                    var pls = game_stats[1].split('|');
                    for (var j = 0; j < pls.length; j++)
                    {
                        var values = pls[j].split('=');
                        if (j == 2)
                        {   bg.current_theme = values[0];    }
                        else
                        {
                            bg.players[j].name = values[0];
                            bg.players[j].color = values[1];
                        }
                    }
                }
                else
                {   bg.stats[game_stats[0]] = game_stats[1];    }
            }
        }
        if (isDom(bg.target))
        {   bg.build();    }
    },
    showMenu: function (theFlag)
    {
        var bg = this;
        if (theFlag === true || theFlag === false)
        {   $E('boredgames_menu').style.display = (theFlag) ? 'block' : 'none';    }
        else
        {   $E('boredgames_menu').style.display = ($E('boredgames_menu').style.display == 'block') ? 'none' : 'block';    }
        if ($E('boredgames_menu').style.display == 'block' && isObject(bg.game))
        {
            $E('boredgames_help').style.display = 'none';
            $E('boredgames_stats').style.display = 'none';
            $E('boredgames_settings').style.display = 'none';
            $E('boredgames_board').style.display = 'none';
        }
        else
        {   bg.exit();    }
    },
    showHelp: function (theFlag, thePage)
    {
        var bg = this;
        if (theFlag === true || theFlag === false)
        {   $E('boredgames_help').style.display = (theFlag) ? 'block' : 'none';    }
        else
        {   $E('boredgames_help').style.display = ($E('boredgames_help').style.display == 'block') ? 'none' : 'block';    }
        if ($E('boredgames_help').style.display == 'block' && isObject(bg.game))
        {
            $E('boredgames_help').innerHTML = bg.game.help((thePage <= bg.game.help_pages) ? thePage : 0);
            $E('boredgames_stats').style.display = 'none';
            $E('boredgames_settings').style.display = 'none';
            $E('boredgames_menu').style.display = 'none';
            $E('boredgames_board').style.display = 'none';
        }
        else
        {   bg.exit();    }
    },
    load: function (theGame)
    {
        var bg = this;
        bg.game = eval(theGame);
        if (isObject(bg.game))
        {
            bg.game.players = bg.players;
            $E('boredgames_title').innerHTML = bg.game.name;
            bg.game.init({
                            table: 'boredgames_board',
                            stats: bg.stats[bg.game.name] || null,
                            onstart: function ()
                            {   BoredGames.start();    },
                            onfinish: function ()
                            {   BoredGames.finish();    }
                         });
        }
        $E('boredgames_board').style.display = 'block';
        $E('boredgames_menu_icon').style.display = 'block';
        $E('boredgames_settings_icon').style.display = 'block';
        $E('boredgames_help_icon').style.display = 'block';
        $E('boredgames_stats_icon').style.display = 'block';
        $E('boredgames_new_icon').style.display = 'block';
        $E('boredgames_exit_icon').style.display = 'block';
        $E('boredgames_stats').style.display = 'none';
        $E('boredgames_menu').style.display = 'none';
        $E('boredgames_settings').style.display = 'none';
        $E('boredgames_help').style.display = 'none';
    },
    showStats: function (theFlag)
    {
        var bg = this;
        if (theFlag === true || theFlag === false)
        {   $E('boredgames_stats').style.display = (theFlag) ? 'block' : 'none';    }
        else
        {   $E('boredgames_stats').style.display = ($E('boredgames_stats').style.display == 'block') ? 'none' : 'block';    }
        if ($E('boredgames_stats').style.display == 'block' && isObject(bg.game))
        {
            $E('boredgames_stats').innerHTML = bg.game.stats();
            $E('boredgames_settings').style.display = 'none';
            $E('boredgames_menu').style.display = 'none';
            $E('boredgames_help').style.display = 'none';
            $E('boredgames_board').style.display = 'none';
        }
        else
        {   bg.exit();    }
    },
    saveStats: function (theTime)
    {
        var bg = this;
        if (isObject(bg.game))
        {
            bg.stats[bg.game.name] = bg.game.saveStats(theTime);
            var cookie = [];
            cookie[cookie.length] = 'settings:' + bg.players[0].name + '=' + bg.players[0].color + '|' + bg.players[1].name + '=' + bg.players[1].color + '|' + bg.current_theme;
            for (var i = 0; i < bg.games.length; i++)
            {   cookie[cookie.length] = bg.games[i] + ':' + ((bg.stats[bg.games[i]]) ? bg.stats[bg.games[i]] : '');    }
            Cookie.set('BoredGames', cookie.join('~'), 360);
        }
    },
    showSettings: function (theFlag)
    {
        var bg = this;
        if (theFlag === true || theFlag === false)
        {   $E('boredgames_settings').style.display = (theFlag) ? 'block' : 'none';    }
        else
        {   $E('boredgames_settings').style.display = ($E('boredgames_settings').style.display == 'block') ? 'none' : 'block';    }
        if ($E('boredgames_settings').style.display == 'block' && isObject(bg.game))
        {
            var html = bg.game.settings();
            html += '<h2>Global</h2>';
            html += '<table>';
            html += '<tr><th>Theme</th>';
            html += '<td><select onchange="BoredGames.current_theme = $G(this); BoredGames.saveStats();">';
            for (var i = 0; i < bg.themes.length; i++)
            {
                html += '<option value="' + i + '"  >' + bg.themes[i].name + '</option>';
            }
            html += '</select></td></tr>';
            html += '<tr><th>Player 1</th>';
            html += '<td><input type="text" onblur="BoredGames.players[0].name = $G(this); BoredGames.saveStats();" value="' + bg.players[0].name + '" /></td></tr>';
            html += '<tr><th>Color</th>';
            html += '<td><select onchange="BoredGames.players[0].color = $G(this); BoredGames.saveStats();">';
            html += '<option value="#fffafa" ' + ((bg.players[0].color == '#ffffff') ? 'selected' : '') + ' >White</option>';
            html += '<option value="#000000" ' + ((bg.players[0].color == '#000000') ? 'selected' : '') + ' >Black</option>';
            html += '<option value="#228b22" ' + ((bg.players[0].color == '#228b22') ? 'selected' : '') + ' >Green</option>';
            html += '<option value="#4169e1" ' + ((bg.players[0].color == '#4169e1') ? 'selected' : '') + ' >Blue</option>';
            html += '<option value="#b22222" ' + ((bg.players[0].color == '#b22222') ? 'selected' : '') + ' >Red</option>';
            html += '<option value="#bebebe" ' + ((bg.players[0].color == '#bebebe') ? 'selected' : '') + ' >Grey</option>';
            html += '<option value="#ffd700" ' + ((bg.players[0].color == '#ffd700') ? 'selected' : '') + ' >Yellow</option>';
            html += '<option value="#ff4500" ' + ((bg.players[0].color == '#ff4500') ? 'selected' : '') + ' >Orange</option>';
            html += '<option value="#ffdab9" ' + ((bg.players[0].color == '#ffdab9') ? 'selected' : '') + ' >Peach Puff</option>';
            html += '</select></td></tr>';
            html += '<tr><th>Player 2</th>';
            html += '<td><input type="text" onblur="BoredGames.players[1].name = $G(this); BoredGames.saveStats();" value="' + bg.players[1].name + '" /></td></tr>';
            html += '<tr><th>Color</th>';
            html += '<td><select onchange="BoredGames.players[1].color = $G(this); BoredGames.saveStats();">';
            html += '<option value="#fffafa" ' + ((bg.players[1].color == '#ffffff') ? 'selected' : '') + ' >White</option>';
            html += '<option value="#000000" ' + ((bg.players[1].color == '#000000') ? 'selected' : '') + ' >Black</option>';
            html += '<option value="#228b22" ' + ((bg.players[1].color == '#228b22') ? 'selected' : '') + ' >Green</option>';
            html += '<option value="#4169e1" ' + ((bg.players[1].color == '#4169e1') ? 'selected' : '') + ' >Blue</option>';
            html += '<option value="#b22222" ' + ((bg.players[1].color == '#b22222') ? 'selected' : '') + ' >Red</option>';
            html += '<option value="#bebebe" ' + ((bg.players[1].color == '#bebebe') ? 'selected' : '') + ' >Grey</option>';
            html += '<option value="#ffd700" ' + ((bg.players[1].color == '#ffd700') ? 'selected' : '') + ' >Yellow</option>';
            html += '<option value="#ff4500" ' + ((bg.players[1].color == '#ff4500') ? 'selected' : '') + ' >Orange</option>';
            html += '<option value="#ffdab9" ' + ((bg.players[1].color == '#ffdab9') ? 'selected' : '') + ' >Peach Puff</option>';
            html += '</select></td></tr>';
            html += '</table>';
            $E('boredgames_settings').innerHTML = html;
            $E('boredgames_menu').style.display = 'none';
            $E('boredgames_help').style.display = 'none';
            $E('boredgames_stats').style.display = 'none';
            $E('boredgames_board').style.display = 'none';
        }
        else
        {   bg.exit();    }
    },
    start: function ()
    {
        var bg = this;
        var time = new Date();
        bg.game_start = time.getTime();
        $E('boredgames_settings').style.display = 'none';
        $E('boredgames_menu').style.display = 'none';
        $E('boredgames_help').style.display = 'none';
        $E('boredgames_stats').style.display = 'none';
        $E('boredgames_board').style.display = 'block';
    },
    finish: function ()
    {
        var bg = this;
        var time = new Date();
        var total = Math.ceil((time.getTime() - bg.game_start) / 1000);
        bg.saveStats(total);
    },
    exit: function ()
    {
        var bg = this;

        if (isObject(bg.game) && $E('boredgames_board').style.display == 'none')
        {
            $E('boredgames_board').style.display = 'block';
            $E('boredgames_menu_icon').style.display = 'block';
            $E('boredgames_settings_icon').style.display = 'block';
            $E('boredgames_help_icon').style.display = 'block';
            $E('boredgames_stats_icon').style.display = 'block';
            $E('boredgames_new_icon').style.display = 'block';
            $E('boredgames_exit_icon').style.display = 'block';
            $E('boredgames_stats').style.display = 'none';
            $E('boredgames_menu').style.display = 'none';
            $E('boredgames_settings').style.display = 'none';
            $E('boredgames_help').style.display = 'none';
        }
        else
        {
            $E('boredgames_board').style.display = 'none';
            $E('boredgames_menu_icon').style.display = 'none';
            $E('boredgames_settings_icon').style.display = 'none';
            $E('boredgames_help_icon').style.display = 'none';
            $E('boredgames_stats_icon').style.display = 'none';
            $E('boredgames_new_icon').style.display = 'none';
            $E('boredgames_exit_icon').style.display = 'none';
            $E('boredgames_stats').style.display = 'none';
            $E('boredgames_menu').style.display = 'block';
            $E('boredgames_settings').style.display = 'none';
            $E('boredgames_help').style.display = 'none';
        }
    },
    build: function ()
    {
        var bg = this;
        var html = '';
        html += '<h2 id="boredgames_title">Welcome to <br />boredgames v' + bg.version + '!</h2>';
        html += '<div id="boredgames_board"></div>';
        html += '<div id="boredgames_menu_icon"><img src="' + bg.paths.img + 'lg_home.png" onclick="BoredGames.showMenu();" alt="Change Game" title="Change Game" /></div>';
        html += '<div id="boredgames_new_icon"><img src="' + bg.paths.img + 'lg_play.png" onclick="BoredGames.game.start();" alt="New Game" title="New Game" /></div>';
        html += '<div id="boredgames_settings_icon"><img src="' + bg.paths.img + 'lg_settings.png" onclick="BoredGames.showSettings();" alt="Change Settings" title="Change Settings" /></div>';
        html += '<div id="boredgames_help_icon"><img src="' + bg.paths.img + 'lg_help.png" onclick="BoredGames.showHelp();" alt="Show Help" title="Show Help" /></div>';
        html += '<div id="boredgames_stats_icon"><img src="' + bg.paths.img + 'lg_stats.png" onclick="BoredGames.showStats();" alt="Show Stats" title="Show Stats" /></div>';
        html += '<div id="boredgames_exit_icon"><img src="' + bg.paths.img + 'lg_exit.png" onclick="BoredGames.exit();" alt="Exit" title = "Exit" /></div>';
        html += '<div id="boredgames_menu"><table>';
        for (var i = 0; i < bg.games.length; i++)
        {
            eval ('var g = ' + bg.games[i]);
            html += '<tr><td rowspan="2"><img src="' + g.logo + '" onclick="BoredGames.load(' + "'" + bg.games[i] + "'" + ');" /></td>';
            html += '<td><h3>' + g.name + '</h3></td></tr>';
            html += '<tr><td>' + g.blurb + '</td></tr>';
        }
        html += '</table></div>';
        html += '<div id="boredgames_help"></div>';
        html += '<div id="boredgames_stats"></div>';
        html += '<div id="boredgames_settings"></div>';
        $E(bg.target).innerHTML = html;
    }
};
