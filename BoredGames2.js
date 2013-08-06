/**
 *  These classes control the
 **/
var BoredGames2 =
{
    version: 0.1,
    name: 'BoredGames2',
    games: ['SameGame', 'MineMadness', 'CodeBreaker', 'PegJumper', 'SwitchFlippers'],
    init: function (theParams)
    {
        var bg = this;
        if (isDom(theParams['target']))
        {   this.build(theParams['target']);    }
    },
    menu: function ()
    {
    },
    load: function ()
    {
    },
    exit: function ()
    {
    },
    build: function (theTarget)
    {
        var html = '';
        html += '';
        theTarget.innerHTML = html;
    }
};
