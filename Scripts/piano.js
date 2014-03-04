/**
 * Created by Dana on 22/02/14.
 */
function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;
        case "touchend":   type="mouseup"; break;
        default: return;
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

function initTouch()
{
    document.addEventListener('touchstart', touchHandler, true);
    document.addEventListener('touchmove', touchHandler, true);
    document.addEventListener('touchend', touchHandler, true);
    document.addEventListener('touchcancel', touchHandler, true);
    return;
}
const C1=60,
    C1s=61,
    D1=62,
    D1s=63,
    E1=64,
    F1=65,
    F1s=66,
    G1=67,
    G1s=68,
    A1=69,
    A1s=70,
    B1=71,
    C2= 72,
    C2s=73,
    D2=74,
    D2s=75,
    E2=76,
    F2=77,
    F2s=78,
    G2=79,
    G2s=80,
    A2=81,
    A2s=82,
    B2=83,
    C3=84,
    C3s=85,
    D3=86,
    D3s=87,
    E3=88;

keySounds=[C1,D1,E1,F1,G1,A1,B1,C2,D2,E2,F2,G2,A2,B2,C3,D3,E3];
keySounds=keySounds.concat(C1s,D1s,F1s,G1s,A1s,C2s,D2s,F2s,G2s,A2s,C3s,D3s);

window.onload = function () {
    MIDI.loader = new widgets.Loader;
    MIDI.loadPlugin({
        soundfontUrl: "MIDI/soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function() {
            MIDI.loader.stop();
        }
    });
    initTouch();
    displayStupidSlider();
};

var whiteKeys = [];
var blackKeys = [];
var pressed;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(60, 2.5, 1, 20);
camera.position.set(0, 5, 15);
scene.add(camera);

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerWidth/2.5);
renderer.setClearColor(0x000000, 1);
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);
var light = new THREE.AmbientLight( 0x333333 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
directionalLight.position.set( 1, 2, 4).normalize();
directionalLight.intensity=1;
scene.add(directionalLight);

var materialWhite = new THREE.MeshPhongMaterial({color: 0xffffff});
var materialPurple= new THREE.MeshPhongMaterial({color:0x330330});
materialWhite.shininess=35.0;
var materialBlack = new THREE.MeshPhongMaterial({color: 0x000000});
materialBlack.shininess=35.0;
var keyPositionX=-10;
var keyPositionY=5;
var keyPositionZ=5;
var keyWidth=1.25;
var keyHeight=0.75;
var keyDepth=6;
var nrWhiteKeys=17;

var playedNotes=[];
var geometry;
var cube;
var i;
for(i=1;i<=nrWhiteKeys;i++)
{

    geometry = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);
    cube = new THREE.Mesh(geometry, materialWhite);

    cube.rotation.x=0.7;

    cube.position.x=keyPositionX;
    cube.position.y=keyPositionY;
    cube.position.z=keyPositionZ;
    cube.receiveShadow=true;

    cube.note=keySounds[i-1];

    keyPositionX+=keyWidth+0.03;
    whiteKeys.push(cube);
    scene.add(cube);
}
var x=0;
var blackKeyPositionOnX=-10+0.5*keyWidth+0.03;
for(i=1;i<=nrWhiteKeys-1;i++)
{

    if(i!=3&&i!=7&&i!=10&&i!=14)
        { x++;
        geometry = new THREE.BoxGeometry(keyWidth /2.5, keyHeight/2, keyDepth/1.5);
        cube = new THREE.Mesh(geometry, materialBlack);

        cube.rotation.x=0.7;

        cube.position.x=blackKeyPositionOnX;
        cube.position.y=keyPositionY+keyHeight;
        cube.position.z=keyPositionZ;

        cube.castShadow=true;
            if(i==15||i==16)
            {
                blackKeyPositionOnX+=keyWidth-0.1;
            }
            else
        blackKeyPositionOnX+=keyWidth+0.03;

        cube.note=keySounds[nrWhiteKeys+x-1];

        blackKeys.push(cube);
        scene.add(cube);
        }
    else
        blackKeyPositionOnX+=keyWidth+0.03;

}

