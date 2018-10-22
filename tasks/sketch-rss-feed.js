// --- Martin Lihs ----///


var fs = require('fs');
var urlencode = require('urlencode');
var fileSize = require('filesize');

module.exports = function(grunt) {

    grunt.registerMultiTask('sketchrssfeed', 'render and up_date sketch rss feed', function() {
        


        // Helper //
        var _txtIndent = '\t'; 
        var _date = new Date();

        var _day = _date.toLocaleString('en-US', { weekday: 'short' });
        var _month = _date.toLocaleString('en-US', { month: 'short' });
        var _year = _date.getFullYear();
        var _hours = _date.getHours();
        var _minutes = _date.getMinutes();
        var _seconds = _date.getSeconds();

        // Vars
        var _options = this.data.options;
        var _filesToProcess = this.data.files;
        var _urlOutput = '';

        _filesToProcess.forEach(function(i){

            if (i.file === 'all') {
               var _files = grunt.file.expand({filter: "isFile"}, [i.src + "*"]);
                _files.forEach(function(ii){
                    var _file = ii.match(/[\w-_ -]+(?:\.\w+)/)[0];
                    createSketchRSSFeed (ii)
                })
            } else {
                
                createSketchRSSFeed(i.src, i.title, i.description, i.minVersion, i.maxVersion);

            }
        })

        function generateTitlefromFilename(_filex) {
             var _fileNameArray = _filex.split(".");
             var _title = '';
             _fileNameArray.forEach(function(elm, i, that){
                if (i < that.length-1){
                    if (_title == ''){
                        _title = elm;
                    } else {
                        _title += " " + elm;
                    }
                }
            })
            return _title;
        }

        function createSketchRSSFeed (_src, _title, _description, _minV, _maxV) {

            if (Array.isArray(_src)) {
                _src = _src[0]
            } 
            var _file = _src.match(/[\w-_ -]+(?:\.\w+)/)[0];
            var _fileNameArray = _file.split(".");
            var _filentype = _fileNameArray[_fileNameArray.length-1]

            

            if (_filentype == 'sketch') {


                var _title = _title ? _title : (_options.xml.title + ' ' +generateTitlefromFilename(_file));//;
                var _description = _description ? _description : _options.xml._description;
                var _minV = _minV ? _minV : _options.xml.minVersion;
                var _maxV = _maxV ? _maxV : _options.xml.maxVersion;

                var _fileSize = fs.statSync(_src);
                _fileSize = _fileSize["size"];

                
                var sparkleVersion = (_year-2000)+''+_date.getMonth()+''+_date.getDate()+''+_hours+''+_minutes+''+_seconds;
                var pubDate =_day +', '+_date.getDate()+' '+_month+' '+_year+' '+_hours+':'+_minutes+':'+_seconds + ' +0000';
                
                var _enclosure = '<enclosure url="' + _options.url + 'sketch/' + _file + '" sparkle:version="'+sparkleVersion+'" length="'+_fileSize+'" type="application/octet-stream" />';

                var _xml = '';
                _xml += '<?xml version="1.0" encoding="utf-8"?>' + '\n';
                _xml += '<rss version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle"  xmlns:dc="http://purl.org/dc/elements/1.1/">' + '\n';
                _xml += _txtIndent + '<channel>' + '\n';
                _xml += _txtIndent + '<title>'+_title+'</title>' + '\n';
                _xml += _txtIndent + '<link>http://sketchlibrary.sketchapp.com/libraries/SketchLibraryAppcast.xml</link>' + '\n';
                _xml += _txtIndent + '<description>'+_description+'</description>' + '\n';
                _xml += _txtIndent + '<language>'+_options.xml.lang+'</language>' + '\n';
                _xml += _txtIndent + _txtIndent + '<item>' + '\n';
                _xml += _txtIndent + _txtIndent + _txtIndent +'<title>'+_title+'</title>' + '\n';
                _xml += _txtIndent + _txtIndent + _txtIndent +'<sparkle:minimumSystemVersion>'+_minV+'</sparkle:minimumSystemVersion>' + '\n';
                _xml += _txtIndent + _txtIndent + _txtIndent +'<sparkle:maximumSystemVersion>'+_maxV+'</sparkle:maximumSystemVersion>' + '\n';
                _xml += _txtIndent + _txtIndent + _txtIndent +'<pubDate>'+pubDate+'</pubDate>' + '\n';
                _xml += _txtIndent + _txtIndent + _txtIndent + _enclosure + '\n';
                _xml += _txtIndent + _txtIndent + '</item>' + '\n';
                _xml += _txtIndent + '</channel>' + '\n';
                _xml += '</rss>' + '\n';


                grunt.file.delete(_options.dest)

                var _xmlFileName = 'xml/' + _file.replace(/\ /g,'_').toLowerCase()+'.xml';

                grunt.file.write( (_options.dest + _xmlFileName), _xml );
                grunt.file.copy(_src, (_options.dest + 'sketch/' + _file)) 


                 var _url = 'sketch://add-library?url=';
                _url += urlencode(_options.url + _xmlFileName);
                _urlOutput += '<a href="' +_url+ '"> add Sketch Library ' + _title + '</a> <br>';

            }

        }

        var _header = fs.readFileSync('src/templates/header.html');
        var _footer = fs.readFileSync('src/templates/footer.html');

        var _htmlOutPut = _header;
        _htmlOutPut += _urlOutput;
        _htmlOutPut += _footer;

        grunt.file.write( (_options.dest + 'index.html'), _htmlOutPut );

        var done = this.async();
        
        done();
    });
};