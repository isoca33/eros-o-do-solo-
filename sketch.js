let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // Valor inicial
let vegetationTrees = []; // Array para armazenar as posições das árvores de vegetação
let clouds = []; // Array para armazenar as nuvens
let urbanBuildings = []; // Array para armazenar os prédios urbanos
let cars = []; // Array para armazenar os carros

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
  initializeVegetation(); // Inicializa as árvores na inicialização
  initializeClouds(); // Inicializa as nuvens
  initializeUrbanArea(); // Inicializa os prédios urbanos
  initializeCars(); // Inicializa os carros
}

function draw() {
  background(200, 220, 255); // Céu

  drawClouds(); // Desenha as nuvens em todas as sessões

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();

  if (tipoSolo === "vegetacao") {
    drawVegetation();
  } else if (tipoSolo === "urbanizado") {
    drawUrbanArea();
    drawRoad(); // Desenha a rua na área urbana
    drawCars(); // Desenha os carros em movimento
    updateCars(); // Atualiza a posição dos carros
  }

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  if (tipoSolo === "vegetacao") {
    initializeVegetation(); // Reinicializa as árvores quando o tipo volta para vegetação
  } else if (tipoSolo === "urbanizado") {
    initializeUrbanArea(); // Inicializa os prédios quando o tipo muda para urbanizado
    initializeCars(); // Inicializa os carros quando o tipo muda para urbanizado
    vegetationTrees = []; // Limpa as árvores
  } else {
    vegetationTrees = []; // Limpa as árvores
    urbanBuildings = []; // Limpa os prédios
    cars = []; // Limpa os carros
  }
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.05; // Erosão mais lenta com vegetação
    else if (this.tipo === "exposto") taxa = 0.2;  // Erosão mais rápida em solo exposto
    else if (this.tipo === "urbanizado") taxa = 0.1; // Erosão moderada em área urbanizada

    this.erosao += taxa;
    this.altura -= taxa; // A altura do solo diminui com a erosão
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") fill(60, 150, 60);
    else if (this.tipo === "exposto") fill(139, 69, 19);
    else if (this.tipo === "urbanizado") fill(120);

    rect(0, this.altura, width, height - this.altura);

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(2)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
}

function initializeVegetation() {
  vegetationTrees = [];
  for (let i = 0; i < 5; i++) {
    let treeX = random(50, width - 50);
    vegetationTrees.push(treeX);
  }
}

function drawVegetation() {
  let treeBottomY = height - 80; // Base das árvores alinhada com o solo
  for (let treeX of vegetationTrees) {
    // Tronco
    fill(101, 67, 33); // Cor marrom
    rect(treeX - 5, treeBottomY - 30, 10, 30);

    // Copa
    fill(34, 139, 34); // Cor verde escura
    ellipse(treeX, treeBottomY - 45, 30, 30);
  }
}

class Cloud {
  constructor() {
    this.x = random(width);
    this.y = random(20, 80);
    this.speed = random(0.1, 0.5);
    this.size = random(30, 60);
  }

  move() {
    this.x += this.speed;
    if (this.x > width + this.size) {
      this.x = -this.size;
      this.y = random(20, 80);
    }
  }

  show() {
    fill(255, 255, 255, 200); // Branco com alguma transparência
    noStroke();
    ellipse(this.x, this.y, this.size * 1.5, this.size);
    ellipse(this.x + this.size / 2, this.y - this.size / 3, this.size, this.size * 0.8);
    ellipse(this.x - this.size / 2, this.y - this.size / 4, this.size * 0.8, this.size * 0.7);
  }
}

function initializeClouds() {
  clouds = [];
  for (let i = 0; i < 3; i++) {
    clouds.push(new Cloud());
  }
}

function drawClouds() {
  for (let cloud of clouds) {
    cloud.move();
    cloud.show();
  }
}

function initializeUrbanArea() {
  urbanBuildings = [];
  // Cria mais prédios com alturas maiores e larguras variadas
  for (let i = 0; i < 12; i++) {
    let buildingX = random(10, width - 10);
    let buildingHeight = random(80, 200);
    let buildingWidth = random(20, 40);
    urbanBuildings.push({ x: buildingX, h: buildingHeight, w: buildingWidth });
  }
}

function drawUrbanArea() {
  let groundY = height - 80; // Nível do solo urbanizado
  fill(80); // Cor dos prédios (cinza mais escuro)
  noStroke();
  for (let building of urbanBuildings) {
    rect(building.x - building.w / 2, groundY - building.h, building.w, building.h);
    // Adiciona janelas aos prédios
    fill(200); // Cor das janelas (cinza claro)
    let windowSpacingX = 5;
    let windowSpacingY = 8;
    let windowWidth = 6;
    let windowHeight = 8;
    for (let y = groundY - building.h + windowSpacingY; y < groundY - windowHeight; y += windowHeight + windowSpacingY) {
      for (let x = building.x - building.w / 2 + windowSpacingX; x < building.x + building.w / 2 - windowWidth; x += windowWidth + windowSpacingX) {
        if (random(1) < 0.8) { // Chance de ter uma janela
          rect(x, y, windowWidth, windowHeight);
        }
      }
    }
  }
}

function drawRoad() {
  let roadY = height - 30; // Posição vertical da rua
  fill(50); // Cor da rua (cinza escuro)
  rect(0, roadY, width, 30); // Desenha um retângulo para a rua

  // Desenha algumas faixas amarelas na rua
  fill(255, 255, 0); // Cor amarela
  let stripeWidth = 10;
  let stripeHeight = 5;
  let stripeSpacing = 50;

  for (let x = stripeSpacing / 2; x < width; x += stripeSpacing) {
    rect(x - stripeWidth / 2, roadY + 12.5, stripeWidth, stripeHeight);
  }
}

class Car {
  constructor(y) {
    this.x = random(-50, 0); // Começam fora da tela à esquerda
    this.y = y;
    this.speed = random(1, 3);
    this.width = 30;
    this.height = 15;
    this.color = color(random(255), random(255), random(255));
  }

  move() {
    this.x += this.speed;
    if (this.x > width + 50) { // Se sair da tela à direita, volta para a esquerda
      this.x = random(-50, 0);
      this.speed = random(1, 3);
      this.color = color(random(255), random(255), random(255));
    }
  }

  show() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height, 5); // Carro com bordas arredondadas
  }
}

function initializeCars() {
  cars = [];
  let roadY = height - 30;
  // Cria alguns carros em diferentes faixas da rua
  cars.push(new Car(roadY + 5));
  cars.push(new Car(roadY + 15));
}

function updateCars() {
  for (let car of cars) {
    car.move();
  }
}

function drawCars() {
  for (let car of cars) {
    car.show();
  }
}
