(() => {
  const data = [
    { month: 1, label: "Gen", observations: 58, share: 0.0387, bloomScore: 0.127 },
    { month: 2, label: "Feb", observations: 179, share: 0.1195, bloomScore: 0.391 },
    { month: 3, label: "Mar", observations: 327, share: 0.2183, bloomScore: 0.714 },
    { month: 4, label: "Apr", observations: 458, share: 0.3057, bloomScore: 1 },
    { month: 5, label: "Mag", observations: 258, share: 0.1722, bloomScore: 0.563 },
    { month: 6, label: "Giu", observations: 69, share: 0.0461, bloomScore: 0.151 },
    { month: 7, label: "Lug", observations: 35, share: 0.0234, bloomScore: 0.076 },
    { month: 8, label: "Ago", observations: 14, share: 0.0093, bloomScore: 0.031 },
    { month: 9, label: "Set", observations: 19, share: 0.0127, bloomScore: 0.041 },
    { month: 10, label: "Ott", observations: 28, share: 0.0187, bloomScore: 0.061 },
    { month: 11, label: "Nov", observations: 15, share: 0.01, bloomScore: 0.033 },
    { month: 12, label: "Dic", observations: 38, share: 0.0254, bloomScore: 0.083 }
  ];

  const svg = d3.select("#flower-timeline");
  if (svg.empty()) return;

  const margin = { top: 36, right: 38, bottom: 52, left: 58 };
  const defs = svg.append("defs");
  const petalGradient = defs.append("radialGradient")
    .attr("id", "timelinePetalGradient")
    .attr("cx", "35%")
    .attr("cy", "28%")
    .attr("r", "75%");

  petalGradient.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff");
  petalGradient.append("stop").attr("offset", "45%").attr("stop-color", "#ff90f0");
  petalGradient.append("stop").attr("offset", "100%").attr("stop-color", "#ff00ba");

  function renderTimeline() {
    const bounds = svg.node().getBoundingClientRect();
    const width = Math.max(320, bounds.width);
    const height = Math.max(420, bounds.height || 480);
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll(".timeline-plot").remove();

    const plot = svg.append("g").attr("class", "timeline-plot");
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, margin.left + innerWidth])
      .padding(0.28);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.observations)]).nice()
      .range([margin.top + innerHeight, margin.top]);

    const yScore = d3.scaleLinear()
      .domain([0, 1])
      .range([margin.top + innerHeight, margin.top]);

    plot.append("g")
      .attr("class", "timeline-grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(""))
      .call(g => g.select(".domain").remove());

    plot.append("g")
      .attr("class", "timeline-axis")
      .attr("transform", `translate(0,${margin.top + innerHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    plot.append("g")
      .attr("class", "timeline-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    plot.selectAll("rect.timeline-bar")
      .data(data)
      .join("rect")
      .attr("class", d => d.observations < 40 ? "timeline-bar is-low" : "timeline-bar")
      .attr("x", d => x(d.label))
      .attr("y", d => y(d.observations))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d.observations));

    const line = d3.line()
      .x(d => x(d.label) + x.bandwidth() / 2)
      .y(d => yScore(d.bloomScore))
      .curve(d3.curveCatmullRom.alpha(0.45));

    plot.append("path")
      .datum(data)
      .attr("class", "timeline-line")
      .attr("d", line);

    const flowers = plot.selectAll("g.timeline-flower")
      .data(data)
      .join("g")
      .attr("class", "timeline-flower")
      .attr("transform", d => `translate(${x(d.label) + x.bandwidth() / 2},${yScore(d.bloomScore)})`);

    flowers.each(function(d) {
      const g = d3.select(this);
      const petalLength = 7 + d.bloomScore * 10;
      const petalWidth = 2.6 + d.bloomScore * 2.2;

      g.selectAll("ellipse.timeline-petal")
        .data(d3.range(10))
        .join("ellipse")
        .attr("class", "timeline-petal")
        .attr("cx", 0)
        .attr("cy", -petalLength * 0.55)
        .attr("rx", petalWidth)
        .attr("ry", petalLength)
        .attr("transform", p => `rotate(${p * 36})`);
    });

    flowers.append("circle")
      .attr("class", "timeline-core")
      .attr("r", d => 3 + d.bloomScore * 4);

    plot.append("text")
      .attr("class", "timeline-label")
      .attr("x", margin.left)
      .attr("y", 20)
      .text("Conteggio osservazioni");

    plot.append("text")
      .attr("class", "timeline-label")
      .attr("x", width - margin.right)
      .attr("y", 20)
      .attr("text-anchor", "end")
      .text("Indice 0-1");
  }

  renderTimeline();
  window.addEventListener("resize", renderTimeline);
})();
