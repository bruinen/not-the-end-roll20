var NotTheEnd = (function()
{
	'use strict';


	function registerEventHandlers()
	{
		on('chat:message', NotTheEnd.handleChatMessage);
	}


	function handleChatMessage(msg){
		if (msg.type === "api" && msg.content.indexOf("!nte") !== -1){
			var content = msg.content;
			console.log(msg);
			var args = content.split(' ');

			if (args.length > 0 && args.length === 4){	
				var white = parseInt(args[1]);
				var black = parseInt(args[2]);
				var count = parseInt(args[3]);
				var results = NotTheEnd._extractToken(white,black,count);
				NotTheEnd._sendMessage(msg.who,results,black,white,count);
			}else{
			   sendChat('NotTheEnd', 'Per utilizzare il comando passare tutti i valori neccesari es. <b>!nte 3 3 2</b>, il primo numero sono i token bianchi il secondo i token neri ed il terzo il numero di token da estrarre.');
			}
		}
	}

	function _sendMessage(who,resultToReturn,black,white,extract){
		var divstyle = 'style="width: 189px; border: 1px solid black; background-color: lightblue; padding: 5px;"'
        var astyle = 'style="text-align: right;padding-right: 10px;width: 70%;"';
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(26, 132, 64); margin-bottom: 2px; margin-top: 2px;"';
        var line = 'style="border: none; border-top: 1px solid transparent; border-bottom: 1px solid transparent; border-left: 196px solid rgb(26, 132, 64); margin-bottom: 3px; margin-top: 2px;"';

        var headstyle = 'style="color: rgb(26, 132, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        

        sendChat('NotTheEnd', '<div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>'+who+'</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<table>' + //--
            '<tr><td>Bianchi: </td><td '+astyle+'><b style="color:white">'+ white + '</b></td></tr>' + //--
            '<tr><td>Neri: </td><td '+astyle+'><b style="color:black">' + black + '</b></td></tr>' + //--
            '<tr><td>Estratti: </td><td '+astyle+'><b style="color:green">' + extract + '</b></td></tr>' + //--
            '</table>' + //--
            '<div></div>'+
            '<div ' + headstyle + '>Risultati</div>' + //--
            '<div ' + line + '></div>'+
            '<div>'+resultToReturn.results+'</div>'+
 			'<div ' + line + '></div>'+
             '<div><b style="color:white">Bianco('+resultToReturn.total["Bianco"]+')</b></div>'+
            '<div><b style="color:black">Nero('+resultToReturn.total["Nero"]+')</b></div>'+
            '</div>');
	}

    function _shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
    
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
    
    
    
    
    
    
    function _extractToken(white, black,numberOfTokens) {
      var tokens = [];
      for (var i = 0; i < white; i++) {
        tokens.push('Bianco');
      }
      for (var j = 0; j < black; j++) {
        tokens.push('Nero');
      }
      var result = '';
      var objResults={'Bianco':0,'Nero':0};
      tokens = NotTheEnd._shuffle(tokens);
      for (var k = 0; k < numberOfTokens; k++) {
      	var index =Math.floor(Math.random()*tokens.length);
      	var randomElement =tokens.splice(index,1)[0];

		var whiteHtml  ='<span style=" background-color: white;border: none;color: white; padding: 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;border-radius: 50%;"></span>';
		var blackHtml  ='<span style=" background-color: black;border: none;color: white; padding: 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;border-radius: 50%;"></span>'				

      	objResults[randomElement]++ 
      	if(randomElement==="Bianco"){
      		result=result+'&nbsp;'+whiteHtml; 	
      	}else{
      		result=result+'&nbsp;'+blackHtml; 	
      	}
      	//console.log();
      
      	tokens = NotTheEnd._shuffle(tokens);
      	//console.log(tokens);
      }

      var resultToReturn ={"results":result,"total":objResults};

      return resultToReturn;
      
    }

	return {
		registerEventHandlers: registerEventHandlers,
		handleChatMessage: handleChatMessage,
		_extractToken : _extractToken,
		_shuffle:_shuffle,
		_sendMessage:_sendMessage
	}
}());


on("ready", function()
{
	NotTheEnd.registerEventHandlers();
});