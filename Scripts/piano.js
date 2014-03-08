/**
 * Created by Dana on 22/02/14.
 */

function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
    }

    //initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //           screenX, screenY, clientX, clientY, ctrlKey,
    //           altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function initTouch() {
    document.addEventListener('touchstart', touchHandler, true);
    document.addEventListener('touchmove', touchHandler, true);
    document.addEventListener('touchend', touchHandler, true);
    document.addEventListener('touchcancel', touchHandler, true);
   }
const C1 = 60,
    C1s = 61,
    D1 = 62,
    D1s = 63,
    E1 = 64,
    F1 = 65,
    F1s = 66,
    G1 = 67,
    G1s = 68,
    A1 = 69,
    A1s = 70,
    B1 = 71,
    C2 = 72,
    C2s = 73,
    D2 = 74,
    D2s = 75,
    E2 = 76,
    F2 = 77,
    F2s = 78,
    G2 = 79,
    G2s = 80,
    A2 = 81,
    A2s = 82,
    B2 = 83,
    C3 = 84,
    C3s = 85,
    D3 = 86,
    D3s = 87,
    E3 = 88;
var whiteKeys = [];
var blackKeys = [];
var keySounds;
var pressed;
var scene;
var renderer;
var camera;
var Keys;

var materialWhite;
var materialPurple;
var materialBlack;

var defaultRotationX;
var playedNotes;


window.onload = function () {
    drawPiano();
    render();
    MIDI.loader = new widgets.Loader;
    MIDI.loadPlugin({
        soundfontUrl: "MIDI/soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function () {
            MIDI.loader.stop();
            displayDifficultySlider();
        }
    });
    initEvents();

};

function setScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, 2.5, 1, 20);
    camera.position.set(0, 5, 15);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({alpha: true, antialias:true});
    renderer.setSize(window.innerWidth, window.innerWidth / 2.5);
    renderer.setClearColor(0x000000, 0);

    var $piano=document.getElementById('piano');
    $piano.appendChild(renderer.domElement);

    var light = new THREE.AmbientLight(0x333333); // soft white light
    //scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 20).normalize();
    directionalLight.intensity = 1;
    scene.add(directionalLight);
}
var materialPiano;
function initPianoSettings() {
    materialWhite = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 35.0});
    materialPurple = new THREE.MeshPhongMaterial({color: 0x9900CC});
    materialBlack = new THREE.MeshPhongMaterial({color: 0x000000});
    materialPiano= new THREE.MeshPhongMaterial({color: 0xE8DDCB});

    keySounds = [C1, D1, E1, F1, G1, A1, B1, C2, D2, E2, F2, G2, A2, B2, C3, D3, E3];
    keySounds = keySounds.concat(C1s, D1s, F1s, G1s, A1s, C2s, D2s, F2s, G2s, A2s, C3s, D3s);

    defaultRotationX = 0.7;
    playedNotes=[];
   }

function drawPiano() {


    var keyPositionX = -10;
    var keyPositionY = 5;
    var keyPositionZ = 5;
    var keyWidth = 1.25;
    var keyHeight = 0.75;
    var keyDepth = 6;
    var nrWhiteKeys = 17;
    var i;
    var geometry;
    var cube;

    setScene();
    initPianoSettings();

  /* //backbox
    var backboxWidth=keyWidth*nrWhiteKeys;
    var backBoxHeight=13;
    var backBoxDepth=5;
    geometry= new THREE.BoxGeometry(backboxWidth+10,backBoxHeight, backBoxDepth);
    cube= new THREE.Mesh(geometry, materialBlack);
    cube.position.x=keyPositionX+backboxWidth/2;
    cube.position.y=keyPositionY;
    cube.position.z=keyPositionZ-keyDepth-0.5;
    cube.rotation.x=0.5;
    scene.add(cube);

    geometry= new THREE.BoxGeometry(0.5,backBoxHeight-5, keyDepth);
    cube= new THREE.Mesh(geometry, materialBlack);
    cube.position.x=keyPositionX-1.5;
    cube.position.y=keyPositionY-2;
    cube.position.z=keyPositionZ;
    cube.rotation.x=0.4;
    scene.add(cube);

    geometry= new THREE.BoxGeometry(1,backBoxHeight-5, keyDepth);
    cube= new THREE.Mesh(geometry, materialBlack);
    cube.position.x=keyPositionX+backboxWidth+1;
    cube.position.y=keyPositionY-2;
    cube.position.z=keyPositionZ;
    cube.rotation.x=0.4;
    scene.add(cube);
*/
    for (i = 1; i <= nrWhiteKeys; i++) {

        geometry = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);
        cube = new THREE.Mesh(geometry, materialWhite);

        cube.rotation.x = defaultRotationX;

        cube.position.x = keyPositionX;
        cube.position.y = keyPositionY;
        cube.position.z = keyPositionZ;
        cube.receiveShadow = true;

        cube.note = keySounds[i - 1];

        keyPositionX += keyWidth + 0.03;
        whiteKeys.push(cube);
        scene.add(cube);
    }
    var x = 0;
    var blackKeyPositionOnX = -10 + 0.5 * keyWidth + 0.03;
    for (i = 1; i <= nrWhiteKeys - 1; i++) {

        if (i != 3 && i != 7 && i != 10 && i != 14) {
            x++;
            geometry = new THREE.BoxGeometry(keyWidth / 2.5, keyHeight / 2, keyDepth / 1.5);
            cube = new THREE.Mesh(geometry, materialBlack);

            cube.rotation.x = defaultRotationX;

            cube.position.x = blackKeyPositionOnX;
            cube.position.y = keyPositionY + keyHeight;
            cube.position.z = keyPositionZ;

            cube.castShadow = true;
            if (i == 15 || i == 16) {
                blackKeyPositionOnX += keyWidth - 0.1;
            }
            else
                blackKeyPositionOnX += keyWidth + 0.03;

            cube.note = keySounds[nrWhiteKeys + x - 1];

            blackKeys.push(cube);
            scene.add(cube);
        }
        else
            blackKeyPositionOnX += keyWidth + 0.03;

    }

    Keys = whiteKeys.concat(blackKeys);
    Keys.sort(function (a, b) {
        return(a.note - b.note);
    });

}

