import React, { useEffect, useRef } from 'react';

/**
 * CircuitBoardAnimation - ECE-themed animated background
 * Draws animated circuit traces, data nodes, and signal pulses
 */
const CircuitBoardAnimation = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;

    const resize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Circuit nodes
    const nodes = [];
    const nodeCount = Math.floor((width * height) / 25000);
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: []
      });
    }

    // Create connections (circuit traces)
    nodes.forEach((node, i) => {
      const sorted = nodes
        .map((n, j) => ({ node: n, dist: Math.hypot(n.x - node.x, n.y - node.y), idx: j }))
        .filter(n => n.idx !== i)
        .sort((a, b) => a.dist - b.dist);
      
      const connectionCount = Math.floor(Math.random() * 2) + 1;
      for (let c = 0; c < Math.min(connectionCount, sorted.length); c++) {
        if (sorted[c].dist < 200) {
          node.connections.push(sorted[c].idx);
        }
      }
    });

    // Data packets flowing through traces
    const packets = [];
    for (let i = 0; i < 8; i++) {
      const fromIdx = Math.floor(Math.random() * nodes.length);
      const from = nodes[fromIdx];
      if (from.connections.length > 0) {
        const toIdx = from.connections[Math.floor(Math.random() * from.connections.length)];
        packets.push({
          fromIdx,
          toIdx,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.005,
          color: ['#06b6d4', '#8b5cf6', '#10b981'][Math.floor(Math.random() * 3)]
        });
      }
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // Draw circuit traces (connections)
      ctx.lineWidth = 0.5;
      nodes.forEach((node, i) => {
        node.connections.forEach(j => {
          const target = nodes[j];
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6, 182, 212, 0.08)`;
          
          // Draw right-angle traces (like PCB)
          const midX = node.x + (target.x - node.x) * 0.5;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(midX, node.y);
          ctx.lineTo(midX, target.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw nodes with pulse
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.5 + 0.5;
        const alpha = 0.15 + pulse * 0.25;
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.2})`;
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.fill();
      });

      // Animate data packets
      packets.forEach(packet => {
        packet.progress += packet.speed;
        if (packet.progress >= 1) {
          // Reset to a new random path
          packet.progress = 0;
          packet.fromIdx = packet.toIdx;
          const from = nodes[packet.fromIdx];
          if (from.connections.length > 0) {
            packet.toIdx = from.connections[Math.floor(Math.random() * from.connections.length)];
          }
        }

        const from = nodes[packet.fromIdx];
        const to = nodes[packet.toIdx];
        if (!from || !to) return;

        // Calculate position along the right-angle path
        const midX = from.x + (to.x - from.x) * 0.5;
        let px, py;
        const t = packet.progress;
        
        if (t < 0.33) {
          const lt = t / 0.33;
          px = from.x + (midX - from.x) * lt;
          py = from.y;
        } else if (t < 0.66) {
          const lt = (t - 0.33) / 0.33;
          px = midX;
          py = from.y + (to.y - from.y) * lt;
        } else {
          const lt = (t - 0.66) / 0.34;
          px = midX + (to.x - midX) * lt;
          py = to.y;
        }

        // Draw packet with trail
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = packet.color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.6 }}
    />
  );
};

export default CircuitBoardAnimation;
