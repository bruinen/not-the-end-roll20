var NotTheEnd = (function() {
    'use strict';



    function _getResults(who,args, rischia) {
        var baseIndex = 0;
        if (rischia) {
            baseIndex = 1;
        }
        var positivi = parseInt(args[baseIndex + 1]);
        var negativi = parseInt(args[baseIndex + 2]);
        var daEstrarre = parseInt(args[baseIndex + 3]);
        var results = NotTheEnd._extractToken(positivi, negativi, daEstrarre, rischia);
        NotTheEnd._sendMessage(who, results, positivi, negativi, daEstrarre, rischia);
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



            var messageErrore = 'Per utilizzare il comando passare tutti i valori neccesari' +
                ' es. <b>!nte 3 3 2</b>, il primo numero sono i token positivi, il secondo i token negativi' +
                ' ed il terzo il numero di token da estrarre.';
            if (args.length > 0) {
                if (args[1] === 'r' && args.length === 5) {
                    NotTheEnd._getResults(msg.who,args, true);
                } else if (args.length === 4) {
                    NotTheEnd._getResults(msg.who,args, false);
                } else {
                    sendChat('NotTheEnd', messageErrore);
                }

            } else {
                sendChat('NotTheEnd', messageErrore);
            }
        }
    }

    function _sendMessage(who, resultToReturn, positivi, negativi, daEstrarre, rischia) {
        var divstyle = 'style="width: 189px; border: 1px solid black; background-color: lightblue; padding: 5px;"';
        var astyle = 'style="text-align: right;padding-right: 10px;width: 70%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(26, 132, 64); margin-bottom: 2px; margin-top: 2px;"';
        var line = 'style="border: none; border-top: 1px solid transparent; border-bottom: 1px solid transparent; border-left: 196px solid rgb(26, 132, 64); margin-bottom: 3px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(26, 132, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';

        var rishiaHtml='';
        var title='Estrazione Rischio';
        if (!rischia) {
           var title='Estrazione';
           var rDaEstrare=5-daEstrarre;
           rishiaHtml= '<div ' + line + '></div>' +
                '<div><a href="!nte r ' + resultToReturn.positiviNelSacco + ' ' + resultToReturn.negativiNelSacco + ' ' + rDaEstrare + '">Rischia</a></div>' ;
        }
        var message = '<div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>' + title + '</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<table>' + //--
            '<tr><td>Positivi: </td><td ' + astyle + '><b style="color:white">' + positivi + '</b></td></tr>' + //--
            '<tr><td>Negativi: </td><td ' + astyle + '><b style="color:black">' + negativi + '</b></td></tr>' + //--
            '<tr><td>Estratti: </td><td ' + astyle + '><b style="color:green">' + daEstrarre + '</b></td></tr>' + //--
            '</table>' + //--
            '<div></div>' +
            '<div ' + headstyle + '>Risultati</div>' + //--
            '<div ' + line + '></div>' +
            '<div>' + resultToReturn.results + '</div>' +
            '<div ' + line + '></div>' +
            '<div><b style="color:white">Positivi(' + resultToReturn.total.positivo + ')</b></div>' +
            '<div><b style="color:black">Negativi(' + resultToReturn.total.negativo + ')</b></div>' +
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
        var macros =findObjs({ _type: 'macro', name: 'estrai-token' });
        if(macros.length===0){

            createObj("macro", {
                _playerid:playerId,
                name: "estrai-token",
                action: "!nte ?{Positivi|0} ?{Scegli la difficoltà|Facilissima,1|Facile,2|Normale,3|Difficile,4| Difficilissima,5|Quasi Impossibile,6} ?{estrai|1|2|3|4}",
                visibleto:playersIds,
                istokenaction: false
            });
            sendChat('NotTheEnd', "Macro <b>estrai-token</b> creata!");
        }else{
            sendChat('NotTheEnd', "Macro <b>Estrai token</b> gia esiste!");
        }
    }


    return {
        registerEventHandlers: registerEventHandlers,
        notTheEndMacro:notTheEndMacro,
        handleChatMessage: handleChatMessage,
        _extractToken: _extractToken,
        _shuffle: _shuffle,
        _sendMessage: _sendMessage,
        _getResults: _getResults
    };
}());


on("ready", function() {
    'use strict';
    NotTheEnd.registerEventHandlers();

});