

class Sprite {
    x: number;
    y: number;
    speed: number;
    image: HTMLImageElement;
    update: () => void;
    onclick: (x: number, y: number) => void;
    dest_x: number | undefined;
    dest_y: number | undefined;

    constructor(x: number, y: number, image_url: string, update_method: () => void, onclick_method: (x: number, y: number) => void) {
        this.x = x;
        this.y = y;
        this.speed = 4;
        this.image = new Image();
        this.image.src = image_url;
        this.update = update_method;
        this.onclick = onclick_method;
    }

    set_destination(x: number, y: number) {
        this.dest_x = x;
        this.dest_y = y;
    }

    ignore_click(x: number, y: number) {
    }

    move(dx: number, dy: number) {
        if (this.dest_x !== undefined && this.dest_y !== undefined) {
            this.dest_x = this.x + dx;
            this.dest_y = this.y + dy;
        }
    }

    go_toward_destination() {
        if (this.dest_x === undefined || this.dest_y === undefined)
            return;

        if (this.x < this.dest_x)
            this.x += Math.min(this.dest_x - this.x, this.speed);
        else if (this.x > this.dest_x)
            this.x -= Math.min(this.x - this.dest_x, this.speed);
        if (this.y < this.dest_y)
            this.y += Math.min(this.dest_y - this.y, this.speed);
        else if (this.y > this.dest_y)
            this.y -= Math.min(this.y - this.dest_y, this.speed);
    }

    sit_still() {
    }
}

class Model {
    sprites: Sprite[];
    turtle: Sprite;

    constructor() {
        this.sprites = [];
        this.sprites.push(new Sprite(200, 100, "lettuce.png", () => { }, (x, y) => { }));
        this.turtle = new Sprite(50, 50, "turtle.png", () => this.turtle.go_toward_destination(), (x, y) => this.turtle.set_destination(x, y));
        this.sprites.push(this.turtle);
    }

    update() {
        for (const sprite of this.sprites) {
            sprite.update();
        }
    }

    onclick(x: number, y: number) {
        for (const sprite of this.sprites) {
            sprite.onclick(x, y);
        }
    }

    move(dx: number, dy: number) {
        this.turtle.move(dx, dy);
    }
}

class View {
    model: Model;
    canvas: HTMLCanvasElement;
    turtle: HTMLImageElement;

    constructor(model: Model) {
        this.model = model;
        this.canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        this.turtle = new Image();
        this.turtle.src = "turtle.png";
    }

    update() {
        const ctx = this.canvas.getContext("2d");
			if(ctx){
            ctx.clearRect(0, 0, 1000, 500);
            for (const sprite of this.model.sprites) {
                ctx.drawImage(sprite.image, sprite.x - sprite.image.width / 2, sprite.y - sprite.image.height);
            }
			}
        
    }
}

class Controller {
    model: Model;
    view: View;
    key_right: boolean;
    key_left: boolean;
    key_up: boolean;
    key_down: boolean;

    constructor(model: Model, view: View) {
        this.model = model;
        this.view = view;
        this.key_right = false;
        this.key_left = false;
        this.key_up = false;
        this.key_down = false;
        const self = this;
        view.canvas.addEventListener("click", (event) => { self.onClick(event); });
        document.addEventListener('keydown', (event) => { self.keyDown(event); }, false);
        document.addEventListener('keyup', (event) => { self.keyUp(event); }, false);
    }

    onClick(event: MouseEvent) {
        const x = event.pageX - this.view.canvas.offsetLeft;
        const y = event.pageY - this.view.canvas.offsetTop;
        this.model.onclick(x, y);
    }

    keyDown(event: KeyboardEvent) {
        if (event.keyCode == 39) this.key_right = true;
        else if (event.keyCode == 37) this.key_left = true;
        else if (event.keyCode == 38) this.key_up = true;
        else if (event.keyCode == 40) this.key_down = true;
    }

    keyUp(event: KeyboardEvent) {
        if (event.keyCode == 39) this.key_right = false;
        else if (event.keyCode == 37) this.key_left = false;
        else if (event.keyCode == 38) this.key_up = false;
        else if (event.keyCode == 40) this.key_down = false;
    }

    update() {
        let dx = 0;
        let dy = 0;
        const speed = this.model.turtle.speed;
        if (this.key_right) dx += speed;
        if (this.key_left) dx -= speed;
        if (this.key_up) dy -= speed;
        if (this.key_down) dy += speed;
        if (dx != 0 || dy != 0)
            this.model.move(dx, dy);
    }
}

class Game {
    model: Model;
    view: View;
    controller: Controller;

    constructor() {
        this.model = new Model();
        this.view = new View(this.model);
        this.controller = new Controller(this.model, this.view);
    }

    onTimer() {
        this.controller.update();
        this.model.update();
        this.view.update();
    }
}

const game = new Game();
const timer = setInterval(() => { game.onTimer(); }, 40);