const wireframeStyle={version:8,projection:{type:'globe'},sources:{},layers:[{id:'space',type:'background',paint:{'background-color':'#000000'}}],sky:{'sky-color':'#000000','horizon-color':'#e2e2e2','fog-color':'#161616','sky-horizon-blend':.14,'horizon-fog-blend':.06,'fog-ground-blend':.35,'atmosphere-blend':.12}};
const map = new maplibregl.Map({container:'globe',style:wireframeStyle,center:[12,18],zoom:1.15,minZoom:0,maxZoom:8});
map.addControl(new maplibregl.NavigationControl({visualizePitch:true}),'bottom-right');
let interacting=false;
let interactionTimer;
const countriesPromise=fetch('countries-110m.geojson').then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json()});

map.on('load',async()=>{try{
  const bathymetry=[
    {id:'depth-6000',file:'bathymetry_E_6000.geojson',color:'#555860',opacity:.38,width:.72,fill:.025},
    {id:'depth-5000',file:'bathymetry_F_5000.geojson',color:'#5e6168',opacity:.41,width:.76,fill:.028},
    {id:'depth-4000',file:'bathymetry_G_4000.geojson',color:'#64676e',opacity:.44,width:.79,fill:.03},
    {id:'depth-3000',file:'bathymetry_H_3000.geojson',color:'#686b72',opacity:.46,width:.82,fill:.032},
    {id:'depth-2000',file:'bathymetry_I_2000.geojson',color:'#767980',opacity:.5,width:.88,fill:.036},
    {id:'depth-1000',file:'bathymetry_J_1000.geojson',color:'#85888f',opacity:.55,width:.94,fill:.04},
    {id:'depth-200',file:'bathymetry_K_200.geojson',color:'#a7aab0',opacity:.68,width:1.08,fill:.05}
  ];
  bathymetry.forEach(level=>{
    map.addSource(level.id,{type:'geojson',data:level.file});
    map.addLayer({id:level.id+'-fill',type:'fill',source:level.id,paint:{'fill-color':level.color,'fill-opacity':level.fill}});
    map.addLayer({id:level.id,type:'line',source:level.id,paint:{'line-color':level.color,'line-width':['interpolate',['linear'],['zoom'],0,level.width,6,level.width*1.8],'line-opacity':level.opacity,'line-blur':.15}});
  });
  const response=await fetch('cable-geo.json'); if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const data=await response.json();
  const yearsResponse=await fetch('cable-years.json');if(!yearsResponse.ok)throw new Error(`Years HTTP ${yearsResponse.status}`);
  const years=await yearsResponse.json();
  data.features.forEach(feature=>feature.properties.year=Number(years[feature.properties.id])||9999);
  const particleData=createCableParticles(data,.38);
  const landingData=createLandingPoints(data);
  map.addSource('cables',{type:'geojson',data});
  map.addSource('particles',{type:'geojson',data:particleData});
  map.addSource('landings',{type:'geojson',data:landingData});
  map.addImage('landing-plus',createPlusIcon());
  map.addLayer({id:'cable-traces',type:'line',source:'cables',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#ff2bd6','line-width':['interpolate',['linear'],['zoom'],0,.42,6,1.05],'line-opacity':.86}});
  map.addLayer({id:'particle-halo',type:'circle',source:'particles',paint:{'circle-color':'#6e4da8','circle-radius':['interpolate',['linear'],['zoom'],0,1.3,6,2.7],'circle-opacity':.04,'circle-blur':.92}});
  map.addLayer({id:'particles',type:'circle',source:'particles',paint:{'circle-color':'#9b8ab8','circle-radius':['interpolate',['linear'],['zoom'],0,.3,6,.68],'circle-opacity':.18}});
  map.addLayer({id:'landings',type:'symbol',source:'landings',layout:{'icon-image':'landing-plus','icon-size':['interpolate',['linear'],['zoom'],0,.48,6,.85],'icon-allow-overlap':true,'icon-ignore-placement':true},paint:{'icon-opacity':.95}});
  map.on('mouseenter','landings',()=>map.getCanvas().style.cursor='pointer');
  map.on('mouseleave','landings',()=>map.getCanvas().style.cursor='');
  map.on('click','landings',event=>showLandingInfo(event.features[0].properties));
  map.on('mouseenter','cables',()=>map.getCanvas().style.cursor='pointer'); map.on('mouseleave','cables',()=>map.getCanvas().style.cursor='');
  const slider=document.querySelector('#year-slider');
  const applyYear=()=>{const year=Number(slider.value),filter=['<=',['get','year'],year];['cable-traces','particle-halo','particles','landings'].forEach(id=>map.setFilter(id,filter));document.querySelector('#selected-year').textContent=year;const visibleIds=new Set(data.features.filter(feature=>feature.properties.year<=year).map(feature=>feature.properties.id));document.querySelector('#year-count').textContent=`${visibleIds.size} cables`};
  slider.addEventListener('input',applyYear);applyYear();
}catch(error){console.error('GeoJSON loading error:',error)}});
map.on('mousedown',()=>interacting=true);map.on('touchstart',()=>interacting=true);map.on('mouseup',()=>interacting=false);map.on('touchend',()=>interacting=false);
map.getCanvas().addEventListener('wheel',()=>{interacting=true;clearTimeout(interactionTimer);interactionTimer=setTimeout(()=>interacting=false,700)},{passive:true});
map.on('zoomstart',()=>interacting=true);map.on('zoomend',()=>{clearTimeout(interactionTimer);interactionTimer=setTimeout(()=>interacting=false,350)});
function spin(){if(!interacting&&map.getZoom()<5){const center=map.getCenter();center.lng-=.012/Math.max(1,map.getZoom());map.setCenter(center)}requestAnimationFrame(spin)}map.once('idle',spin);
function createCableParticles(data,spacing){const features=[];data.features.forEach((feature,featureIndex)=>{const groups=feature.geometry.type==='MultiLineString'?feature.geometry.coordinates:[feature.geometry.coordinates];groups.forEach(line=>{for(let index=0;index<line.length-1;index++){const a=line[index],b=line[index+1];let deltaLng=b[0]-a[0];if(deltaLng>180)deltaLng-=360;if(deltaLng< -180)deltaLng+=360;const deltaLat=b[1]-a[1],distance=Math.hypot(deltaLng*Math.cos((a[1]+b[1])*Math.PI/360),deltaLat),steps=Math.max(1,Math.ceil(distance/spacing));for(let step=0;step<steps;step++){const t=step/steps;let lng=a[0]+deltaLng*t;if(lng>180)lng-=360;if(lng< -180)lng+=360;features.push({type:'Feature',properties:{energy:hashEnergy(featureIndex,index,step),year:feature.properties.year},geometry:{type:'Point',coordinates:[lng,a[1]+deltaLat*t]}})}}})});return {type:'FeatureCollection',features}}
function createLandingPoints(data){return {type:'FeatureCollection',features:data.features.filter(feature=>Array.isArray(feature.properties.coordinates)).map(feature=>({type:'Feature',properties:{name:feature.properties.name||'Unnamed cable',id:feature.properties.id||feature.properties.feature_id||'—',latitude:feature.properties.coordinates[1],longitude:feature.properties.coordinates[0],year:feature.properties.year},geometry:{type:'Point',coordinates:feature.properties.coordinates}}))}}
function hashEnergy(a,b,c){const value=Math.sin(a*12.9898+b*78.233+c*37.719)*43758.5453;return value-Math.floor(value)}
function createPlusIcon(){const size=32,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const context=canvas.getContext('2d');context.clearRect(0,0,size,size);context.strokeStyle='#ffffff';context.lineWidth=2.4;context.lineCap='square';context.beginPath();context.moveTo(16,7);context.lineTo(16,25);context.moveTo(7,16);context.lineTo(25,16);context.stroke();return context.getImageData(0,0,size,size)}
async function showLandingInfo(properties){const latitude=Number(properties.latitude),longitude=Number(properties.longitude),countryField=document.querySelector('#info-country');document.querySelector('#info-name').textContent=properties.name;document.querySelector('#info-id').textContent=properties.id;document.querySelector('#info-lat').textContent=latitude.toFixed(5)+'°';document.querySelector('#info-lng').textContent=longitude.toFixed(5)+'°';countryField.textContent='Identifying…';document.querySelector('#landing-info').hidden=false;try{const countries=await countriesPromise;countryField.textContent=findCountry([longitude,latitude],countries)||'Offshore / not identified'}catch(error){countryField.textContent='Not available';console.warn('Local country lookup failed:',error)}}
function findCountry(point,data){for(const feature of data.features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;if(polygons.some(polygon=>pointInPolygon(point,polygon)))return feature.properties.NAME_EN||feature.properties.NAME||feature.properties.ADMIN}return nearestCountry(point,data,3)}
function pointInPolygon(point,polygon){if(!pointInRing(point,polygon[0]))return false;for(let index=1;index<polygon.length;index++)if(pointInRing(point,polygon[index]))return false;return true}
function pointInRing([x,y],ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))inside=!inside}return inside}
function nearestCountry([x,y],data,maxDegrees){let nearest=null,best=maxDegrees*maxDegrees;for(const feature of data.features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;for(const polygon of polygons)for(const coordinate of polygon[0]){let dx=Math.abs(coordinate[0]-x);dx=Math.min(dx,360-dx)*Math.cos(y*Math.PI/180);const dy=coordinate[1]-y,distance=dx*dx+dy*dy;if(distance<best){best=distance;nearest=feature}}}return nearest?`${nearest.properties.NAME_EN||nearest.properties.NAME||nearest.properties.ADMIN} (nearest coast)`:null}
document.querySelector('#close-info').addEventListener('click',()=>document.querySelector('#landing-info').hidden=true);
function safe(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[c])}
