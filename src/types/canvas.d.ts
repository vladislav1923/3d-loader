declare module 'canvas' {
    export class Canvas {
        constructor(width: number, height: number);
        toBuffer(mimeType?: string): Buffer;
        getContext(contextType: '2d'): CanvasRenderingContext2D;
        width: number;
        height: number;
    }

    export function createCanvas(width: number, height: number): Canvas;
} 