function render()
{
    renderer.clear();
    renderer.render(scene, camera);
}

function initEvents() {
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    initTouch();
}

projector = new THREE.Projector();
function onMouseDown(event) {
    if (nowPlaying !== null) {
        Keys[nowPlaying].rotation.x -= 0.1;
        Keys[nowPlaying].material = materialWhite;
        nowPlaying = null;
    }
    event.preventDefault();
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / (window.innerWidth / 2.5) ) * 2 + 1, 0.5);
    projector.unprojectVector(vector, camera);
    var rayCaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = rayCaster.intersectObjects(Keys);
    if (intersects.length > 0) {
        var selected = intersects[ 0 ].object;
        selected.rotation.x += 0.1;
        pressed = selected;
        NoteOn(selected.note);
        playedNotes.push(selected.note);
        render();

    }
}

function onMouseUp() {
    pressed.rotation.x -= 0.1;
    NoteOff(pressed.note);
    pressed = null;
    render();
}

function NoteOn(note) {
    MIDI.noteOn(0, note, 256, 0);
}
function NoteOff(note) {
    MIDI.noteOff(0, note);
}
var nowPlaying;
var sampleNotes = [];
var difficulty;
var previousMaterial;
//hard. first-FurElise second-LoveStory
var hard = ['data:audio/midi;base64,TVRoZAAAAAYAAAABA8BNVHJrAAABUQD/IAEAAP8DB1RyYWNrIDEA/38PBQ8cMjAxNC4wMi4wMwEDAP9/KgUPLU1pY3Jvc29mdCBTYW5zIFNlcmlmLDguMjUsRmFsc2UsRmFsc2UsMQD/f0MFDxIDA39/AP8BBDdTcGVha2VycyAvIEhlYWRwaG9uZXMgKElEVCBIaWdoIERlZmluaXRpb24gQXVkaW8gQ09ERUMpAP9YBAQCGAgA/1gEAwIYCACQTECDYIBMAACQS0CDYIBLAACQTECDYIBMAACQS0CDYIBLAACQTECDYIBMAACQR0CDYIBHAACQSkCDYIBKAACQSECDYIBIAACQRUCHQIBFAAD/fwgFDxoXQARAAACQPECDYIA8AACQQECDYIBAAACQRUCDYIBFAACQR0CHQIBHAACQQECDYIBAAACQRECDYIBEAACQR0CDYIBHAACQSECHQIBIAAD/LwA=',
    'data:audio/midi;base64,TVRoZAAAAAYAAAABA8BNVHJrAAABRQD/IAEAAP8DB1RyYWNrIDEA/38PBQ8cMjAxNC4wMi4wMwEDAP9/KgUPLU1pY3Jvc29mdCBTYW5zIFNlcmlmLDguMjUsRmFsc2UsRmFsc2UsMQD/f0MFDxIDA39/AP8BBDdTcGVha2VycyAvIEhlYWRwaG9uZXMgKElEVCBIaWdoIERlZmluaXRpb24gQXVkaW8gQ09ERUMpAP9YBAQCGAgA/1gEAwIYCACQSECHQIBIAACQQECHQIBAAACQQECHQIBAAACQSECHQIBIAACQSECPAIBIAACQQECHQIBAAACQQECHQIBAAACQSECHQIBIAACQSECHQIBIAACQQECHQIBAAACQQUCHQIBBAACQQECHQIBAAACQPkCHQIA+AACQPkCHQIA+AACQPkCHQIA+AACQR0CHQIBHAACQR0CHQIBHAAD/LwA='
];
//easy. first-ArpegiuDoMajor second-ArpediuReMajor
var easy = ['data:audio/midi;base64,TVRoZAAAAAYAAAABA8BNVHJrAAAAywD/IAEAAP8DB1RyYWNrIDEAwAAA/38PBQ8cMjAxNC4wMi4wMwEDAP9/KgUPLU1pY3Jvc29mdCBTYW5zIFNlcmlmLDguMjUsRmFsc2UsRmFsc2UsMQD/f0MFDxIDA39/AP8BBDdTcGVha2VycyAvIEhlYWRwaG9uZXMgKElEVCBIaWdoIERlZmluaXRpb24gQXVkaW8gQ09ERUMpAP9YBAQCGAgAkDxAh0CAPAAAkEBAh0CAQAAAkENAh0CAQwAAkEhAh0CASAAA/y8A',
    'data:audio/midi;base64,TVRoZAAAAAYAAAABA8BNVHJrAAAA0AD/IAEAAP8DB1RyYWNrIDEA/38PBQ8cMjAxNC4wMi4wMwEDAP9/KgUPLU1pY3Jvc29mdCBTYW5zIFNlcmlmLDguMjUsRmFsc2UsRmFsc2UsMQD/f0MFDxIDA39/AP8BBDdTcGVha2VycyAvIEhlYWRwaG9uZXMgKElEVCBIaWdoIERlZmluaXRpb24gQXVkaW8gQ09ERUMpAP9YBAQCGAgA/1gEAwIYCACQPkCHQIA+AACQQUCHQIBBAACQRUCHQIBFAACQSkCHQIBKAAD/LwA='
];
var medium = [];
function getSample(difficulty) {
    switch (difficulty) {
        case 1:
        {
            var random = (Math.floor((Math.random() * 10) + 1)) % 2;
            return easy[random];
        }
        case 2:
        {
            var random = (Math.floor((Math.random() * 10) + 1)) % 2;
            return medium[random];
        }
        case 3:
        {
            var random = (Math.floor((Math.random() * 10) + 1)) % 2;
            return hard[random];
        }

    }
}
var timer;
function play(song) {
    var player = MIDI.Player;
    player.loadFile(song, player.start);
    player.addListener(function (data) {
        sampleNotes.push(data.note);

        if (nowPlaying != null) {
            Keys[nowPlaying].rotation.x -= 0.1;
            Keys[nowPlaying].material = previousMaterial;
            clearTimeout(timer);
            render();
        }
        nowPlaying = data.note - 60;
        previousMaterial = Keys[nowPlaying].material;
        Keys[nowPlaying].material = materialPurple;
        Keys[nowPlaying].rotation.x += 0.1;
        timer = setTimeout(releaseLastKey, 1000);
        render();
    });

}
function releaseLastKey() {
    Keys[nowPlaying].rotation.x = defaultRotationX;
    Keys[nowPlaying].material = previousMaterial;
    nowPlaying = null;
    clearTimeout(timer);
    render();
}
var selectedSong;
function playSample() {
    playedNotes = [];
    sampleNotes = [];
    selectedSong = getSample(difficulty);
    play(selectedSong);
}

function realNotes(notes) {
    var real = [];
    real = real.concat(notes);
    for (var i in real) {
        real.splice(i, 1);
        i++;
    }
    return real;
}

function isEqual(first, second) {
    if (first.length != second.length)
        return false;
    for (var i in first)
        if (first[i] != second[i])
            return false;
    return true;
}

function displayArray() {
    realNotes = realNotes(sampleNotes);

    alert(realNotes.toString() + "vmksdmkvs" + playedNotes.toString());
}

function Check() {
    if (isEqual(realNotes(sampleNotes), playedNotes))
        alert("you got it");
    else
        alert("wrong");
}
function getDif() {
    alert(difficulty);
}
function displayDifficultySlider() {
    difficulty = 1;
    $("#sliderDifficulty").slider({
        orientation: "horizontal",
        range: "min",
        value: 1,
        max: 3,
        min: 1,
        slide: function (event, ui) {
            difficulty = ui.value;
        }

    })
}
function replaySample() {
    playedNotes = [];
    sampleNotes = [];
    play(selectedSong);
}
