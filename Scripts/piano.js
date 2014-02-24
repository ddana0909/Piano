/**
 * Created by Dana on 22/02/14.
 */
window.onload = function () {
    MIDI.loader = new widgets.Loader;
    MIDI.loadPlugin({
        soundfontUrl: "MIDI/soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function() {
            MIDI.loader.stop();
        }
    });
};

var whiteKeys = [];
var blackKeys = [];
var pressed;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(60, 2.5, 1, 20);
camera.position.set(0, 5, 15);
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
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
materialWhite.shininess=35.0;
var materialBlack = new THREE.MeshPhongMaterial({color: 0x000000});
materialBlack.shininess=35.0;
var keyPositionX=-7;
var keyPositionY=3;
var keyPositionZ=5;
var keyWidth=1;
var keyHeight=0.75;
var keyDepth=4;

var geometry;
var cube;
var i;
for(i=1;i<=17;i++)
{

    geometry = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);
    cube = new THREE.Mesh(geometry, materialWhite);

    cube.rotation.x=0.4;

    cube.position.x=keyPositionX;
    cube.position.y=keyPositionY;
    cube.position.z=keyPositionZ;
    cube.receiveShadow=true;
    keyPositionX+=keyWidth+0.03;
    whiteKeys.push(cube);
    scene.add(cube);
}
var blackKeyPositionOnX=-7+0.5*keyWidth+0.03;
for(i=1;i<=16;i++)
{
    if(i!=3&&i!=7&&i!=10&&i!=14)
        {
        geometry = new THREE.BoxGeometry(keyWidth /2.5, keyHeight/2, keyDepth/1.5);
        cube = new THREE.Mesh(geometry, materialBlack);

        cube.rotation.x=0.4;

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


        blackKeys.push(cube);
        scene.add(cube);
        }
    else
        blackKeyPositionOnX+=keyWidth+0.03;

}

var Keys = whiteKeys.concat(blackKeys);

function render ()
{
    renderer.render(scene, camera);
}

render();

projector = new THREE.Projector();

renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mouseup', onMouseUp);

function onMouseDown( event ) {
    event.preventDefault();
    var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / (window.innerWidth/2.5) ) * 2 + 1, 0.5 );
    projector.unprojectVector( vector, camera );
    var rayCaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = rayCaster.intersectObjects( Keys );
    if ( intersects.length > 0 ) {
        var selected=intersects[ 0 ].object;
            selected.rotation.x+=0.1;
            pressed=selected;
            NoteOn(50);
        render();

}
}

function onMouseUp()
{
    pressed.rotation.x-=0.1;
    NoteOff(50);
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