var Keys = whiteKeys.concat(blackKeys);
Keys.sort(function (a,b)
{
    return(a.note- b.note);
});

function render ()
{
    renderer.clear();
    renderer.render(scene, camera);
}

render();

projector = new THREE.Projector();

renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mouseup', onMouseUp);


function onMouseDown( event ) {
    if(nowPlaying!==null)
    {Keys[nowPlaying].rotation.x-=0.1;
     Keys[nowPlaying].material=materialWhite;
        nowPlaying=null;
    }
    event.preventDefault();
    var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / (window.innerWidth/2.5) ) * 2 + 1, 0.5 );
    projector.unprojectVector( vector, camera );
    var rayCaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = rayCaster.intersectObjects( Keys );
    if ( intersects.length > 0 ) {
        var selected=intersects[ 0 ].object;
            selected.rotation.x+=0.1;
            pressed=selected;
            NoteOn(selected.note);
            playedNotes.push(selected.note);
        render();

}
}

function onMouseUp()
{
    pressed.rotation.x-=0.1;
    NoteOff(pressed.note);
    pressed=null;
    render();
}

function NoteOn(note)
{
    MIDI.noteOn(0,note,256,0);
}
function NoteOff(note)
{
    MIDI.noteOff(0,note);
}
var nowPlaying;
var sampleNotes=[];
var difficulty;
function playSample()
{
    playedNotes=[];
    sampleNotes=[];
    var song=['data:audio/midi;base64,TVRoZAAAAAYAAAABA8BNVHJrAAAAywD/IAEAAP8DB1RyYWNrIDEAwAAA/38PBQ8cMjAxNC4wMi4wMwEDAP9/KgUPLU1pY3Jvc29mdCBTYW5zIFNlcmlmLDguMjUsRmFsc2UsRmFsc2UsMQD/f0MFDxIDA39/AP8BBDdTcGVha2VycyAvIEhlYWRwaG9uZXMgKElEVCBIaWdoIERlZmluaXRpb24gQXVkaW8gQ09ERUMpAP9YBAQCGAgAkDxAh0CAPAAAkEBAh0CAQAAAkENAh0CAQwAAkEhAh0CASAAA/y8A',
        'data:audio/midi;base64,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'
        ];
    var player = MIDI.Player;
    player.loadFile(song[0],player.start);
    player.addListener(function(data)
        {
          sampleNotes.push(data.note);

      if(nowPlaying!=null)
            {
             Keys[nowPlaying].rotation.x-=0.1;
             Keys[nowPlaying].material=materialWhite;
             nowPlaying=null;
             render();
            }
    nowPlaying=data.note-60;
    Keys[nowPlaying].material=materialPurple;
    Keys[nowPlaying].rotation.x+=0.1;
    render();
    });
}

function realNotes(notes)
{
    var real=[];
    real=real.concat(notes);
    for (var i in real)
    {
        real.splice(i,1);
        i++;
    }
    return real;
}

function isEqual(first, second)
{
    if(first.length!=second.length)
        return false;
    for(var i in first)
        if(first[i]!=second[i])
            return false;
    return true;
}

function displayArray()
{
    realNotes=realNotes(sampleNotes);

    alert(realNotes.toString()+"vmksdmkvs"+playedNotes.toString());
}

function Check()
{
    if(isEqual(realNotes(sampleNotes),playedNotes))
        alert("you got it");
    else
        alert("wrong");
}
function getDif()
{
    alert(difficulty);
}
function displayStupidSlider(){
    $( "#slider").slider({
        orientation:"horizontal",
        range:"min",
        value:1,
        max: 3,
        min:1,
        slide: function(event, ui)
        {
            difficulty=ui.value;
        }

    })

}