class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for(let i=1;i<=this.points.length;i++){
            this.segments.push(
                new Segment(points[i-1], points[i % this.points.length])
            )
        }
    }

    draw(ctx, {stroke = "blue", linewidth = 2, fill = "rgba(0,0,255,0.3)"} = {}){
        ctx.beginPath();
        ctx.strokeStyle = stroke;
        ctx.fillStyle = fill;
        ctx.lineWidth = linewidth;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for(let i=1;i<this.points.length;i++){
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static break(poly1, poly2){
        const segs1 = poly1.segments;
        const segs2 = poly2.segments;

        for(let i=0;i<segs1.length;i++){
            for( let j=0;j<segs2.length;j++){
                const int = getIntersection(
                    segs1[i].p1, segs1[i].p2, segs2[j].p1, segs2[j].p2
                )

                if(int && int.offset!=1 && int.offset!=0){
                    const point = new Point(int.x, int.y);

                    let aux = segs1[i].p2;
                    segs1[i].p2 = point;
                    segs1.splice(i+1, 0, new Segment(point, aux));

                    aux = segs2[j].p2;
                    segs2[j].p2 = point;
                    segs2.splice(j+1, 0, new Segment(point, aux));
                }
            }
        }
    }

    drawSegments(ctx){
        for(const seg of this.segments) {
            seg.draw(ctx, {color: getRandomColor(), width: 5});
        }
    }

    static multiBreak(polys){
        for(let i=0;i<polys.length-1;i++){
            for(let j=i+1;j<polys.length;j++){
                Polygon.break(polys[i], polys[j]);
            }
        }
    }

    static union(polys){
        Polygon.multiBreak(polys);
        const keepSegs = [];

        for(let i=0;i<polys.length;i++){
            for(const seg of polys[i].segments){
                let keep = true;
                for(let j=0;j<polys.length;j++){
                    if(i!=j){
                        if(polys[j].containsSegment(seg)){
                            keep = false;
                            break;
                        }
                    }
                }
                if(keep){
                    keepSegs.push(seg);
                }
            }
        }

        return keepSegs;
    }

    containsSegment(seg){
        const midpt = average(seg.p1, seg.p2);
        return this.containsPoint(midpt);
    }

    containsPoint(p){
        const outerPoint = new Point(-1000, -1000);

        let intCnt = 0;
        for(const seg of this.segments){
            const int = getIntersection(outerPoint, p, seg.p1, seg.p2);
            if(int){
                intCnt++;
            }
        }

        return intCnt%2;
    }

    distanceToPoint(p){
        return Math.min(...this.segments.map((s)=>s.distanceToPoint(p)));
    }

    intersectsPoly(poly){
        for(let s1 of this.segments){
            for(let s2 of poly.segments){
                if(getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)){
                    return true;
                }
            }
        }
        return false;
    }
}

