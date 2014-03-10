/**
 * Created by Dana on 08/03/14.
 */
window.onload = function () {
    $.ionSound({
        sounds: [
            "applause"
        ],
        path: "sounds/",
        multiPlay: true,
        volume: "1.0"
    });

    $.ionSound.play("applause");
    MIDI.loadPlugin({

        soundfontUrl: "MIDI/soundfont/",
        instrument: "synth_drum",
        callback: function () {
            MIDI.programChange(0, 118);
            MIDI.setVolume(0, 127);
        }
    });
};

function playSound(note)
{
    NoteOn(note);
}

function NoteOn(note) {
    MIDI.noteOn(0, note, 256, 0);
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
    var orange = new fabric.Circle({ radius: rad1, fill: '#FFB13A', top:bottomY-2*rad1 , left:bottomX+2*rad1 });
    var purple = new fabric.Circle({ radius: rad1, fill: '#AC5FA6', top: bottomY-4*rad1, left: bottomX+6*rad1 });
    var red = new fabric.Circle({ radius: rad, fill: '#EF4754', top:bottomY-4*rad1+rad , left: rightX-4*rad });
    var green = new fabric.Circle({ radius: rad, fill: '#95CA54', top: rad1*2-rad, left: rad1*3 });
    var blue= new fabric.Circle({ radius: rad, fill: '#98D9E9', top: 0, left: 6*rad1+2*rad });
    var yellow= new fabric.Circle({radius:rad, fill:'#FFE87C', top:0,left:5*rad+rad/2});
    var pink= new fabric.Circle({radius:rad, fill:'#EE4594', top:bottomY-3*rad1,left:bottomX+rad});
    var green2= new fabric.Circle({radius:rad1, fill:'#0BBF59', top:bottomY-2*rad1,left:bottomX+10*rad1});
    var yellow2= new fabric.Circle({radius:rad, fill:'#FEEF39', top:bottomY-3*rad+rad/2,left:rightX-6*rad});

    orange.note=30;
    purple.note=35;
    red.note=44;
    green.note=50;
    blue.note=60;
    yellow.note=65;
    pink.note=70;
    yellow2.note=73;
    green2.note=80;

    drums.push(fix(orange), fix(red), fix(purple), fix(green), fix(blue), fix(yellow), fix(pink), fix(green2), fix(yellow2));
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
        playSound(obj.note);
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

