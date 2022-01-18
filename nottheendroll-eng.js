var NotTheEnd = (function() {
    'use strict';



    function _getResults(who,args, rischia,confuso) {
        var baseIndex = 0;
        if (rischia || confuso) {
            baseIndex = 1;
        }
        var positivi = parseInt(args[baseIndex + 1]);
        var negativi = parseInt(args[baseIndex + 2]);
        var positiviC=0;
        var negativiC=0;
        if(confuso){

           var result = NotTheEnd._extractTokenConfusion(positivi, positivi, positivi, false)
           positiviC= result.positivo;
           negativiC= result.negativo+negativi;
        }
        var daEstrarre = parseInt(args[baseIndex + 3]);
         var results = {};
        if(confuso){
             results = NotTheEnd._extractToken(positiviC, negativiC, daEstrarre, rischia);
        }else{
            results = NotTheEnd._extractToken(positivi, negativi, daEstrarre, rischia);
        }
        NotTheEnd._sendMessage(who, results, positivi, negativi, daEstrarre, rischia,confuso);
    }

    function handleChatMessage(msg) {
         if (msg.type === "api" && msg.content.indexOf("!nte-createMacro") !== -1){
            NotTheEnd.notTheEndMacro(msg.playerid);
         }else if (msg.type === "api" && msg.content.indexOf("!nte") !== -1) {
            var content = msg.content;
            var values = content.split(' ');
            var args = values.filter(function(el) {
                return el !== null && el !== "";
            });



            var messageErrore = 'To use the command, pass all necessary values' +
                '. <b>!nte 3 3 2</b>,the first number is positive tokens, the second is negative tokens' +
                ' and the third the number of tokens to extract.<br/>'+
                '<b>!nte c 3 2 2</b> for the confusion.';

            if (args.length > 0) {
                if (args[1] === 'r' && args.length === 5) {
                    NotTheEnd._getResults(msg.who,args, true,false);
                }else  if (args[1] === 'c' && args.length === 5) {
                    NotTheEnd._getResults(msg.who,args, false,true);
                } else if (args.length === 4) {
                    NotTheEnd._getResults(msg.who,args, false,false);
                } else {
                    sendChat('NotTheEnd', messageErrore);
                }

            } else {
                sendChat('NotTheEnd', messageErrore);
            }
        }
    }

    function _sendMessage(who, resultToReturn, positivi, negativi, daEstrarre, rischia,confuso) {
        var divstyle = 'style="width: 189px; border: 1px solid black; background-color: lightblue; padding: 5px;"';
        var astyle = 'style="text-align: right;padding-right: 10px;width: 70%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(26, 132, 64); margin-bottom: 2px; margin-top: 2px;"';
        var line = 'style="border: none; border-top: 1px solid transparent; border-bottom: 1px solid transparent; border-left: 196px solid rgb(26, 132, 64); margin-bottom: 3px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(26, 132, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var rishiaHtml='';


        var title='Risk draw';
        if (!rischia) {
           var title='Draw';
           var rDaEstrare=5-daEstrarre;
           rishiaHtml= '<div ' + line + '></div>' +
                '<div><a href="!nte r ' + resultToReturn.positiviNelSacco + ' ' + resultToReturn.negativiNelSacco + ' ' + rDaEstrare + '">Risk</a></div>' ;
        }
        var message = '<div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>' + title + '</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<div style="padding:10px">';
            if(!confuso){
                message+= '<span style=" background-color: white;border: none;color: black; padding: 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 25px;border-radius: 50%;">' +
                            positivi +
                '</span>&nbsp;&nbsp;';
            }else{
                message+='<span style="background-color: #eae9e9;background-image: url(https:\\//i.ibb.co/jgZpZyv/pattern-estratti.png);border: none;color: black; padding: 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 25px;border-radius: 50%;">'+
                         positivi +
                '</span>&nbsp;&nbsp;';
            }
            message+='<span style=" background-color: black;border: none;color: white; padding: 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 25px;border-radius: 50%;">' +
                       negativi +
            '</span>&nbsp;&nbsp;'+
            '<span style="background-color: #eae9e9;background-image: url(https:\\//i.ibb.co/jgZpZyv/pattern-estratti.png);border: none;color: black; padding: 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 25px;border-radius: 50%;">'+
                         daEstrarre +
            '</span>&nbsp;&nbsp;'+
            '</div>'+
            '<div></div>' +
            '<div ' + headstyle + '>Results</div>' + //--
            '<div ' + line + '></div>' +
            '<div>' + resultToReturn.results + '</div>' +
            '<div ' + line + '></div>' +
            '<div><b style="color:white">Positive(' + resultToReturn.total.positivo + ')</b></div>' +
            '<div><b style="color:black">Negatives(' + resultToReturn.total.negativo + ')</b></div>' +
            rishiaHtml+
            '</div>';

        sendChat(who,message );
    }

    function _shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    function _extractToken(positivi, negativi, daEstrarre) {
        var tokens = [];
        for (var i = 0; i < positivi; i++) {
            tokens.push('positivo');
        }
        for (var j = 0; j < negativi; j++) {
            tokens.push('negativo');
        }
        var result = '';
        var objResults = {
            'positivo': 0,
            'negativo': 0
        };
        tokens = NotTheEnd._shuffle(tokens);
        for (var k = 0; k < daEstrarre; k++) {
            var index = Math.floor(Math.random() * tokens.length);
            var randomElement = tokens.splice(index, 1)[0];

            var positivoHtml = '<span style=" background-color: white;border: none;color: black; padding: 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;border-radius: 50%;"></span>';
            var negativokHtml = '<span style=" background-color: black;border: none;color: white; padding: 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;border-radius: 50%;"></span>';

            objResults[randomElement]++;
            if (randomElement === "positivo") {
                result = result + '&nbsp;' + positivoHtml;
            } else {
                result = result + '&nbsp;' + negativokHtml;
            }
            tokens = NotTheEnd._shuffle(tokens);
        }

        var negativiNelSacco = 0;
        var positiviNelSacco = 0;
        for (var m = 0; m < tokens.length; m++) {
            var token = tokens[m];
            if (token === "positivo") {
                positiviNelSacco++ ;
            } else {
                negativiNelSacco++;
            }
        }

        var resultToReturn = {
            "results": result,
            "total": objResults,
            "positiviNelSacco":positiviNelSacco,
            "negativiNelSacco":negativiNelSacco
        };

        return resultToReturn;

    }

    function _extractTokenConfusion(positivi, negativi, daEstrarre) {
        var tokens = [];
        for (var i = 0; i < positivi; i++) {
            tokens.push('positivo');
        }
        for (var j = 0; j < negativi; j++) {
            tokens.push('negativo');
        }
        var objResults = {
            'positivo': 0,
            'negativo': 0
        };
        tokens = NotTheEnd._shuffle(tokens);
        for (var k = 0; k < daEstrarre; k++) {
            var index = Math.floor(Math.random() * tokens.length);
            var randomElement = tokens.splice(index, 1)[0];
            objResults[randomElement]++;
            tokens = NotTheEnd._shuffle(tokens);
        }
        return objResults;

    }
    function registerEventHandlers() {
            on('chat:message', NotTheEnd.handleChatMessage);
    }

    function notTheEndMacro(playerId){



        var players=findObjs({_type:'player'});
        var playersIds='';
        var isFirst = true;
        _.each(players,function (obj){
           if(!isFirst){
               playersIds=playersIds+",";
           }
           playersIds=playersIds+obj.get('id');
           isFirst=false;

        });
        var macros =findObjs({ _type: 'macro', name: 'confusion' });
        if(macros.length===0){

            createObj("macro", {
                _playerid:playerId,
                name: "confusion",
                action: "!nte c ?{Positive|0} ?{Choose the difficulty|Very easy,1|Easy,2|Normal,3|Difficile,4| Hard,5|Almost impossible,6} ?{Draw|1|2|3|4}",
                visibleto:playersIds,
                istokenaction: false
            });
            sendChat('NotTheEnd', "Macro <b>confusion</b> created!");
        }else{
            sendChat('NotTheEnd', "Macro <b>confusion</b> already exist!");
        }
        var macros =findObjs({ _type: 'macro', name: 'draw-token' });
        if(macros.length===0){

            createObj("macro", {
                _playerid:playerId,
                name: "draw-token",
                action: "!nte ?{Positive|0} ?{Choose the difficulty|Very easy,1|Easy,2|Normal,3|Difficile,4| Hard,5|Almost impossible,6} ?{Draw|1|2|3|4}",
                visibleto:playersIds,
                istokenaction: false
            });
            sendChat('NotTheEnd', "Macro <b>draw-token</b> created!");
        }else{
            sendChat('NotTheEnd', "Macro <b>draw-token</b> already exist!");
        }
    }


    return {
        registerEventHandlers: registerEventHandlers,
        notTheEndMacro:notTheEndMacro,
        handleChatMessage: handleChatMessage,
        _extractToken: _extractToken,
        _extractTokenConfusion: _extractTokenConfusion,
        _shuffle: _shuffle,
        _sendMessage: _sendMessage,
        _getResults: _getResults
    };
}());


on("ready", function() {
    'use strict';
    NotTheEnd.registerEventHandlers();

});