
var examples = {
    init: function (file) {
        var cgLib;
        examples.editor = ace.edit('exampleEditor');
        examples.editor.setTheme("ace/theme/chrome");
        examples.editor.session.setMode("ace/mode/javascript");
        examples.editor.getSession().setTabSize(2);
        examples.dims = [];

        examples.editor.setOptions({
            scrollPastEnd: 0.2,
            autoScrollEditorIntoView: true,
            maxLines: 30,
            minLines: 30
        });

        // Button
        $('#runButton').click(function () {
            examples.runExample();
        });

        $('#resetButton').click(function () {
            examples.resetExample();
        });

        $('#rewindButton').click(function () {
            $('#exampleFrame')[0].contentWindow.rewind();
        });
        $('#pauseButton').click(function () {
            $('#exampleFrame')[0].contentWindow.pause();
        });
        $('#playButton').click(function () {
            $('#exampleFrame')[0].contentWindow.play();
        });
        $('#forwardButton').click(function () {
            $('#exampleFrame')[0].contentWindow.forward();
        });

        $('#animateButton').click(function () {
            $('#exampleFrame')[0].contentWindow.animate();
        });

        // Example Frame
        if ($("#isMobile-displayButton").length == 0) {
            //it not mobile

            $('#exampleFrame').load(function () {
                examples.loadExample(false);
            });
        } else {
            $('#isMobile-displayButton').click(function () {

                $('#exampleFrame').show();
                $('#exampleFrame').ready(function () {
                    examples.loadExample(true);
                });
            });
        }

        // Capture clicks

        $.ajax({
                url: file, dataType: 'text'
            })
            .done(function (data) {
                $('#exampleSelector').hide();
                // strip description

                var frameRe = /@frame (.*),(.*)/g;
                var arr = data.split(frameRe);
                if (arr.length > 2) {
                    examples.dims[0] = arr[1];
                    examples.dims[1] = arr[2];
                }
                var ind = data.indexOf('*/');
                data = data.substring(ind + 3);
                examples.resetData = data;

                examples.showExample();
            })
    },

    getLib: function () {
        $.ajax({
            url: "drawing/sketch.js",
            async: false,
            success: function (data){
                 cgLib = data;
                async: false
                //,console.log(cgLib);
            }
        });
    },


    showExample: function () {
        examples.editor.getSession().setValue(examples.resetData);
        //var rows = examples.editor.getSession().$rowLengthCache.length;
        var rows = 35;//Lynn: set fixed for now since reset mayb change max# of rows shown
        var lineH = examples.editor.renderer.lineHeight;
        $('#exampleEditor').height(rows * lineH + 'px');
        examples.runExample();
        $('#exampleDisplay').show();
    },
    // display iframe
    runExample: function () {
        $('#exampleFrame').attr('src', $('#exampleFrame').attr('src'));
    },
    resetExample: function () {
        examples.showExample();
    },
    // load script into iframe
    loadExample: function (isMobile) {
        var exampleCode = examples.editor.getSession().getValue();
        try {

            if (exampleCode.indexOf('new p5()') === -1) {
                //exampleCode += '\nnew p5();';
            }

            if (isMobile) {

                $('#exampleFrame').css('position', 'fixed');
                $('#exampleFrame').css('top', '0px');
                $('#exampleFrame').css('left', '0px');
                $('#exampleFrame').css('right', '0px');
                $('#exampleFrame').css('bottom', '0px');
                $('#exampleFrame').css('z-index', '999');

            } else {
                if (examples.dims.length < 2) {
                    var re = /createCanvas\((.*),(.*)\)/g;
                    var arr = exampleCode.split(re);
                    $('#exampleFrame').height(arr[2] + 'px');
                } else {
                    $('#exampleFrame').height(examples.dims[1] + 'px');
                }
            }
            //the following code generates a new js script: userScript
            var userScript = $('#exampleFrame')[0].contentWindow.document.createElement('script');
            userScript.type = 'text/javascript';
            userScript.id = 'editor';
            userScript.text = exampleCode;
            userScript.async = false;
            $('#exampleFrame')[0].contentWindow.document.body.appendChild(userScript);
        }
        catch (e) {
            console.log(e.message);
        }
    },

    new: function (file) {
        var cgLib;
        examples.editor = ace.edit('exampleEditor');
        examples.editor.setTheme("ace/theme/Chrome");
        examples.editor.session.setMode("ace/mode/javascript");
        examples.editor.getSession().setTabSize(2);
        examples.dims = [];

        examples.editor.setOptions({
            scrollPastEnd: 0.2,
            autoScrollEditorIntoView: true,
            maxLines: 30,
            minLines: 30
        });

        // Button
        $('#runButton').click(function () {
            examples.runExample();
        });

        $('#resetButton').click(function () {
            examples.resetExample();
        });

        $('#rewindButton').click(function () {
            $('#exampleFrame')[0].contentWindow.rewind();
        });
        $('#pauseButton').click(function () {
            $('#exampleFrame')[0].contentWindow.pause();
        });
        $('#playButton').click(function () {
            $('#exampleFrame')[0].contentWindow.play();
        });
        $('#forwardButton').click(function () {
            $('#exampleFrame')[0].contentWindow.forward();
        });

        // Example Frame
        if ($("#isMobile-displayButton").length == 0) {
            //it not mobile

            $('#exampleFrame').load(function () {
                examples.loadExample(false);
            });
        } else {
            $('#isMobile-displayButton').click(function () {

                $('#exampleFrame').show();
                $('#exampleFrame').ready(function () {
                    examples.loadExample(true);
                });
            });
        }

        // Capture clicks

        $.ajax({
                url: file, dataType: 'text'
            })
            .done(function (data) {
                $('#exampleSelector').hide();
                // strip description

                var frameRe = /@frame (.*),(.*)/g;
                var arr = data.split(frameRe);
                if (arr.length > 2) {
                    examples.dims[0] = arr[1];
                    examples.dims[1] = arr[2];
                }
                var ind = data.indexOf('*/');
                data = data.substring(ind + 3);
                examples.resetData = data;

                examples.showExample();
            })
    },

    getLib: function () {
        $.ajax({
            url: "drawing/sketch.js",
            async: false,
            success: function (data){
                 cgLib = data;
                async: false
                //,console.log(cgLib);
            }
        });
    },


    showExample: function () {
        examples.editor.getSession().setValue(examples.resetData);
        //var rows = examples.editor.getSession().$rowLengthCache.length;
        var rows = 35;//Lynn: set fixed for now since reset mayb change max# of rows shown
        var lineH = examples.editor.renderer.lineHeight;
        $('#exampleEditor').height(rows * lineH + 'px');
        examples.runExample();
        $('#exampleDisplay').show();
    },
    // display iframe
    runExample: function () {
        $('#exampleFrame').attr('src', $('#exampleFrame').attr('src'));
    },
    resetExample: function () {
        examples.showExample();
    },
    // load script into iframe
    loadExample: function (isMobile) {
        var exampleCode = examples.editor.getSession().getValue();
        try {

            if (exampleCode.indexOf('new p5()') === -1) {
                //exampleCode += '\nnew p5();';
            }

            if (isMobile) {

                $('#exampleFrame').css('position', 'fixed');
                $('#exampleFrame').css('top', '0px');
                $('#exampleFrame').css('left', '0px');
                $('#exampleFrame').css('right', '0px');
                $('#exampleFrame').css('bottom', '0px');
                $('#exampleFrame').css('z-index', '999');

            } else {
                if (examples.dims.length < 2) {
                    var re = /createCanvas\((.*),(.*)\)/g;
                    var arr = exampleCode.split(re);
                    $('#exampleFrame').height(arr[2] + 'px');
                } else {
                    $('#exampleFrame').height(examples.dims[1] + 'px');
                }
            }
            //the following code generates a new js script: userScript
            var old = $('#exampleFrame')[0].contentWindow.document.body.childNodes[1];
            var userScript = $('#exampleFrame')[0].contentWindow.document.createElement('script');
            userScript.type = 'text/javascript';
            userScript.id = 'editor';
            userScript.text = exampleCode;
            userScript.async = false;
            var body = $('#exampleFrame')[0].contentWindow.document;
            $('#exampleFrame')[0].contentWindow.document.body.replaceChild(userScript,old);
        }
        catch (e) {
            console.log(e.message);
        }
    }
};
