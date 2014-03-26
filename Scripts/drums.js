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
    canvas.setHeight(window.innerWidth/2.1);
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
    canvas.setHeight(window.innerWidth/2);
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
    var rad1=canvas.width/16;
    var rad=canvas.width/18;
    var bottomX=0;
    var bottomY=canvas.height;
    var rightX=canvas.width;
    var arrow=new fabric.Image.fromURL('images/arrowLeft.png', function(img){

    img.set({
        left:20,
        right:20
    });
    });

    var Tom1= new fabric.Circle({radius:rad, fill:'#FFE87C', top:3.75*rad,left:6*rad1,
        stroke: '#424242', strokeWidth: 6});
    var Tom2= new fabric.Circle({ radius: rad, fill: '#98D9E9', top: 3.75*rad, left: 8*rad1,
        stroke: '#424242', strokeWidth: 6 });
    var Crash = new fabric.Circle({ radius: rad1, fill: '#95CA54', top: 1.80*rad1, left: 4.6*rad1,
        stroke: '#eee' });
    var SRim = new fabric.Circle({radius:0.8*rad, fill:'#A25EA6', top:bottomY-1.97*rad1,left:bottomX +5.53*rad1 ,
        stroke: '#eee'});
    var Snare = new fabric.Circle({ radius: 1.2*rad1, fill: '#AC5FA6', top: bottomY-2.5*rad1, left: bottomX +5*rad1,
        stroke: '#696969', strokeWidth: 7 });
    var OHiHat= new fabric.Circle({radius:rad, fill:'#FEEF39', top:3.5*rad , left:3.5*rad1,
        stroke: '#eee'});
    var CHiHat = new fabric.Circle({ radius: rad, fill: '#EF4754', top:4.5*rad1 , left: 3.5*rad,
        stroke: '#eee'});
    var HiHatP = new fabric.Rect({width:0.75*rad, height:1.25*rad1, angle: 330,  fill:'#95CA54', top:bottomY-1.25*rad,left:4.25*rad,
        stroke: '#eee', strokeWidth: 5});
    var Ride= new fabric.Circle({radius:rad1*1.15, fill:'#0BBF59', top:2.5*rad1,left:rightX-6*rad1,
        stroke: '#eee'});
    var FloorTom = new fabric.Circle({radius:1.35*rad1, fill:'#EE4594', top:bottomY-2.75*rad1,left:rightX-7*rad,
        stroke: '#696969', strokeWidth: 7});
    var kick = new fabric.Circle({ radius: 1.2*rad1, fill: '#FFB13A', top:bottomY-2.75*rad1 , left:rightX/2-0.6*rad1, scaleY: 0.5,
        stroke: '#585858', strokeWidth: 6});

    kick.setGradient('fill', {
        type: 'radial',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        r1: 0,
        r2: kick.width,
        colorStops: {
            0: '#424242',
            0.6: '#F2F2F2',
            1: '#424242'

        }
    });

    FloorTom.setGradient('fill', {
        type: 'radial',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        r1: 0,
        r2: FloorTom.width,
        colorStops: {
            0: '#A64500',
            0.3: '#FFD073',
            1: '#FFC473'

        }
    });
    Snare.setGradient('fill', {
        type: 'radial',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        r1: 0,
        r2: Snare.width,
        colorStops: {
            0: '#A64500',
            0.2: '#FFC273',
            1: '#FFC473'

        }
    });
    SRim.setGradient('fill', {
    type: 'radial',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    r1: 0,
    r2: SRim.width,
    colorStops: {
        0: '#A64500',
        0.2: '#FFC473',
        1: '#BF6B30'

    }
});

    Tom1.setGradient('fill', {
        type: 'radial',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        r1: 0,
        r2: 0.75*Tom1.width,
        colorStops: {
            0: '#FFFF00',
            0.3: '#00B945',
            1: '#071907'
        }
    });
    Tom2.setGradient('fill', {
        type: 'radial',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        r1: 0,
        r2: 0.75*Tom2.width,
        colorStops: {
            0: '#FFFF00',
            0.3: '#00B945',
            1: '#071907'
        }
    })

    OHiHat.setGradient('fill', {
        type: 'radial',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        r1: 0,
        r2: OHiHat.radius,
        colorStops: {

            0: '#A63100',
            0.15:'#C92804',
            0.5: '#FAA302',
            1: '#F2F21B'
        }
    });
    Crash.setGradient('fill', {
        type: 'radial',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        r1: 0,
        r2: Crash.radius,
        colorStops: {
            0: '#A63100',
            0.1: '#C92804',
            0.5: '#FAA302',
            1: '#F2F21B'
        }
    });

    CHiHat.setGradient('fill', {
        type: 'radial',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        r1: 0,
        r2: OHiHat.radius,
        colorStops: {
            0: '#C92804',
            0.5: '#FAA302',
            1: '#F2F21B'
        }
    });
    Ride.setGradient('fill', {
        type: 'radial',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        r1: 0,
        r2: Ride.radius,
        colorStops: {
            0: '#C92804',
            0.5: '#FAA302',
            1: '#F2F21B'
        }
    });


    kick.name="KickDrum";
    FloorTom.name="FloorTom";
    Crash.name="Crash";
    Snare.name="Rim"
    Tom1.name="Tom1";
    Tom2.name="Tom2";
    Ride.name="Ride";
    CHiHat.name="ClosedHighHat";
    OHiHat.name="OpenHighHat";
    HiHatP.name="HighHatPedal";
    SRim.name="Snare";


    drums.push(fix(kick), fix(CHiHat), fix(Snare), fix(Crash), fix(Tom2), fix(Tom1), fix(FloorTom), fix(Ride), fix(OHiHat), fix(HiHatP), fix(SRim));
    //drums.push(kick, CHiHat,Snare,Crash,Tom2, Tom1, FloorTom, Ride, OHiHat,HiHatP,SRim);
    for(var i in drums)
    {
        canvas.add(drums[i]);
    }
    canvas.add(arrow);

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

