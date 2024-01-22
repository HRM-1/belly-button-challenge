document.addEventListener("DOMContentLoaded", function () {
    const jsonPath = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

    // Use D3 to fetch the data
    d3.json(jsonPath)
        .then(data => {
            // Do something with the fetched data
            console.log("Fetched data:", data);

            // Get sample names from the data
            const sampleNames = data.names;

            // Populate the dropdown menu
            const dropdown = document.getElementById('selDataset');
            sampleNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                dropdown.add(option);
            });

            // Initial chart display
            updateCharts(sampleNames[0], data.samples, data.metadata);

            // Function to update the charts based on selected sample ID
            function updateCharts(sampleID, samples, metadata) {
                const selectedSample = samples.find(sample => sample.id === sampleID);
                const selectedMetadata = metadata.find(meta => meta.id === parseInt(sampleID));

                // Bar Chart
                const barTrace = {
                    x: selectedSample.sample_values.slice(0, 10).reverse(),
                    y: selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
                    type: 'bar',
                    orientation: 'h',
                    text: selectedSample.otu_labels.slice(0, 10).reverse(),
                };

                const barLayout = {
                    title: `Top 10 OTUs for Sample ${sampleID}`,
                    xaxis: { title: 'Sample Values' },
                    yaxis: { title: 'OTU IDs' },
                    
                };

                Plotly.newPlot('bar', [barTrace], barLayout);

                // Bubble Chart
                const bubbleTrace = {
                    x: selectedSample.otu_ids,
                    y: selectedSample.sample_values,
                    mode: 'markers',
                    marker: {
                        size: selectedSample.sample_values,
                        color: selectedSample.otu_ids,
                    },
                    text: selectedSample.otu_labels,
                };

                const bubbleLayout = {
                    title: `Bubble Chart for Sample ${sampleID}`,
                    xaxis: { title: 'OTU IDs' },
                    yaxis: { title: 'Sample Values' },
                };

                Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

                // Display metadata
                const metadataContainer = document.getElementById('sample-metadata');
                metadataContainer.innerHTML = ''; // Clear existing content

                Object.entries(selectedMetadata).forEach(([key, value]) => {
                    const metadataItem = document.createElement('p');
                    metadataItem.textContent = `${key}: ${value}`;
                    metadataContainer.appendChild(metadataItem);
                });
            }

            // Event listener for dropdown change
            dropdown.addEventListener('change', function () {
                const selectedSampleID = this.value;
                updateCharts(selectedSampleID, data.samples, data.metadata);
            });
        })
        .catch(error => {
            console.error("Error loading data:", error);
        });
});
