function _final(__query,FileAttachment,invalidation){return(
__query(FileAttachment("final@2.csv"),{from:{table:"final"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _states(topojson,us){return(
topojson.feature(us, us.objects.states)
)}

function _4(Plot,states,final){return(
Plot.plot({ // Initialize the plot
  projection: "albers-usa", // Set the projection
  marks: [
    Plot.geo(states), // Add the state boundaries
    Plot.dot(final, { // Create dot marks (bubbles) using data from power_plants
      x: "lon", // Provide longitude values
      y: "lat", // Provide latitude values
      r: "count", // Update bubble radius based on this variable's value
      fill: "Red",
      opacity: .5
    })
  ],
  color:{
    scheme: "Sinebow" // use the "accent" scheme
  },
  height: 500, // Update canvas height
  width: 800, // Update canvas width
  margin: 50 // Update margins
})
)}

function _5(Plot,states,final){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(states, { fill: "white", stroke: "#e2e2e2" }), // Updated stroke color for state boundaries
    Plot.dot(final, {
      x: "lon",
      y: "lat",
      r: "count",
      fill: "cause", // Update dot fill color to depend on primary source (variable: PrimSource)
      opacity: 0.7 // Decrease opacity (0 = transparent, 1 = opaque)
    })
  ],
  r: { range: [1, 10] }, // Limit the size range for dot radii
  color: {
    legend: true, 
    scheme: "Sinebow" // use the "accent" scheme
  }, // Include a legend for the fill color
  height: 500,
  width: 800,
  margin: 50
})
)}

function _6(Plot,states,final){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(states, { fill: "white", stroke: "#e2e2e2"  }),
    Plot.dot(final, {
      x: "lon",
      y: "lat",
      r: "count",
      fill: "cause",
      opacity: 0.7
    }),
    Plot.dot(final, { // Can you figure out what this additional Plot.dot layer adds?
      x: "lon",
      y: "lat",
      r: "cause",
      fill: "cause",
      stroke: "black",
      filter: d => d.count > 50
    }),
    Plot.text(final, { // Add text to the map using data from us_power_plants
      x: "lon", // Place text horizontally at plant longitude
      y: "lat", // Place text vertically at plant latitude
      text: "loc", // The text that appears is the value from the Plant_Name column,
      filter: (d) => d.count > 50, // Only add text for plants with capacity exceeding 3500 MW
      fontSize: 12, // Increased font size
      fontWeight: 600, // Increased font weight
      stroke: "white", // Adds white outer stroke to text (for readability)
      fill: "black", // Text fill color
      textAnchor: "start", // Left align text with the x- and y-coordinates
      dx: 15 // Shifts text to the right (starting from left alignment with coordinate)
    })
  ],
  r: { range: [1, 15] },
  color: {
    legend: true, 
    scheme: "Sinebow" // use the "accent" scheme
  },
  height: 500,
  width: 800,
  margin: 50
})
)}

function _7(Plot,states,final){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(states, { fill: "#eaeaea", stroke: "white" }),
    Plot.dot(
      final,
      Plot.hexbin(
        { r: "count", fill: "count" },
        { x: "lon", y: "lat" }
      )
    )
  ],
  height: 500,
  width: 800,
  margin: 50,
  r: { range: [0, 15] },
  color: {
    legend: true,
    label: "Number of Deaths",
    scheme: "cool"
  }
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: new URL("./files/783cf2bf259e16d662d92c9f59ec97e564c50841c5984f2bb6f65a6d31f8c1b80846bffb65cb654dc2b587ac96f0007ab68c24bacce33655fd785e46020aff74.json", import.meta.url), mimeType: "application/json", toString}],
    ["final@2.csv", {url: new URL("./files/89f4b4268730046e6c3179ef766dca086e8802c36c72865a21dc9ff480520568db13a0a0094b066e0775c8f80bde931b17ffe548543b90d0907a3955c5c58c86.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("final")).define("final", ["__query","FileAttachment","invalidation"], _final);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("states")).define("states", ["topojson","us"], _states);
  main.variable(observer()).define(["Plot","states","final"], _4);
  main.variable(observer()).define(["Plot","states","final"], _5);
  main.variable(observer()).define(["Plot","states","final"], _6);
  main.variable(observer()).define(["Plot","states","final"], _7);
  return main;
}
