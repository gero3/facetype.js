var submit = document.getElementById("submit");
var fileInput = document.getElementById("fileInput");
submit.onclick = function(){
    var reader = new FileReader();
    reader.addEventListener( 'load', function ( event ) {

        var font = opentype.parse(event.target.result);
        console.log(font);

        var scale = (1000 * 100) / (2048 *72);
        var result = {};
        result.glyphs = {};

        font.glyphs.forEach(function(glyph){
            if (glyph.unicode !== undefined) {
                if (String.fromCharCode(glyph.unicode) === "0"){
                    console.log(glyph.getPath(0,0,100));
                };

                var token = {};
                token.ha = glyph.advanceWidth;
                token.x_min = glyph.xMin;
                token.x_max = glyph.xMax;
                token.o = ""
                glyph.path.commands.forEach(function(command){
                    if (command.type.toLowerCase() === "z") {return;}
                    token.o += command.type.toLowerCase();
                    token.o += " "
                    token.o += Math.round(command.x * scale);
                    token.o += " "
                    token.o += Math.round(command.y * scale);
                    token.o += " "
                    if (command.x1 !== undefined && command.y1 !== undefined){
                        token.o += Math.round(command.x1 * scale);
                        token.o += " "
                        token.o += Math.round(command.y1 * scale);
                        token.o += " "
                    }
                });

                result.glyphs[String.fromCharCode(glyph.unicode)] = token;
            };
        });
        result.familyName = font.familyName;
        result.ascender = Math.round(font.ascender * scale);
        result.descender = Math.round(font.descender * scale);
        result.underlinePosition = font.tables.post.underlinePosition;
        result.underlineThickness = font.tables.post.underlineThickness;
        result.boundingBox = {
            "yMin": font.tables.head.yMin,
            "xMin": font.tables.head.xMin,
            "yMax": font.tables.head.yMax,
            "xMax": font.tables.head.xMax
        };
        result.resolution = 1000;
        result.original_font_information = font.tables.name;
        if (font.styleName.toLowerCase().indexOf("bold") > -1){
            result.cssFontWeight = "bold";
        } else {
            result.cssFontWeight = "normal";
        };

        if (font.styleName.toLowerCase().indexOf("italic") > -1){
            result.cssFontStyle = "italic";
        } else {
            result.cssFontStyle = "normal";
        };

        exportString("if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace("+ JSON.stringify(result) + ");",font.familyName + "_" + font.styleName  + ".js");
    }, false );
    reader.readAsArrayBuffer( fileInput.files[ 0 ] );



};

var exportString = function ( output, filename ) {

		var blob = new Blob( [ output ], { type: 'text/plain' } );
		var objectURL = URL.createObjectURL( blob );

		var link = document.createElement( 'a' );
		link.href = objectURL;
		link.download = filename || 'data.json';
		link.target = '_blank';
		link.click();

	};
