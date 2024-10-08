class World{
    constructor(
            graph, roadWidth = 100,
            roadRoundness = 20,
            buildingWidth = 150,
            buildingMinLength = 150,
            spacing = 50,
            treeSize = 160
        ){
        this.graph = graph;
        this.roadRoundness = roadRoundness;
        this.roadWidth = roadWidth;
        this.buildingMinLength = buildingMinLength;
        this.buildingWidth = buildingWidth
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];
        this.trees = [];

        this.generate();
    }

    generate(){
        this.envelopes.length = 0;
        for(const seg of this.graph.segments){
            this.envelopes.push(
                new Envelope(seg, this.roadWidth, this.roadRoundness)
            );
        }

        this.roadBorders = Polygon.union(this.envelopes.map((e)=>e.poly));
        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();
    }

    #generateTrees(){
        const points = [
            ...this.roadBorders.map((e)=>[e.p1, e.p2]).flat(),
            ...this.buildings.map((e)=>e.base.points).flat()
        ];

        const left = Math.min(...points.map((p)=>p.x));
        const right = Math.max(...points.map((p)=>p.x));
        const top = Math.min(...points.map((p)=>p.y));
        const bottom = Math.max(...points.map((p)=>p.y));

        const illegalPolys = [
            ...this.buildings.map((b)=>b.base),
            ...this.envelopes.map((e)=>e.poly)
        ]

        const trees = [];
        let tryCount = 0;
        while(tryCount < 100){
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(top, bottom, Math.random())
            );

            let keep = true;
            for(const poly of illegalPolys){
                if(poly.containsPoint(p) || poly.distanceToPoint(p)<this.treeSize/2){
                    keep = false;
                    break;
                }
            }

            if(keep){
                for(const t of trees){
                    if(distance(t.center, p)<this.treeSize){
                        keep = false;
                        break;
                    }
                }
            }

            if(keep){
                let closeTOSomething = false;
                for(const poly of illegalPolys){
                    if(poly.distanceToPoint(p)<this.treeSize*2){
                        closeTOSomething = true;
                        break;
                    }
                }
                keep = closeTOSomething;
            }

            if(keep) {
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }

    #generateBuildings(){
        const temEnvelopes = [];

        for(const seg of this.graph.segments){
            temEnvelopes.push(
                new Envelope(
                    seg,
                    this.roadWidth+ this.buildingWidth + this.spacing*2,
                    this.roadRoundness
                )
            )
        }
        const guides = Polygon.union(temEnvelopes.map((e)=>e.poly));

        for(let i=0;i<guides.length;i++){
            const seg = guides[i];

            if(seg.length() < this.buildingMinLength){
                guides.splice(i,1);
                i--;
            }
        }

        const supports = [];

        for(let seg of guides){
            const len = seg.length()+this.spacing;

            const numBld = Math.floor(
                len / (this.buildingMinLength+this.spacing)
            );

            const buildingsLength = len / numBld - this.spacing;

            const dir = seg.directionVector();

            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingsLength));
            // console.log("pushing");
            supports.push(new Segment(q1, q2));

            for(let i=2;i<=numBld;i++){
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingsLength));
                supports.push(new Segment(q1, q2));
            }
        }

        const bases = [];

        for(const seg of supports){
            bases.push(new Envelope(seg, this.buildingWidth).poly);
        }

        const eps = 0.001;
        for(let i=0;i<bases.length-1;i++){
            for(let j=i+1;j<bases.length;j++){
                if(bases[i].intersectsPoly(bases[j])
                    || bases[i].distanceToPoly(bases[j]) < this.spacing - eps
                ){
                    bases.splice(j,1);
                    j--;
                }
            }
        }
        return bases.map((b)=>new Building(b));
    }


    draw(viewpoint){
        for(const env of this.envelopes){
            env.draw(ctx, {fill: "#BBB", stroke:"#BBB", linewidth: 15});
        }

        for(const seg of this.graph.segments){
            seg.draw(ctx, {color:"white", width:4, dash: [10,10]});
        }
        for(const seg of this.roadBorders){
            seg.draw(ctx, {color:"white", width:4});
        }
        const items = [...this.buildings, ...this.trees];
        items.sort((a,b)=>
            b.base.distanceToPoint(viewpoint) - 
            a.base.distanceToPoint(viewpoint)
        );
        for(const item of items){
            item.draw(ctx, viewpoint);
        }
        // demo change
    }
}