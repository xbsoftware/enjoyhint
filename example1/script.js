
//initialize instance
var enjoyhint_instance = new EnjoyHint({});

//simple config.
//Only one step - highlighting(with description) "New" button
//hide EnjoyHint after a click on the button.
var enjoyhint_script_steps = [
    {
        "next #banner": 'Hello, I want to tell you about EnjoyHint.<br> Click "Next" and go.'
    },
    {
        "next #buttons": "You can select other block. For example we select title.<br>" +
            "This event have very easy code. <br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' next #button '</text> : <text style='color: #2bff3c'>' Some discription '</text> <br>" +
            "}<br>" +
            "<text style='color: #00ebe7'>next</text> - event (all event described in documentation)<br>" +
            "<text style='color: #00ebe7'>#button</text> - selector <br>" +
            "<text style='color: #00ebe7'>Some discription</text> - Discription for block <br>"
    },
    {
        "click .btn-success" : "For example we set click event on button.<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' click .btn-success '</text> : <text style='color: #2bff3c'>' Some discription '</text> <br>" +
            "}<br>" +
            "Click the button and move on."
    },
    {
        "dblclick #def_but" : "You can use all standart JS event<br>" +
            "Do double click on the button."
    },
    {
        "next #text_select" : "Some blocks you want to select the circle. This will help you<br>" +
            "<text style='color: #00ebe7'>shape</text> - shape for highlighting ( rect || circle )  <br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' next #selector '</text> : <text style='color: #2bff3c'>' Some discription ',</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' shape '</text> :  <text style='color: #2bff3c'>' circle '</text> <br>" +
            "}<br>" +
            "But circle radius a little too small.<br> Click 'Next' and we'll fix it.",
        shape : 'circle'
    },
    {
        "next #text_select2" : "As I said, we fix radius<br>" +
            "<text style='color: #00ebe7'>radius</text> - set the size of the radius<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' next #selector '</text> : <text style='color: #2bff3c'>' Some discription ',</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' shape '</text> :  <text style='color: #2bff3c'>' circle '</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' radius '</text> : 280<br>" +
            "}<br>",
        shape : 'circle',
        radius: 280
    },
    {
        "next #animationSpeed" : "Sometimes you need to very slowly or very quickly scroll the page.<br>As we have just. To do this,<br>" +
            "<text style='color: #00ebe7'>scrollAnimationSpeed</text> - set speed for scroll page<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' next #selector '</text> : <text style='color: #2bff3c'>' Some discription ',</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' scrollAnimationSpeed '</text> : 2500<br>" +
            "}<br>",
        scrollAnimationSpeed : 2500
    },
    {
        "key #suc_input" : "You can set events to key presses.<br>" +
            "<text style='color: #00ebe7'>key_code</text> - key code for any 'key*' event.<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' key #selector '</text> : <text style='color: #2bff3c'>' Some discription ',</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' key_code '</text> : 13<br>" +
            "}<br>" +
            "Enter text and press Enter.",
        key_code : 13
    }

];

//set script config
enjoyhint_instance.set(enjoyhint_script_steps);

//run Enjoyhint script
enjoyhint_instance.run();