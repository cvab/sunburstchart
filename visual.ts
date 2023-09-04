
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import * as d3 from 'd3';

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    sunburstchartsvg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    constructor(options: VisualConstructorOptions) {
    //console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
    this.sunburstchartsvg=d3.select(this.target).append("svg").classed("sunburstchartsvg",true);

       
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews); 
     console.log('Visualupdate',);
      //this.sunburstchartsvg.append("circle").attr("cx",100).attr("cy",100).attr("r",40).attr("fill","blue").attr("stroke-width",3);
    
        const width = 700;
        const height = width;
        const radius = width / 15;
        const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, options.dataViews[0].categorical.categories[0].values.length + 1));
        const hierarchy = d3.hierarchy(options.dataViews)
        .sum(d => hierarchy.values)
        .sort((a, b) => b.value - a.value);
        const root = d3.partition()
        .size([2 * Math.PI, hierarchy.height + 1])
        (hierarchy);

        const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 5, width, width])
        .style("font", "5px sans-serif");

        const path = svg.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
       // .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        //.attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        //.attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
       // .attr("d", d => arc(d.current));

        // root.each(hierarchy => options.dataViews= options.dataViews);
        //  const arc = d3.arc()
        //  .startAngle(d => d.x0)
        //  .endAngle(d => d.x1)
        //  .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        //  .padRadius(radius * 1.5)
        //  .innerRadius(d => d.y0 * radius)
        // .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));
 

    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}