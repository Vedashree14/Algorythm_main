import * as THREE from 'https://cdn.skypack.dev/three@0.133.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.133.0/examples/jsm/loaders/GLTFLoader.js'


const canvas = document.querySelector('.webgl')
const scene =  new THREE.Scene()

let clock, mixer, model
clock = new THREE.Clock()

const loader = new GLTFLoader()
loader.load('assets/FabConvert.com_untitledmtireddddd.glb', function(glb){
 

  
    model = glb
  mixer = new THREE.AnimationMixer(glb.scene)
  mixer.clipAction(glb.animations[0]).play()
  scene.add(model.scene)
    

    console.log(glb)
    const root = glb.scene;
    scene.add(root);
}, function(xhr){
    console.log((xhr.loaded/xhr.total*100) + "% loaded")
}, function(error){
    console.log('An error occurred')
})

//const ambientLight = new THREE.AmbientLight(0xffffff);
//scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(1,-1,14)
scene.add(light)

//const pointLight = new THREE.PointLight(0xffffff, 5, 1);
//pointLight.position.set(10, 1, 1); 
//scene.add(pointLight);



const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(125, sizes.width/sizes.height, 0.1, 200)
camera.position.set(0.6,0.4,2)

scene.add(camera)

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
	alpha: true
    
})
renderer.setClearColor( 0x000000, 0 )
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding





 
  class CameraOrientationState {
    constructor() {
      this.pitchAngle = 0;
      this.yawAngle = 0;
      this.startingPitchAngleForCurrentCoordinates = 0;
      this.startingYawAngleForCurrentCoordinates = 0;
      this.previousPitchAngle = 0;
      this.previousYawAngle = 0;
      this.lastMouseMoveTime = 0;
      this.movementDuration = 100;
    }
  }
  

  export const handleMouseMovement = (mouseX, mouseY, cameraOrientationState) => {
    const now = performance.now() 

    cameraOrientationState.lastMouseMoveTime = now;

    const rotationScale = 0.06;

    cameraOrientationState.pitchAngle = -(mouseY * rotationScale) * Math.PI; 
    cameraOrientationState.yawAngle = -(mouseX * rotationScale) * Math.PI; 

    cameraOrientationState.startingPitchAngleForCurrentCoordinates = cameraOrientationState.previousPitchAngle;
    cameraOrientationState.startingYawAngleForCurrentCoordinates = cameraOrientationState.previousYawAngle;
    
}

export const handleCameraRotation = (camera, cameraOrientationState) => {
    const now = performance.now()
  
    const timeElapsed = now - cameraOrientationState.lastMouseMoveTime

    if( timeElapsed < cameraOrientationState.movementDuration){

        const timeLeftPercentage = timeElapsed / cameraOrientationState.movementDuration;
        const minimumDegreeOfChange = 0.05;
        
        let interpolationFactor = Math.max(timeLeftPercentage, minimumDegreeOfChange); 

        const interpolatedPitchAngle = (1 - interpolationFactor) * cameraOrientationState.startingPitchAngleForCurrentCoordinates + interpolationFactor * cameraOrientationState.pitchAngle; //The max value for t will be one, since the time elapsed is the amount of time since the last update. And t will never be more than 1. It goes from 0 to 1 sort of like 0% of elapsed time cycle to 100%
        const interpolatedYawAngle = (1 - interpolationFactor) * cameraOrientationState.startingYawAngleForCurrentCoordinates + interpolationFactor * cameraOrientationState.yawAngle;
        
        camera.rotation.x = interpolatedPitchAngle;
        camera.rotation.y = interpolatedYawAngle;

        cameraOrientationState.previousPitchAngle = interpolatedPitchAngle;
        cameraOrientationState.previousYawAngle = interpolatedYawAngle;
        
    }
}

const mouse = new THREE.Vector2();

let cameraOrientationState = new CameraOrientationState();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;

  handleMouseMovement(mouse.x, mouse.y, cameraOrientationState);
}

document.addEventListener('mousemove', onMouseMove, false);

function animate() {
    requestAnimationFrame(animate)
    if (mixer) {
      mixer.update(clock.getDelta())
    }
    handleCameraRotation(camera, cameraOrientationState);
    
    renderer.render(scene, camera)
  }
  animate()



  const blob = document.getElementById("blob");

window.onpointermove = event => { 
  const { clientX, clientY } = event;
  
  blob.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
  }, { duration: 3000, fill: "forwards" });
}



(function () {
  const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

  let today = new Date(),
      dd = String(today.getDate()).padStart(2, "0"),
      mm = String(today.getMonth() + 1).padStart(2, "0"),
      yyyy = today.getFullYear(),
      nextYear = yyyy + 1,
      dayMonth = "01/15/",
      birthday = dayMonth + yyyy;
  
  today = mm + "/" + dd + "/" + yyyy;
  if (today > birthday) {
    birthday = dayMonth + nextYear;
  }
  
  const countDown = new Date(birthday).getTime(),
      x = setInterval(function() {    

        const now = new Date().getTime(),
              distance = countDown - now;

        document.getElementById("days").innerText = Math.floor(distance / (day)),
          document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
          document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
          document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

        if (distance < 0) {
          document.getElementById("headline").innerText = "AND THE TECH FEST BEGINS!!!";
          document.getElementById("countdown").style.display = "none";
          document.getElementById("content").style.display = "block";
          clearInterval(x);
        }
      }, 0)
  }());