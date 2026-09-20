"use client";
import { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { csv } from "d3-fetch";

interface AnimalDatum {
  name: string;
  speed: number;
  diet: string;
}

export default function AnimalSpeedGraph() {
  const graphRef = useRef<HTMLDivElement>(null);
  const [animalData, setAnimalData] = useState<AnimalDatum[]>([]);

  useEffect(() => {
    csv("/sample_animals.csv", (d) => ({
      name: d.name as string,
      speed: +(d.speed as string),
      diet: d.diet as string,
    }))
      .then((data) => setAnimalData(data as unknown as AnimalDatum[]))
      .catch((err) => console.error("Failed to load animal data", err));
  }, []);

  useEffect(() => {
    if (graphRef.current) graphRef.current.innerHTML = "";
    if (animalData.length === 0) return;

    const width = Math.max(graphRef.current?.clientWidth ?? 800, 600);
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 110, left: 70 };

    const svg = select(graphRef.current!).append<SVGSVGElement>("svg").attr("width", width).attr("height", height);

    const x = scaleBand().domain(animalData.map((d) => d.name)).range([margin.left, width - margin.right]).padding(0.2);
    const y = scaleLinear().domain([0, max(animalData, (d) => d.speed) ?? 0]).nice().range([height - margin.bottom, margin.top]);
    const color = scaleOrdinal<string>().domain(["carnivore", "herbivore", "omnivore"]).range(["#e5533c", "#4caf50", "#3b82f6"]);

    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(axisBottom(x))
      .selectAll("text").attr("transform", "rotate(-40)").style("text-anchor", "end");
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(axisLeft(y));

    svg.append("g").selectAll("rect").data(animalData).join("rect")
      .attr("x", (d) => x(d.name) ?? 0)
      .attr("y", (d) => y(d.speed))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.speed))
      .attr("fill", (d) => color(d.diet));
  }, [animalData]);

  return <div ref={graphRef} className="w-full" />;
}