// world_model.js
// D3 v7 用の動的ノードマップ（軽量）
// ノードをドラッグ＆クリックで情報を表示

const nodes = [
  { id: "笑顔", group: "center", desc: "中心軸：笑顔。すべての体験がここに還る。" },
  { id: "サッカー", group: "philosophy", desc: "競争と協調の象徴。プレイを通じた共感。" },
  { id: "スタジアム", group: "philosophy", desc: "人々が集う共鳴の場。文化と交流の核。" },
  { id: "平和", group: "philosophy", desc: "互いの違いを讃える社会的状態。" },
  { id: "開放", group: "philosophy", desc: "誰もがアクセスできる空間設計。" },
  { id: "誇り", group: "emotion", desc: "地域やチームへの誇り。" },
  { id: "感動", group: "emotion", desc: "イベントが引き起こす高揚。" },
  { id: "安心", group: "emotion", desc: "安全・安心の基盤。" },
  { id: "共創", group: "system", desc: "住民とAIが共に作るプロセス。" },
  { id: "AI調和", group: "system", desc: "Sakacchi Core による調整と支援。" }
];

const links = [
  { source: "笑顔", target: "サッカー" },
  { source: "笑顔", target: "平和" },
  { source: "笑顔", target: "スタジアム" },
  { source: "笑顔", target: "共創" },
  { source: "共創", target: "AI調和" },
  { source: "サッカー", target: "誇り" },
  { source: "平和", target: "安心" },
  { source: "スタジアム", target: "感動" },
  { source: "感動", target: "笑顔" }
];

const width = 1000, height = 640;
const svg = d3.select("#graph-area")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const defs = svg.append("defs");
defs.append("filter").attr("id","glow")
  .append("feGaussianBlur").attr("stdDeviation", 4).attr("result","coloredBlur");

const colorOf = (g) => {
  if (g === "center") return "#ffd54f";
  if (g === "philosophy") return "#4fb0ff";
  if (g === "emotion") return "#86efac";
  if (g === "system") return "#c4b5fd";
  return "#ccc";
};

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(140))
  .force("charge", d3.forceManyBody().strength(-600))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collision", d3.forceCollide().radius(36));

const link = svg.append("g")
  .attr("stroke", "#9aa9b3")
  .attr("stroke-opacity", 0.7)
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("stroke-width", 2);

const nodeG = svg.append("g")
  .selectAll("g")
  .data(nodes)
  .enter().append("g")
  .call(d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded)
  );

nodeG.append("circle")
  .attr("r", d => d.group === "center" ? 36 : 26)
  .attr("fill", d => colorOf(d.group))
  .attr("stroke", "#fff")
  .attr("stroke-width", 2)
  .style("filter", d => d.group === "center" ? "url(#glow)" : null)
  .on("click", (event, d) => showInfo(d));

nodeG.append("text")
  .text(d => d.id)
  .attr("font-size", 13)
  .attr("text-anchor", "middle")
  .attr("dy", 5);

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  nodeG.attr("transform", d => `translate(${d.x},${d.y})`);
});

// Info panel
function showInfo(d) {
  const panel = document.getElementById("info-content");
  panel.innerHTML = `<h3>${d.id}</h3><p>${d.desc || '説明なし'}</p><p><small>カテゴリー: ${d.group}</small></p>`;
}

// Drag handlers
function dragStarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x; d.fy = d.y;
}
function dragged(event, d) {
  d.fx = event.x; d.fy = event.y;
}
function dragEnded(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  // keep node fixed after drag to allow map editing; comment out to release
  d.fx = d.x; d.fy = d.y;
}

// Reset button
document.getElementById('resetBtn')?.addEventListener('click', () => {
  nodes.forEach(n => { n.fx = null; n.fy = null; });
  simulation.alpha(1).restart();
  document.getElementById("info-content").innerText = "位置をリセットしました。";
});

// Export PNG (simple)
document.getElementById('exportPNG')?.addEventListener('click', () => {
  const svgNode = svg.node();
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgNode);
  // Add name spaces.
  if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const blob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const linka = document.createElement("a");
  linka.href = url;
  linka.download = "sakacchi_world_map.svg";
  document.body.appendChild(linka);
  linka.click();
  document.body.removeChild(linka);
  URL.revokeObjectURL(url);
});
