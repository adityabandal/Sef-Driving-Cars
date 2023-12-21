class Building{
    constructor(base, heightCoeff = 0.2){
        this.base = base;
        this.heightCoeff = heightCoeff;
    }


    draw(ctx, viewpoint){
       
        const topPoints = this.base.points.map((p)=>
            // console.log(add(p, scale(subtract(p, viewpoint), this.heightCoeff)));
            add(p, scale(subtract(p, viewpoint), this.heightCoeff))
        )
        const ceiling = new Polygon(topPoints);
        const sides = [];

        for(let i=0;i<this.base.points.length;i++){
            const nextI = (i+1) % this.base.points.length;

            const poly = new Polygon([
                this.base.points[i], this.base.points[nextI],
                topPoints[nextI], topPoints[i]
            ]);

            sides.push(poly);
        }
        sides.sort(
            (a, b) =>
                b.distanceToPoint(viewpoint) -
                a.distanceToPoint(viewpoint)
            
        );
        this.base.draw(ctx, {fill:"white", stroke:"#AAA"});
        for(let i=0;i<sides.length;i++){
            // const t = i/(sides.length-1);
            // const color = "rgba(0, " + lerp(10,200,t) + ", 0)";
            sides[i].draw(ctx, {fill:"white", stroke:"#AAA"});
        }
        ceiling.draw(ctx, {fill:"white", stroke:"#AAA"});
    }
}