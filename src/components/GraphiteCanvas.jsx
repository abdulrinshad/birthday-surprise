import { useRef, useEffect, useState, useCallback } from 'react';
import sketchImgSrc from '../assets/mystery/eshal-main.png';
import { soundFx } from '../utils/audioFx';

// Aspect ratio of eshal-main.png (1089 x 1445)
const ASPECT_RATIO = 1089 / 1445;

/**
 * GraphiteCanvas:
 * Interactive fine-art paper canvas.
 * User drags / brushes black graphite powder across blank white paper to gradually reveal eshal-main.png.
 */
export default function GraphiteCanvas({
  activeTool = 'sponge', // 'stump' | 'sponge' | 'brush'
  brushSize = 'medium',  // 'small' | 'medium' | 'large'
  onCoverageChange,
  isFinishing = false,
  canvasRefCallback
}) {
  const containerRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const sketchCanvasRef = useRef(null);
  const paperTextureRef = useRef(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100, active: false });
  const [powderDustParticles, setPowderDustParticles] = useState([]);

  const lastPosRef = useRef(null);
  const imgRef = useRef(null);
  const logicalSizeRef = useRef({ width: 600, height: 600 / ASPECT_RATIO });
  const lastSampleTimeRef = useRef(0);
  const totalCoverageRef = useRef(0);

  // Load the target sketch image
  useEffect(() => {
    const img = new Image();
    img.src = sketchImgSrc;
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  // Compute tool radius based on selected tool and size
  const getToolRadius = useCallback(() => {
    let base = 38;
    if (activeTool === 'stump') base = 28;
    if (activeTool === 'sponge') base = 56;
    if (activeTool === 'brush') base = 42;

    if (brushSize === 'small') return base * 0.7;
    if (brushSize === 'large') return base * 1.45;
    return base;
  }, [activeTool, brushSize]);

  // Generate procedural fine-art paper texture pattern
  const generatePaperTexture = useCallback((width, height) => {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = width;
    pCanvas.height = height;
    const pCtx = pCanvas.getContext('2d');

    // Warm ivory fine-art watercolor/drawing paper background
    const grad = pCtx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#fdfbf7');
    grad.addColorStop(0.5, '#f8f4ec');
    grad.addColorStop(1, '#f4eee4');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, width, height);

    // Subtle natural paper tooth / fiber speckles
    const imgData = pCtx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const grainStrength = 9;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * grainStrength;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    pCtx.putImageData(imgData, 0, 0);

    // Subtle deckle paper border shading
    pCtx.strokeStyle = 'rgba(180, 160, 140, 0.22)';
    pCtx.lineWidth = 1;
    pCtx.strokeRect(6, 6, width - 12, height - 12);

    paperTextureRef.current = pCanvas;
  }, []);

  // Main composite render loop
  const renderComposite = useCallback(() => {
    const dCanvas = displayCanvasRef.current;
    if (!dCanvas || !maskCanvasRef.current) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ctx = dCanvas.getContext('2d');
    const { width, height } = logicalSizeRef.current;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // 1. Draw base textured fine-art paper
    if (paperTextureRef.current) {
      ctx.drawImage(paperTextureRef.current, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#faf7f2';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Composite the hidden sketch masked by the graphite brush strokes
    if (imageLoaded && imgRef.current && sketchCanvasRef.current) {
      const sCanvas = sketchCanvasRef.current;
      const sCtx = sCanvas.getContext('2d');
      sCtx.clearRect(0, 0, width, height);

      // Draw the graphite mask onto sketch canvas
      sCtx.drawImage(maskCanvasRef.current, 0, 0, width, height);

      // Clip sketch to mask
      sCtx.globalCompositeOperation = 'source-in';
      sCtx.drawImage(imgRef.current, 0, 0, width, height);
      sCtx.globalCompositeOperation = 'source-over';

      // Draw masked sketch onto paper using multiply blend mode (real graphite into paper tooth)
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(sCanvas, 0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    }

    // 3. Draw soft smoky graphite powder dust over brushed areas for physical tactile depth
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(maskCanvasRef.current, 0, 0, width, height);
    ctx.restore();

    // 4. Subtle paper inner vignette
    const vig = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.45,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.72
    );
    vig.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vig.addColorStop(1, 'rgba(50, 35, 25, 0.08)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }, [imageLoaded]);

  // Initialize and resize canvases
  const resizeCanvases = useCallback(() => {
    if (!containerRef.current || !displayCanvasRef.current) return;
    const container = containerRef.current;
    const containerWidth = Math.min(container.clientWidth || 560, 680);
    const logicalWidth = Math.max(300, Math.floor(containerWidth));
    const logicalHeight = Math.floor(logicalWidth / ASPECT_RATIO);

    logicalSizeRef.current = { width: logicalWidth, height: logicalHeight };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dCanvas = displayCanvasRef.current;
    dCanvas.width = logicalWidth * dpr;
    dCanvas.height = logicalHeight * dpr;
    dCanvas.style.width = `${logicalWidth}px`;
    dCanvas.style.height = `${logicalHeight}px`;

    // Maintain mask canvas
    if (!maskCanvasRef.current) {
      maskCanvasRef.current = document.createElement('canvas');
      maskCanvasRef.current.width = logicalWidth;
      maskCanvasRef.current.height = logicalHeight;
      const mCtx = maskCanvasRef.current.getContext('2d');
      mCtx.clearRect(0, 0, logicalWidth, logicalHeight);
    } else {
      const prevMask = maskCanvasRef.current;
      const newMask = document.createElement('canvas');
      newMask.width = logicalWidth;
      newMask.height = logicalHeight;
      const nmCtx = newMask.getContext('2d');
      nmCtx.drawImage(prevMask, 0, 0, logicalWidth, logicalHeight);
      maskCanvasRef.current = newMask;
    }

    // Maintain sketch buffer
    if (!sketchCanvasRef.current) {
      sketchCanvasRef.current = document.createElement('canvas');
    }
    sketchCanvasRef.current.width = logicalWidth;
    sketchCanvasRef.current.height = logicalHeight;

    generatePaperTexture(logicalWidth, logicalHeight);
    renderComposite();
  }, [generatePaperTexture, renderComposite]);

  // Handle window resizing
  useEffect(() => {
    resizeCanvases();
    const handleResize = () => {
      resizeCanvases();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvases]);

  // Calculate coverage percentage via sample grid
  const sampleCoverage = useCallback(() => {
    if (!maskCanvasRef.current) return;
    const mCanvas = maskCanvasRef.current;
    const mCtx = mCanvas.getContext('2d', { willReadFrequently: true });
    if (!mCtx) return;

    const sampleCols = 20;
    const sampleRows = 24;
    const totalSamples = sampleCols * sampleRows;
    let hitCount = 0;

    const stepX = mCanvas.width / (sampleCols + 1);
    const stepY = mCanvas.height / (sampleRows + 1);

    for (let r = 1; r <= sampleRows; r++) {
      for (let c = 1; c <= sampleCols; c++) {
        const x = Math.floor(c * stepX);
        const y = Math.floor(r * stepY);
        const pixel = mCtx.getImageData(x, y, 1, 1).data;
        if (pixel[3] > 25) {
          hitCount++;
        }
      }
    }

    const pct = Math.min(100, Math.round((hitCount / totalSamples) * 100));
    totalCoverageRef.current = pct;
    if (onCoverageChange) {
      onCoverageChange(pct);
    }
  }, [onCoverageChange]);

  // Spawn visual graphite dust particles floating around the brush
  const spawnDustParticles = useCallback((x, y, count = 3) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random().toString(36).substring(2, 9),
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        size: 1.5 + Math.random() * 3,
        opacity: 0.75 + Math.random() * 0.25,
        life: 1.0
      });
    }
    setPowderDustParticles((prev) => [...prev.slice(-30), ...newParticles]);
  }, []);

  // Stamp a graphite powder dab on the mask canvas
  const stampGraphiteDab = useCallback(
    (x, y, radius, opacity = 0.52) => {
      if (!maskCanvasRef.current) return;
      const mCtx = maskCanvasRef.current.getContext('2d');

      const grad = mCtx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
      grad.addColorStop(0.35, `rgba(0, 0, 0, ${opacity * 0.85})`);
      grad.addColorStop(0.7, `rgba(0, 0, 0, ${opacity * 0.45})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      mCtx.save();
      mCtx.fillStyle = grad;
      mCtx.beginPath();
      mCtx.arc(x, y, radius, 0, Math.PI * 2);
      mCtx.fill();

      // Add tiny organic graphite speckles
      const speckleCount = activeTool === 'sponge' ? 6 : 3;
      mCtx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.6})`;
      for (let i = 0; i < speckleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * radius * 0.85;
        const sx = x + Math.cos(angle) * dist;
        const sy = y + Math.sin(angle) * dist;
        const sRadius = 0.6 + Math.random() * 1.4;
        mCtx.beginPath();
        mCtx.arc(sx, sy, sRadius, 0, Math.PI * 2);
        mCtx.fill();
      }

      mCtx.restore();
    },
    [activeTool]
  );

  // Interpolate between two points to ensure silky, unbroken graphite strokes
  const strokeGraphiteLine = useCallback(
    (x0, y0, x1, y1) => {
      const radius = getToolRadius();
      const dx = x1 - x0;
      const dy = y1 - y0;
      const dist = Math.hypot(dx, dy);
      const step = Math.max(4, radius * 0.22);
      const count = Math.max(1, Math.floor(dist / step));

      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const cx = x0 + dx * t;
        const cy = y0 + dy * t;
        const jx = cx + (Math.random() - 0.5) * (radius * 0.15);
        const jy = cy + (Math.random() - 0.5) * (radius * 0.15);
        stampGraphiteDab(jx, jy, radius);
      }

      renderComposite();

      if (Math.random() > 0.4) {
        spawnDustParticles(x1, y1, 2);
      }
    },
    [getToolRadius, stampGraphiteDab, renderComposite, spawnDustParticles]
  );

  // Waft Powder (One-tap graceful graphite sweep)
  const waftPowderAuto = useCallback(() => {
    if (!maskCanvasRef.current || isFinishing) return;
    const { width, height } = logicalSizeRef.current;
    const radius = getToolRadius() * 1.6;

    const count = 10;
    soundFx.startBrushStroke();

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = width * 0.15 + Math.random() * width * 0.7;
        const y = height * 0.15 + Math.random() * height * 0.7;
        stampGraphiteDab(x, y, radius, 0.65);
        renderComposite();
        spawnDustParticles(x, y, 6);
        if (i === count - 1) {
          soundFx.stopBrushStroke();
          sampleCoverage();
        }
      }, i * 45);
    }
  }, [isFinishing, getToolRadius, stampGraphiteDab, renderComposite, spawnDustParticles, sampleCoverage]);

  // Complete / Fill all coverage (Used when finishing sketch)
  const fillAllCoverage = useCallback(() => {
    if (!maskCanvasRef.current) return;
    const mCanvas = maskCanvasRef.current;
    const mCtx = mCanvas.getContext('2d');
    const { width, height } = logicalSizeRef.current;

    mCtx.fillStyle = 'rgba(0, 0, 0, 1)';
    mCtx.fillRect(0, 0, width, height);
    renderComposite();
    if (onCoverageChange) onCoverageChange(100);
  }, [renderComposite, onCoverageChange]);

  // Reset paper back to blank white state
  const resetPaper = useCallback(() => {
    if (!maskCanvasRef.current) return;
    const { width, height } = logicalSizeRef.current;
    const mCtx = maskCanvasRef.current.getContext('2d');
    mCtx.clearRect(0, 0, width, height);
    renderComposite();
    totalCoverageRef.current = 0;
    if (onCoverageChange) onCoverageChange(0);
  }, [renderComposite, onCoverageChange]);

  // Expose methods to parent
  useEffect(() => {
    if (canvasRefCallback) {
      canvasRefCallback({
        waftPowder: waftPowderAuto,
        clearCanvas: resetPaper,
        fillComplete: fillAllCoverage
      });
    }
  }, [canvasRefCallback, waftPowderAuto, resetPaper, fillAllCoverage]);

  // Animate dust particles
  useEffect(() => {
    let animId;
    const updateParticles = () => {
      setPowderDustParticles((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.035,
            life: p.life - 0.035
          }))
          .filter((p) => p.life > 0 && p.opacity > 0);
      });
      animId = requestAnimationFrame(updateParticles);
    };
    animId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Get pointer coordinates relative to canvas
  const getCanvasCoords = (e) => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const scaleX = logicalSizeRef.current.width / rect.width;
    const scaleY = logicalSizeRef.current.height / rect.height;

    return {
      x: x * scaleX,
      y: y * scaleY,
      screenX: clientX,
      screenY: clientY
    };
  };

  const handlePointerDown = (e) => {
    if (isFinishing) return;
    const coords = getCanvasCoords(e);
    setIsDragging(true);
    lastPosRef.current = { x: coords.x, y: coords.y };
    setCursorPos({ x: coords.x, y: coords.y, active: true });

    soundFx.startBrushStroke();
    stampGraphiteDab(coords.x, coords.y, getToolRadius());
    renderComposite();
    spawnDustParticles(coords.x, coords.y, 4);
  };

  const handlePointerMove = (e) => {
    const coords = getCanvasCoords(e);
    setCursorPos({ x: coords.x, y: coords.y, active: true });

    if (!isDragging || isFinishing) return;

    if (lastPosRef.current) {
      strokeGraphiteLine(
        lastPosRef.current.x,
        lastPosRef.current.y,
        coords.x,
        coords.y
      );
    }
    lastPosRef.current = { x: coords.x, y: coords.y };

    const now = Date.now();
    if (now - lastSampleTimeRef.current > 180) {
      lastSampleTimeRef.current = now;
      sampleCoverage();
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      lastPosRef.current = null;
      soundFx.stopBrushStroke();
      sampleCoverage();
    }
  };

  const handlePointerLeave = () => {
    handlePointerUp();
    setCursorPos((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none'
      }}
    >
      {/* Paper Card Frame with Rich Archival Drawing Desk Aesthetics */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${ASPECT_RATIO}`,
          borderRadius: '12px',
          boxShadow:
            '0 28px 70px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(212, 139, 159, 0.18), 0 0 0 1px rgba(220, 195, 180, 0.35)',
          overflow: 'hidden',
          backgroundColor: '#faf7f2',
          cursor: 'crosshair',
          transition: 'box-shadow 0.4s ease'
        }}
      >
        {/* Main Canvas */}
        <canvas
          ref={displayCanvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerLeave}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onTouchCancel={handlePointerUp}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />

        {/* Floating Graphite Dust Particles Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 10
          }}
        >
          {powderDustParticles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                backgroundColor: '#262225',
                opacity: p.opacity,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 4px rgba(20, 18, 20, 0.6)',
                pointerEvents: 'none'
              }}
            />
          ))}
        </div>

        {/* Custom Brush / Blending Stump Cursor Indicator */}
        {cursorPos.active && !isFinishing && (
          <div
            style={{
              position: 'absolute',
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              width: `${getToolRadius() * 2}px`,
              height: `${getToolRadius() * 2}px`,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '1.5px dashed rgba(60, 45, 50, 0.45)',
              backgroundColor: isDragging
                ? 'rgba(30, 25, 28, 0.16)'
                : 'rgba(212, 139, 159, 0.08)',
              pointerEvents: 'none',
              zIndex: 20,
              boxShadow: isDragging
                ? '0 0 12px rgba(0, 0, 0, 0.25)'
                : 'none'
            }}
          >
            {/* Center powder core */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'rgba(25, 20, 24, 0.6)'
              }}
            />
          </div>
        )}

        {/* Subtle Archival Fine-Art Paper Watermark in Corner */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '16px',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-serif)',
            color: 'rgba(120, 100, 90, 0.35)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          ARCHES • 300GSM
        </div>
      </div>
    </div>
  );
}
