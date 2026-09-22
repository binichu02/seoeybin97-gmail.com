export const STEP = .4;
export const bounds = { minX: -8.65, maxX: 8.65, minZ: -5.65, maxZ: 6.65 };
export function isWalkable(x,z,obstacles,radius=.32){
  if(x<bounds.minX||x>bounds.maxX||z<bounds.minZ||z>bounds.maxZ)return false;
  return !obstacles.some(o=>Math.abs(x-o.x)<o.w/2+radius&&Math.abs(z-o.z)<o.d/2+radius);
}
export function findPath(start,target,obstacles){
  const nx=Math.floor((bounds.maxX-bounds.minX)/STEP)+1,nz=Math.floor((bounds.maxZ-bounds.minZ)/STEP)+1;
  const point=i=>({x:bounds.minX+(i%nx)*STEP,z:bounds.minZ+Math.floor(i/nx)*STEP});
  const valid=i=>{const p=point(i);return isWalkable(p.x,p.z,obstacles);};
  const nearest=p=>{let best=-1,dist=Infinity;for(let i=0;i<nx*nz;i++){const q=point(i),d=(q.x-p.x)**2+(q.z-p.z)**2;if(d<dist&&valid(i)){best=i;dist=d;}}return best;};
  const a=nearest(start),b=nearest(target);if(a<0||b<0)return [];
  const open=new Set([a]),came=new Map(),g=new Map([[a,0]]);
  const heuristic=i=>{const p=point(i),q=point(b);return Math.abs(p.x-q.x)+Math.abs(p.z-q.z);};
  while(open.size){let current=-1,score=Infinity;for(const i of open){const f=g.get(i)+heuristic(i);if(f<score){current=i;score=f;}}
    if(current===b){const result=[];let i=b;while(i!==a){result.unshift(point(i));i=came.get(i);}result.unshift(point(a));if(isWalkable(target.x,target.z,obstacles))result.push({x:target.x,z:target.z});return result;}
    open.delete(current);const x=current%nx,z=Math.floor(current/nx);
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||xx>=nx||zz<0||zz>=nz)continue;const n=zz*nx+xx;if(!valid(n))continue;const next=g.get(current)+STEP;if(next<(g.get(n)??Infinity)){came.set(n,current);g.set(n,next);open.add(n);}}
  }return [];
}
