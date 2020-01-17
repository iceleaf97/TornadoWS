/**
 * Created by iceleaf on 2016/10/18.
 */
var scene, camera, WIDTH, HEIGHT, fov, aspect, near, far,
    renderer, container, controls;
var x, y, alpha, beta, gamma;
var camRX, camRY, camRZ;

var time=0; // create a new variable as a timer.

var startButton = document.getElementById( 'startButton' );
			startButton.addEventListener( 'click', function () {
				init();
			}, false );

var ws = new WebSocket("wss://domain_name:port/ws");  // set the domain name and port
ws.onopen = function(e){
    console.log('Connection to server opened');
    console.log(e);
}
ws.onmessage = function(event) { 
    console.log('Client received a message', event); 
  }; 
ws.onclose = function (e) {
    console.log('connection closed.');
}

function mousePosData(event){
    var jsonObj = {
        mouseX: event.pageX,
        mouseY: event.pageY
    };
    var jsonString = JSON.stringify(jsonObj);
    ws.send(jsonString);
    x = event.pageX;
    y = event.pageY;
    var docX = document.getElementById('x');
    var docY = document.getElementById('y');
    docX.innerHTML = "x: "+ x;
    docY.innerHTML = "y: "+ y;
}

function touchPosData(event){
    event.preventDefault();
    var jsonObj = {
        touchX: event.touches[0].clientX,
        touchY: event.touches[0].clientY
    };
    var jsonString = JSON.stringify(jsonObj);
    ws.send(jsonString);
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
    var docX = document.getElementById('x');
    var docY = document.getElementById('y');
    docX.innerHTML = "x: "+ x;
    docY.innerHTML = "y: "+ y;
}

function orientData(event){
    var jsonObj = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
    }
    var jsonString = JSON.stringify(jsonObj);
    ws.send(jsonString);

    alpha = event.alpha;
    beta = event.beta;
    gamma = event.gamma;
    var docAlpha = document.getElementById('alpha');
    var docBeta = document.getElementById('beta');
    var docGamma = document.getElementById('gamma');
    docAlpha.innerHTML = "alpha: "+ alpha;
    docBeta.innerHTML = "beta: "+ beta;
    docGamma.innerHTML = "gamma: "+ gamma;
}

function sendCameraData(){
    var pi = 180;
    camRX= camera.rotation.x * pi,
    camRY= camera.rotation.y * pi,
    camRZ= camera.rotation.z * pi
    var jsonObj = {
        camRX: camRX,
        camRY: camRY,
        camRZ: camRZ
    }
    var jsonString = JSON.stringify(jsonObj);
    ws.send(jsonString);

    var docAlpha = document.getElementById('camAlpha');
    var docBeta = document.getElementById('beta');
    var docGamma = document.getElementById('gamma');
    docAlpha.innerHTML = "camAlpha: "+ camRX;
    docBeta.innerHTML = "beta: "+ camRY;
    docGamma.innerHTML = "gamma: "+ camRZ;
}

// a web page has completely loaded, and run the function init()
//window.addEventListener('load', init, false);



function init() {
    createScene();
    createModel();
    render();
    // createOrbit();
    loop();
    window.addEventListener('mousemove', mousePosData, false);
    window.addEventListener('touchmove', touchPosData, false);
    window.addEventListener('deviceorientation', sendCameraData);
}

function createScene() {
    scene = new THREE.Scene();
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    fov = 50;
    aspect = WIDTH/HEIGHT;
    near = 1;
    far = 10000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 80);

    controls = new THREE.DeviceOrientationControls(camera);
}


function createModel(){
    var geometry = new THREE.IcosahedronGeometry(10, 0);
    var material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

}

function render() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    container = document.getElementById('scene');
    container.appendChild(renderer.domElement);
}

// function createOrbit() {
//     control = new THREE.OrbitControls(camera, renderer.domElement);
//     control.object.position.set(0, 0, 80);
//     control.target.set(0, 0, 0);
//     control.update();
// }

function loop() {
     time += 0.01;                         ///////////////////////////////////
     mesh.position.y = 10*Math.sin(time);  //  change the mesh's position   //
     mesh.position.x = 10*Math.cos(time);  //       in every frame          //
     mesh.rotation.y += 0.05;              ///////////////////////////////////
     controls.update();
     //sendCameraData();
     
     renderer.render(scene, camera);
     requestAnimationFrame(loop);
}