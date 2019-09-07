
var metapNum = 150;

var markingNum = 50;

var slideBallSize = 0.2;

var slideBallColor = 'rgb(0, 255, 255)';

var ballGroup = null;

var markingGeo = null;

var markingMats = null;


var initLines = function (scene, lines) {

    clearLines(scene);

    var animateDots = [];
    lines.forEach((item) => {
        let curve = new THREE.LineCurve3(item.start, item.end);
        animateDots.push(curve.getPoints(metapNum));
    });

    ballGroup = new THREE.Group();
    if (markingGeo == null) markingGeo = new THREE.SphereGeometry(slideBallSize, 10, 10);
    if (markingMats == null) {
        markingMats = [];
        for (var j = 0; j < markingNum; j++) {
            var mat = new THREE.MeshBasicMaterial({
                color: slideBallColor,
                transparent: true,
                opacity: 1 - j / markingNum
            })
            markingMats.push(mat);
        }
    }
    for (var i = 0; i < animateDots.length; i++) {
        for (var j = 0; j < markingNum; j++) {
            var aMesh = new THREE.Mesh(markingGeo, markingMats[j]);
            ballGroup.add(aMesh);
        }
    }
    var vIndex = 0;
    var firstBool = true;
    function animationLine() {
        if (!ballGroup) return;
        ballGroup.children.forEach(function (elem, index) {
            var _index = parseInt(index / markingNum);
            var index2 = index - markingNum * _index;
            var _vIndex = 0;
            if (firstBool) {
                _vIndex = vIndex - index2 % markingNum >= 0 ? vIndex - index2 % markingNum : 0;
            } else {
                _vIndex = vIndex - index2 % markingNum >= 0 ? vIndex - index2 % markingNum : metapNum + vIndex - index2;
            }
            var v = animateDots[_index][_vIndex];
            elem.position.set(v.x, v.y, v.z);
        })
        vIndex++;
        if (vIndex > metapNum) {
            vIndex = 0;
        }
        if (vIndex == metapNum && firstBool) {
            firstBool = false;
        }
        requestAnimationFrame(animationLine);
    }
    scene.add(ballGroup);
    animationLine();
















}


var clearLines = function (scene) {
    if (ballGroup == null) return;
    scene.remove(ballGroup);
    ballGroup = null;
}