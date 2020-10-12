
var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};
window.addEventListener('load', init, false);

function init(){
    // cài đặt scene, camera, và renderer
	createScene();

	// thêm ánh sáng
	createLights();

	// thêm các đối tượng
	createPlane();
	createSea();
	createSky();

	// bắt đầu vòng lặp cập nhật vị trí các đối tượng
	// và render scene trong mỗi khung hình
	loop();
}

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
renderer, container;

function createScene(){
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scence();
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    // Tạo camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	// Đặt vị trí cho camera
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;

    // Tạo renderer
	renderer = new THREE.WebGLRenderer({
		// Cho phép trong suốt để hiển thị màu nền
		// đã định nghĩa trong CSS
		alpha: true,

		// Bật khử răng cưa; hiệu năng sẽ giảm
		// nhưng sẽ ổn thôi vì project này ít đối tượng
		antialias: true
    });
    // Xác định kích cỡ của renderer; trong trường hợp này,
	// là full toàn màn hình
	renderer.setSize(WIDTH, HEIGHT);

	// Cho phép render bóng đổ
	renderer.shadowMap.enabled = true;

	// Thêm DOM của renderer vào
	// container ta đã tạo trong HTML
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);

	// Nếu người dùng resize trình duyệt
	// cần cập nhật lại camera và size của renderer
	window.addEventListener('resize', handleWindowResize, false);
    
}
function handleWindowResize() {
	// cập nhật lại kích thước của renderer và camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
	// Nguồn sáng bán cầu là loại có màu tô chuyển (gradient)
	// tham số đầu tiên là màu trời, thứ 2 là màu đất,
	// thứ 3 là cường độ ánh sáng
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

	// Nguồn sáng có hướng tỏa ra từ 1 vị trí nhất định
	// Nó giống như mặt trời, nghĩa là các tia được tạo ra song song với nhau.
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	// Đặt vị trí cho nguồn sáng
	shadowLight.position.set(150, 350, 350);

	// Cho phép phủ bóng
	shadowLight.castShadow = true;

	// cài đặt vùng nhìn thấy của bóng đổ
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// cài đặt độ phân giải của bóng đổ; càng cao càng đẹp,
	// nhưng cũng càng nặng nề hơn
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	// thêm vào scene để kích hoạt
	scene.add(hemisphereLight);
	scene.add(shadowLight);
}