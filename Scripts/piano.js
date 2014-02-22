/**
 * Created by Dana on 22/02/14.
 */

var whiteKeys = new Array();
var blackKeys = new Array();
var pressed;
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(60, 2.5, 1, 20);
camera.position.set(0, 5, 15);
//camera.lookAt(new THREE.Vector3());
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

/*spotlight = new THREE.SpotLight( 0xFFFFFF );
spotlight.position.set( 0, 100, 300 );
spotlight.castShadow=true;
spotlight.angle = 20 * Math.PI / 180;
spotlight.exponent = 1;
spotlight.target.position.set( 0, 10, 0 );
scene.add( spotlight );

*/

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

for(var i=1;i<=17;i++)
{

    var geometry = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);
    var cube = new THREE.Mesh(geometry, materialWhite);
    cube.rotation.y=-0.0;
    cube.rotation.x=0.4;
    cube.rotation.z=-0.0
    cube.position.x=keyPositionX;
    cube.position.y=keyPositionY;
    cube.position.z=keyPositionZ;
    cube.receiveShadow=true;
    keyPositionX+=keyWidth+0.03;
    whiteKeys.push(cube);
    scene.add(cube);
}
var blackKeyPositionOnX=-7+0.5*keyWidth+0.03;
for(var i=1;i<=16;i++)
{
    if(i!=3&&i!=7&&i!=10&&i!=14)
        {var geometry = new THREE.BoxGeometry(keyWidth /2.5, keyHeight/2, keyDepth/1.5);
        var cube = new THREE.Mesh(geometry, materialBlack);

        cube.rotation.y=-0.0;
        cube.rotation.z=-0.0;
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



var render = function ()
{
    //requestAnimationFrame(render);
    //cube.rotation.x += 0.1;
    //cube.rotation.y += 0.1;
    renderer.render(scene, camera);
};
render();

projector = new THREE.Projector();

renderer.domElement.addEventListener('click', onMouseClick);


var timer;

function onMouseClick( event ) {
    event.preventDefault();
    var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
    projector.unprojectVector( vector, camera );
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = raycaster.intersectObjects( whiteKeys );
    if ( intersects.length > 0 ) {
        var selected=intersects[ 0 ].object;
        if(selected!=pressed)
            {selected.rotation.x+=0.1;
             if(pressed!=null)
             {pressed.rotation.x-=0.1;

             }
                pressed=selected;

             timer=setTimeout(function()
                                {pressed.rotation.x-=0.1;
                                 pressed=null;
                                 render();
                                },400);
            }
        render();
    }
}


function render() {

    renderer.render( scene, camera );

}

