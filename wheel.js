const sectors = [
    {color:"#C1FF00", label:"" ,strokeStyle: "#080403" ,borderWidth:2},
    {color:"#B900FF", label:"" ,strokeStyle:"#080403" ,borderWidth:2},
    {color:"#00F0FF", label:"" ,strokeStyle:"#080403" ,borderWidth:2},
    {color:"#F7FF00", label:"" ,strokeStyle:"#080403" ,borderWidth:2},
    {color:"#FF64003", label:"" ,strokeStyle:"#080403" ,borderWidth:2},
    {color:"#f0b", label:"" ,strokeStyle:"#080403" ,borderWidth:2},
    {color:"#7000FF", label:"",strokeStyle:"#080403" ,borderWidth:2},
  ];
  
  // Generate random float in range min-max:
  const rand = (m, M) => Math.random() * (M - m) + m;
  
  const tot = sectors.length;
  const elSpin = document.querySelector("#spin");
  const ctx = document.querySelector("#wheel").getContext`2d`;
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / tot;
  const friction = 0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
  const angVelMin = 0.002; // Below that number will be treated as a stop
  let angVelMax = 0; // Random ang.vel. to accelerate to 
  let angVel = 0;    // Current angular velocity
  let ang = 0;       // Angle rotation in radians
  let isSpinning = false;
  let isAccelerating = false;
  let animFrame = null; // Engine's requestAnimationFrame
  
  //* Get index of current sector */
  const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;
  
  //* Draw sectors and prizes texts to canvas */
  const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color, ctx.strokeStyle = 2, ctx.lineWidth = sector.borderWidth;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
    //
    ctx.restore();
  };
  
  //* CSS rotate CANVAS Element */
  const rotate = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    elSpin.textContent = !angVel ? "SPIN" : sector.label;
    elSpin.font = "bold 30 px comic sans ms" ;
    elSpin.style.background = sector.color;
  };
  
  const frame = () => {
  
    if (!isSpinning) return;
  
    if (angVel >= angVelMax) isAccelerating = false;
  
    // Accelerate
    if (isAccelerating) {
      angVel ||= angVelMin; // Initial velocity kick
      angVel *= 1.06; // Accelerate
    }
    
    // Decelerate
    else {
      isAccelerating = false;
      angVel *= friction; // Decelerate by friction  
  
      // SPIN END:
      if (angVel < angVelMin) {
        isSpinning = false;
        angVel = 0;
        cancelAnimationFrame(animFrame);
      }
    }
  
    ang += angVel; // Update angle
    ang %= TAU;    // Normalize angle
    rotate();      // CSS rotate!
  };
  
  const engine = () => {
    frame();
    animFrame = requestAnimationFrame(engine)
  };
  
  elSpin.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    isAccelerating = true;
    angVelMax = rand(0.25, 0.40);
    engine(); // Start engine!
  });
  
  // INIT!
  sectors.forEach(drawSector);
  rotate(); // Initial rotation