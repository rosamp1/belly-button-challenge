// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(response) {
    data = response; // Assign the data to the broader scoped variable
    console.log(data);
    init(data);  // Call the init function with the data
  });

// Function to initialize the dashboard
function init(data) {
  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");

  // Use D3 to get sample names and populate the drop-down selector
  let names = data.names;

  names.forEach((id) => {
    dropdownMenu.append("option")
      .text(id)
      .property("value", id);
  });

  // Set the first sample from the list
  let sample_one = names[0];

  // Build the initial plots
  buildMetadata(data, sample_one);
  buildBarChart(data, sample_one);
  buildBubbleChart(data, sample_one);
}

// Function that populates metadata info
function buildMetadata(data, sample) {
  let metadata = data.metadata;
  let value = metadata.find(result => result.id == sample);
  let valueData = value;

  d3.select("#sample-metadata").html("");

  Object.entries(valueData).forEach(([key, value]) => {
    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
  });
}

// Function that builds the bar chart
function buildBarChart(data, sample) {
  let sampleInfo = data.samples;
  let value = sampleInfo.find(result => result.id == sample);
  let valueData = value;

  let otu_ids = valueData.otu_ids;
  let otu_labels = valueData.otu_labels;
  let sample_values = valueData.sample_values;

  let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  let xticks = sample_values.slice(0, 10).reverse();
  let labels = otu_labels.slice(0, 10).reverse();

  let trace = {
    x: xticks,
    y: yticks,
    text: labels,
    type: "bar",
    orientation: "h"
  };

  let layout = {
    title: "Top 10 OTUs Present"
  };

  Plotly.newPlot("bar", [trace], layout);
}

// Function that builds the bubble chart
function buildBubbleChart(data, sample) {
  let sampleInfo = data.samples;
  let value = sampleInfo.find(result => result.id == sample);
  let valueData = value;

  let otu_ids = valueData.otu_ids;
  let otu_labels = valueData.otu_labels;
  let sample_values = valueData.sample_values;

  let trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    }
  };

  let layout = {
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
  };

  Plotly.newPlot("bubble", [trace1], layout);
}

// Function that updates dashboard when sample is changed
function optionChanged(selectedSample) {
  // Call all functions
  buildMetadata(data, selectedSample);
  buildBarChart(data, selectedSample);
  buildBubbleChart(data, selectedSample);
}

d3.json(url).then(function(data) {
    console.log(data);
    init(data);  // Call the init function with the data
  });