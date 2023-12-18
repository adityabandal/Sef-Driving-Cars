class Graph {
    constructor(points = [], segments = []){
        this.points = points;
        this.segments = segments;
    }

    draw(ctx){
        for(const seg of this.segments){
            seg.draw(ctx);
        }

        for(const point of this.points){
            point.draw(ctx);
        }
    }

    dispose(){
        this.points.length = 0;
        this.segments.length = 0;
    }

    containsPoint(point){
        return this.points.find((p) => p.equals(point));
    }

    containsSegment(seg){
        return this.segments.find((s) => s.equals(seg));
    }

    addPoint(p){
        this.points.push(p);
    }

    addSegment(seg){
        this.segments.push(seg);;
    }

    removeSegment(seg){
        this.segments.splice(this.segments.indexOf(seg), 1);
    }

    removePoint(point){
        const segs = this.getSegmentsWithPoints(point);
        for(const seg of segs){
            this.removeSegment(seg);
        }
        this.points.splice(this.points.indexOf(point), 1);
    }

    getSegmentsWithPoints(point){
        const segs = [];

        for(const seg of this.segments){
            if(seg.includes(point)){
                segs.push(seg);
            }
        }

        return segs;
    }

    tryAddPoint(point){
        if(!this.containsPoint(point)){
            this.addPoint(point);
            return true;
        }
        return false;
    }

    tryAddSegment(segment){
        if(!this.containsSegment(segment) && !segment.p1.equals(segment.p2)){
            this.addSegment(segment);
            return true;
        }
        return false;
    }

    static load(info){
        const points = info.points.map((i) => new Point(i.x, i.y));
        const segs = info.segments.map((i)=> new Segment(
            points.find((p)=>p.equals(i.p1)),
            points.find((p)=>p.equals(i.p2)),
        ))
        return new Graph(points,segs);
    }

    hash(){
        return JSON.stringify(this);
    }
}