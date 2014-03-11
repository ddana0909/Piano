/**
 * Created by Dana on 08/03/14.
 */
window.onload = function () {
    $.ionSound({
        sounds: [
            "ClosedHighHat",
            "Crash",
            "FloorTom",
            "HighHatPedal",
            "KickDrum",
            "OpenHighHat",
            "Ride",
            "Rim",
            "Snare",
            "Tom1",
            "Tom2"
        ],
        path: "sounds/tobe/",
        multiPlay: true,
        volume: "1.0"
    });


   /* MIDI.loadPlugin({

        soundfontUrl: "MIDI/soundfont/",
        instrument: "synth_drum",
        callback: function () {
            MIDI.programChange(0, 118);
            MIDI.setVolume(0, 127);
        }
    });*/
};

function playSound(name)
{
    $.ionSound.play(name);
}

var canvas;
window.addEventListener('resize',OnResize, false);
window.addEventListener('load', OnLoad, false);

function OnLoad()
{
    canvas = new fabric.Canvas('c', {  hoverCursor: 'pointer', selection: false });
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerWidth/2.5);
    initObjects();
    canvas.renderAll();

    canvas.on({
        'mouse:down' : Grow,
        'mouse:up' : Shrink
    });
}

function OnResize()
{
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerWidth/2.5);
    canvas.clear();
    initObjects();
    canvas.renderAll();
}

function fix(obj)
{
    obj.hasControls = obj.hasBorders = false;
    obj.lockMovementX=obj.lockMovementY=true;
    return obj;
}

function initObjects()
{
    var drums=[];
    var rad1=canvas.height/5;
    var rad=canvas.height/6;
    var bottomX=0;
    var bottomY=canvas.height;
    var rightX=canvas.width;

    var orange = new fabric.Circle({ radius: rad1, fill: '#FFB13A', top:bottomY-2*rad1 , left:bottomX+2*rad1,
        stroke: '#eee', strokeWidth: 10});
    var purple = new fabric.Circle({ radius: rad1, fill: '#AC5FA6', top: bottomY-3*rad1, left: bottomX+4*rad1-rad,
        stroke: '#eee', strokeWidth: 10 });
    var red = new fabric.Circle({ radius: rad, fill: '#EF4754', top: 2*rad1 , left: rightX-2*rad,
        stroke: '#eee', strokeWidth: 10});
    var green = new fabric.Circle({ radius: rad, fill: '#95CA54', top: rad1*2-2*rad, left: rad1*3-rad,
        stroke: '#eee', strokeWidth: 10 });
    var blue= new fabric.Circle({ radius: rad, fill: '#98D9E9', top: rad/2, left: 6*rad1+1*rad,
        stroke: '#eee', strokeWidth: 10 });
    var yellow= new fabric.Circle({radius:rad, fill:'#FFE87C', top:rad/2,left:6*rad,
        stroke: '#eee', strokeWidth: 10});
    var pink= new fabric.Circle({radius:rad, fill:'#EE4594', top:bottomY-3*rad1,left:bottomX+rad,
        stroke: '#eee', strokeWidth: 10});
    var green2= new fabric.Circle({radius:rad1, fill:'#0BBF59', top:0,left:bottomX+10*rad1,
        stroke: '#eee', strokeWidth: 10});
    var yellow2= new fabric.Circle({radius:rad, fill:'#FEEF39', top:bottomY-4*rad1+rad , left:rightX-4*rad,
        stroke: '#eee', strokeWidth: 10});

    var blue2 = new fabric.Circle({radius:rad, fill:'#98D9E9', top:bottomY-2*rad,left:rightX-2.5*rad,
        stroke: '#eee', strokeWidth: 10});
    var purple2 = new fabric.Circle({radius:rad1, fill:'#AC5FA6', top:2*rad,left:8*rad1-0.5*rad,
        stroke: '#eee', strokeWidth: 10});

    orange.name="KickDrum";
    pink.name="FloorTom";
    green.name="Crash";
    purple.name="Snare"
    yellow.name="Tom1";
    blue.name="Tom2";
    green2.name="Ride";
    red.name="ClosedHighHat";
    yellow2.name="OpenHighHat";
    blue2.name="HighHatPedal";
    purple2.name="Rim";


    drums.push(fix(orange), fix(red), fix(purple), fix(green), fix(blue), fix(yellow), fix(pink), fix(green2), fix(yellow2), fix(blue2), fix(purple2));
    for(var i in drums)
    {
        canvas.add(drums[i]);
    }

}

function Grow(e)
{

    var obj = e.target;
    if(obj)
    {
        obj.radius+=10;
        $.ionSound.play(obj.name);
        canvas.renderAll();
    }
    return;
}
function Shrink(e)
{
    var obj = e.target;
    if(obj)
    {
        obj.radius-=10;
        canvas.renderAll();
    }
    return;
}
function goToPiano()
{
    window.location.assign("index.html");
}

