// Get the samples endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {console.log(data);
});

// Initialize the Dashboard
function init () {

// Create dropdown menu using D3
let dropDownMenu = d3.select("#selDataset");

// Retrieve sample names and populate dropdown menu
d3.json(url).then((data) => {

// Declare sample name variable
let names = data.names;

// Add samples to dropdown menu
        names.forEach((myid) => {

// Console log for each value of ID
            console.log(myid);
            dropDownMenu.append("option")
            .text(myid)
            .property("value", myid);
});

//Create list for sample names
let sampleFirst = names[0];

//Console log the value of sampleFirst
console.log(sampleFirst);

//Create the initial charts and metadata table
createMetaData(sampleFirst);
createBarChart(sampleFirst);
createBubbleChart(sampleFirst);
    });
}
//Updte the graphs with the user chosen values
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    createBarChart(newSample);
    createBubbleChart(newSample);
    createMetadata(newSample);
  }

// Declare function to populate metadata details
function createMetaData(sample) {

// Call out D3 to retrieve all data
d3.json(url).then((data) => {

// Retrieve all metadata
let mymetadata = data.metadata;

// Filter based on the value of the sample
let value = mymetadata.filter(result => result.id == sample);

// Log the array
console.log(value)

// Get the first index from the array
let dataValue = value[0];

// Clear out mymetadata
d3.select("#sample-metadata").html("");

// Use Object.entries to add each value/key pair to the panel
Object.entries(dataValue).forEach(([key,value]) => {

// Console log the individual key/value pairs
console.log(key,value);
d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Declare function for creating bar chart
function createBarChart(sample) {

// Use D3 to retrieve all data
d3.json(url).then((data) => {

// Sample data collection
let mysample = data.samples;

// Filter based upon sample value
let value = mysample.filter(result => result.id == sample);

// Obtain first entry from array
let dataValue = value[0]

// Get the ids, labels and sample values
let otu_ids = dataValue.otu_ids;
let otu_labels = dataValue.otu_labels;
let sample_values = dataValue.sample_values;

// Console log the data
console.log(otu_ids, otu_labels, sample_values); 

// Set top ten items to display (reverse)
let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
let xticks = sample_values.slice(0,10).reverse();
let labels = otu_labels.slice(0,10).reverse();

// Set up the trace for the bar chart
let trace = {
    x:  xticks,
    y:  yticks,
        type: "bar",
        marker: {
            color:  sample_values.slice(0,10).reverse(),
            colorscale:  "Blue",
        },
    text:  labels,
    orientation: "h",
    };

let layout = {title: "Top 10 OTUs"};

// Call Plotly to plot the bar chart
    Plotly.newPlot("bar", [trace],layout)
    });
};

// Declare function to create bubble chart
function createBubbleChart(sample) {

// Use D3 to retrieve all data
    d3.json(url).then((data) => {

// Retrieve all sample data
        let sampleInfo = data.samples;

// Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

// Obtain first entry from array
        let dataValue = value[0];

// Get the ids, labels and sample values
        let otu_ids = dataValue.otu_ids;
        let otu_labels = dataValue.otu_labels;
        let sample_values = dataValue.sample_values;

// Console log the data
        console.log(otu_ids, otu_labels, sample_values); 

// Set up the trace for the bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text:  otu_labels,
            mode:  "markers",
            marker: {
            size:  sample_values,
            color:  otu_ids,
            colorscale:  "Earth"
            }
        };

// Set up the layout
        let layout = {
            title:  "Bacteria(s) per Sample",
            hovermode:  "closest",
            xaxis:  {title: "OTU ID"},
        };

// Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble",[trace1], layout)
 
    });

// Function that updates the dashboard when sample is changed
function optionChanged(value) {

// Log the new value
    console.log(value);

// Call all functions
    createMetaData(value);
    createBarChart(value);
    createBubbleChart(value);
};
};
init();