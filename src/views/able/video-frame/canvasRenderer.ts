// import { throttle } from "@pureadmin/utils";
import { emitter } from "@/utils/mitt";

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private images: {
    img: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  private container: HTMLElement;
  private positionX: number;
  private isDragging: boolean;
  private startX: number;

  constructor(containerId: string) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.images = [];
    this.positionX = 0;
    this.isDragging = false;
    this.startX = 0;

    this.container = document.getElementById(containerId);
    if (this.container) {
      this.container.appendChild(this.canvas);
      this.canvas.width = this.container.clientWidth;
      this.canvas.height = this.container.clientHeight;
    }
  }

  public addImage(
    url: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const img = new Image();
    img.src = url;

    this.images.push({
      img,
      x,
      y,
      width,
      height
    });

    this.render();
  }

  public render() {
    this.clearRect();

    this.images.forEach(imgProps => {
      const x = imgProps.x + this.positionX;
      this.ctx.drawImage(
        imgProps.img,
        x,
        imgProps.y,
        imgProps.width,
        imgProps.height
      );
    });
  }

  public clearImages() {
    this.images = [];
  }

  public clearRect() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public drawTick(event) {
    this.render();

    // 当前勾选图片的索引
    const index =
      Math.ceil(
        (Math.abs(this.positionX) + event.offsetX) / this.images[0].width
      ) - 1;
    const x = event.offsetX;
    const y = event.offsetY;

    // 绘制样式
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = "round";

    // 绘制对勾
    this.ctx.beginPath();
    this.ctx.moveTo(x - 10, y);
    this.ctx.lineTo(x, y + 10);
    this.ctx.lineTo(x + 15, y - 10);
    this.ctx.stroke();

    emitter.emit("imageInfo", this.images[index]);
  }

  public addListener() {
    if (!this.canvas) return;
    this.canvas.addEventListener("click", this.handleClick);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("touchstart", this.handleTouchStart);
    this.canvas.addEventListener("touchmove", this.handleTouchMove);
    this.canvas.addEventListener("touchend", this.handleTouchEnd);
    // window.addEventListener("resize", throttle(this.handleWindowResize, 200));
  }

  private handleClick = (event: MouseEvent) => {
    this.drawTick(event);
  };

  private handleMouseDown = (event: MouseEvent) => {
    this.startDrag(event.clientX);
  };

  private handleMouseMove = (event: MouseEvent) => {
    this.drag(event.clientX);
  };

  private handleMouseUp = () => {
    this.endDrag();
  };

  private handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.startDrag(event.touches[0].clientX);
    }
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.drag(event.touches[0].clientX);
    }
  };

  private handleTouchEnd = () => {
    this.endDrag();
  };

  private startDrag(clientX: number) {
    this.canvas.style.cursor = "grabbing";
    this.canvas.style.userSelect = "none";

    this.startX = clientX;
    this.isDragging = true;
  }

  private drag(clientX: number) {
    if (!this.isDragging) return;

    const deltaX = clientX - this.startX;
    const maxPositionX =
      this.images.length * this.images[0].width - this.container.clientWidth;
    this.positionX = Math.max(
      Math.min(this.positionX + deltaX, 0),
      -maxPositionX
    );
    this.startX = clientX;

    this.render();
  }

  private endDrag() {
    this.canvas.style.cursor = "grab";
    this.canvas.style.userSelect = "auto";
    this.isDragging = false;
  }

  // private handleWindowResize = () => {
  //   this.canvas.width = this.container.clientWidth;
  //   this.canvas.height = this.container.clientHeight;
  //   this.render();
  // };
}
