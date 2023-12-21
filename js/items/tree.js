class Tree{
    constructor(center, size, heightCoeff=0.3){
        this.center = center;
        this.size = size;
        this.heightCoeff = heightCoeff;
        this.base = this.#generateLevel(center, size);
    }

    #generateLevel(point, size){
        const points = [];
        const rad = size/2;
        for(let a=0;a<=Math.PI*2;a+=Math.PI/16){
            const kindOfRandom = Math.cos(((a+this.center.x+this.center.y)*size)%17)**2;
            const noisyRadius = rad * lerp(0.5, 1, kindOfRandom);
            points.push(translate(point, a, noisyRadius));
        }

        return new Polygon(points);
    }

    draw(ctx, viewpoint){

        const diff = subtract(this.center, viewpoint);

        
        const top = add(this.center, scale(diff, 0.3));
        
        const levelCount = 15;

        for(let i=0;i<levelCount;i++){
            const t = i/(levelCount-1);
            const point = lerp2D(this.center, top, t);
            const color = "rgba(30, " + lerp(50,200,t) + ", 70)";
            const size = lerp(this.size, 40, t);
            const poly = this.#generateLevel(point, size);
            poly.draw(ctx, {fill:color, stroke: "rgba(0,0,0,0)"});
        }
    }


}