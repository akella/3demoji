import * as THREE from 'three';
import {TimelineMax} from 'gsap';
var OrbitControls = require('three-orbit-controls')(THREE);



var camera, pos, controls, scene, renderer, geometry, geometry1, material;

function init() {
  scene = new THREE.Scene();
  scene.destination = {x:0,y:0};
  scene.background = new THREE.Color(0x000000);

  renderer = new THREE.WebGLRenderer();



  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001, 100
  );
  camera.position.set( 0, 0, 1 );


  controls = new OrbitControls(camera, renderer.domElement);




  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);


  material = new THREE.ShaderMaterial( {
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable',
    },
    // wireframe: true,
    uniforms: {
      time: { type: 'f', value: 0 },
      blend: { type: 'f', value: 0 },
      original: { type: 't', value: THREE.ImageUtils.loadTexture( 'img/est.png' ) },
      target: { type: 't', value: THREE.ImageUtils.loadTexture( 'img/devil.png' ) }
    },
    vertexShader: document.getElementById( 'vertShader' ).textContent,
    fragmentShader: document.getElementById( 'fragShader' ).textContent,
  });

  // let points = new THREE.Points(geometry,material);
  let plane = new THREE.Mesh(new THREE.PlaneGeometry( 1,1, 200, 200 ),material);
  scene.add(plane);
  console.log(scene);


   



  let tl = new TimelineMax();
  
  $('body').on('click',() => {
    if($('body').hasClass('done')) {
      tl.to(material.uniforms.blend,2,{
      	value:0,
      	
      });
      $('body').removeClass('done');
    } else{
      tl.to(material.uniforms.blend,2,{
      	value:1,
      	ease: Elastic.easeOut.config(1, 0.3)
      });
      $('body').addClass('done');
    }
  });




  resize();
    

 
}

window.addEventListener('resize', resize); 
function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  renderer.setSize( w, h );
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

let time = 0;
function animate() {
  time++;
  material.uniforms.time.value = time;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  scene.rotation.x += (scene.destination.x - scene.rotation.x)*0.05;
  scene.rotation.y += (scene.destination.y - scene.rotation.y)*0.05;
  renderer.render(scene, camera);
}

let ww = window.innerWidth;
let wh = window.innerHeight;
function onMousemove(e) {
  var x = (e.clientX-ww/2)/(ww/2);
  var y = (e.clientY-wh/2)/(wh/2);
  scene.destination.x = y*0.5;
  scene.destination.y = x*0.5;
}
window.addEventListener('mousemove', onMousemove);

init();
animate();
