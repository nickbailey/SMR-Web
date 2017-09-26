// Don't want to initialise this big array every time,
// so I'm using a closure
var latexToUnicode = (function() {
	var latex_read_arr = [
		["{!`}" , "¡"],
		["{\\pounds}" , "£"],
		["{\\S}" , "§"],
		["{\\copyright}" , "©"],
		["{\\textregistered}" , "®"],
		["{\\circledR}" , "®"],
		["{\\texttrademark}" , "™"],
		["{\\pm}" , "±"],
		["{\\P}" , "¶"],
		["{\\cdot}" , "·"],
		["{?`}" , "¿"],
		["{\\div}" , "÷"],
		["{\\times}" , "×"],
		["{\\o}" , "ø"],
		["{\\O}" , "Ø"],
		["{\\`A}" , "À"],
		["{\\'A}" , "Á"],
		["{\\^A}" , "Â"],
		["{\\~A}" , "Ã"],
		["{\\\"A}" , "Ä"],
		["{\\AA}" , "Å"],
		["{\\AE}" , "Æ"],
		["{\\c{C}}" , "Ç"],
		["{\\c C}" , "Ç"],
		["{\\`E}" , "È"],
		["{\\'E}" , "É"],
		["{\\^E}" , "Ê"],
		["{\\\"E}" , "Ë"],
		["{\\`I}" , "Ì"],
		["{\\'I}" , "Í"],
		["{\\^I}" , "Î"],
		["{\\\"I}" , "Ï"],
		["{\\~N}" , "Ñ"],
		["{\\`O}" , "Ò"],
		["{\\'O}" , "Ó"],
		["{\\^O}" , "Ô"],
		["{\\~O}" , "Õ"],
		["{\\\"O}" , "Ö"],
		["{\\OE}" , "Œ"],
		["{\\`U}" , "Ù"],
		["{\\'U}" , "Ú"],
		["{\\^U}" , "Û"],
		["{\\\"U}" , "Ü"],
		["{\\'Y}" , "Ý"],
		["{\\\"Y}", "Ÿ"],
		["{\\ss}" , "ß"],
		["{\\`a}" , "à"],
		["{\\'a}" , "á"],
		["{\\^a}" , "â"],
		["{\\~a}" , "ã"],
		["{\\\"a}" , "ä"],
		["{\\aa}" , "å"],
		["{\\ae}" , "æ"],
		["{\\c{c}}" , "ç"],
		["{\\c c}" , "ç"],
		["{\\`e}" , "è"],
		["{\\'e}" , "é"],
		["{\\^e}" , "ê"],
		["{\\\"e}" , "ë"],
		["{\\`\\i}" , "ì"],
		["{\\'\\i}" , "í"],
		["{\\^\\i}" , "î"],
		["{\\\"\\i}" , "ï"],
		["{\\~n}" , "ñ"],
		["{\\`o}" , "ò"],
		["{\\'o}" , "ó"],
		["{\\^o}" , "ô"],
		["{\\~o}" , "õ"],
		["{\\\"o}" , "ö"],
		["{\\oe}" , "œ"],
		["{\\`u}" , "ù"],
		["{\\'u}" , "ú"],
		["{\\^u}" , "û"],
		["{\\\"u}" , "ü"],
		["{\\'y}" , "ý"],
		["{\\\"y}" , "ÿ"],
		["\\`{A}" , "À"],
		["\\'{A}" , "Á"],
		["\\^{A}" , "Â"],
		["\\~{A}" , "Ã"],
		["\\\"{A}" , "Ä"],
		["\\k{A}" , "Ą"],
		["\\AE{}" , "Æ"],
		["\\AE " , "Æ"],
		["\\`{E}" , "È"],
		["\\'{E}" , "É"],
		["\\^{E}" , "Ê"],
		["\\\"{E}" , "Ë"],
		["\\k{E}" , "Ę"],
		["\\c{C}" , "Ç"],
		["\\c C" , "Ç"],
		["\\`{I}" , "Ì"],
		["\\'{I}" , "Í"],
		["\\^{I}" , "Î"],
		["\\\"{I}" , "Ï"],
		["\\k{I}" , "Į"],
		["\\~{N}" , "Ñ"],
		["\\`{O}" , "Ò"],
		["\\'{O}" , "Ó"],
		["\\^{O}" , "Ô"],
		["\\~{O}" , "Õ"],
		["\\\"{O}" , "Ö"],
		["\\H{O}" , "Ő"],
		["\\OE{}" , "Œ"],
		["\\OE " , "Œ"],
		["\\`{U}" , "Ù"],
		["\\'{U}" , "Ú"],
		["\\^{U}" , "Û"],
		["\\\"{U}" , "Ü"],
		["\\H{U}" , "Ű"],
		["\\k{U}" , "Ų"],
		["\\'{Y}" , "Ý"],
		["\\\"{Y}", "Ÿ"],
		["\\`{a}" , "à"],
		["\\'{a}" , "á"],
		["\\^{a}" , "â"],
		["\\~{a}" , "ã"],
		["\\\"{a}" , "ä"],
		["\\k{a}" , "ą"],
		["\\ae{}" , "æ"],
		["\\ae " , "æ"],
		["\\c{c}" , "ç"],
		["\\c c" , "ç"],
		["\\`{e}" , "è"],
		["\\'{e}" , "é"],
		["\\^{e}" , "ê"],
		["\\\"{e}" , "ë"],
		["\\k{e}" , "ę"],
		["\\`{\\i}" , "ì"],
		["\\'{\\i}" , "í"],
		["\\^{\\i}" , "î"],
		["\\\"{\\i}" , "ï"],
		["\\k{i}" , "į"],
		["\\~{n}" , "ñ"],
		["\\`{o}" , "ò"],
		["\\'{o}" , "ó"],
		["\\^{o}" , "ô"],
		["\\~{o}" , "õ"],
		["\\\"{o}" , "ö"],
		["\\H{o}" , "ő"],
		["\\oe{}" , "œ"],
		["\\oe " , "œ"],
		["\\`{u}" , "ù"],
		["\\'{u}" , "ú"],
		["\\^{u}" , "û"],
		["\\\"{u}" , "ü"],
		["\\H{u}" , "ű"],
		["\\k{u}" , "ų"],
		["\\'{y}" , "ý"],
		["\\\"{y}" , "ÿ"],
		["\\`A" , "À"],
		["\\'A" , "Á"],
		["\\^A" , "Â"],
		["\\~A" , "Ã"],
		["\\\"A" , "Ä"],
		["\\`E" , "È"],
		["\\'E" , "É"],
		["\\^E" , "Ê"],
		["\\\"E" , "Ë"],
		["\\`I" , "Ì"],
		["\\'I" , "Í"],
		["\\^I" , "Î"],
		["\\\"I" , "Ï"],
		["\\~N" , "Ñ"],
		["\\`O" , "Ò"],
		["\\'O" , "Ó"],
		["\\^O" , "Ô"],
		["\\~O" , "Õ"],
		["\\\"O" , "Ö"],
		["\\`" , "Ù"],
		["\\'" , "Ú"],
		["\\^" , "Û"],
		["\\\"" , "Ü"],
		["\\'Y" , "Ý"],
		["\\\"Y", "Ÿ"],
		["\\`a" , "à"],
		["\\'a" , "á"],
		["\\^a" , "â"],
		["\\~a" , "ã"],
		["\\\"a" , "ä"],
		["\\`e" , "è"],
		["\\'e" , "é"],
		["\\^e" , "ê"],
		["\\\"e" , "ë"],
		["\\`\\i" , "ì"],
		["\\'\\i" , "í"],
		["\\^\\i" , "î"],
		["\\\"\\i" , "ï"],
		["\\~n" , "ñ"],
		["\\`o" , "ò"],
		["\\'o" , "ó"],
		["\\^o" , "ô"],
		["\\~o" , "õ"],
		["\\\"o" , "ö"],
		["\\`" , "ù"],
		["\\'" , "ú"],
		["\\^" , "û"],
		["\\\"" , "ü"],
		["\\'y" , "ý"],
		["\\\"y" , "ÿ"]
	];
	return function(latexString) {
		return latex_read_arr.reduce( function(latex, pattern) {
			return latex.split(pattern[0]).join(pattern[1]);
		}, latexString);
	};

// Invoking this causes latex_read_array to be initialised.
})();
