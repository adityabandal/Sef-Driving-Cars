class Envelope{
    constructor(skeleton, width, roundness=1) {
        this.skeleton = skeleton;
        this.poly = this.#generatePolygon(width, roundness);
    }

    #generatePolygon(width, roundness){
        const {p1, p2} = this.skeleton;
        
        const rad = width/2;
        const alpha = angle(subtract(p1, p2));
        
        const alpha_cw = alpha+ Math.PI/2;
        const alpha_ccw = alpha- Math.PI/2;
        
        const p1_ccw = translate(p1, alpha_ccw, rad);
        const p2_ccw = translate(p2, alpha_ccw, rad);

        const p1_cw = translate(p1, alpha_cw, rad);
        const p2_cw = translate(p2, alpha_cw, rad);

        const points = [];
        const step = Math.PI/Math.max(1, roundness);
        const eps = step/2;
        for(let i = alpha_ccw ;i<=alpha_cw+eps;i+=step){
            points.push(translate(p1, i, rad));
        }
        for(let i = alpha_ccw ;i<=alpha_cw+eps;i+=step){
            points.push(translate(p2, i+Math.PI, rad));
        }
        

        return new Polygon(points);
    }

    draw(ctx, options){
        this.poly.draw(ctx, options);
    }
}