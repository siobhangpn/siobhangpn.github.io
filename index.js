var svg = d3.select("svg"), // selecteert de svg, die kan nu aangepast worden
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40,
    }, // margins worden hier bepaald
    width = +svg.attr("width") - margin.left - margin.right, // width toegevoegd aan svg en margin left en right worden eraf gehaald 
    height = +svg.attr("height") - margin.top - margin.bottom; // hight toegevoegd aan svg en margin top en bottom worden eraf gehaald

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1), // nieuwe bandschaal met het lege domein, eenheid is 0 en padding is 0.1
    y = d3.scaleLinear().rangeRound([height, 0]); // vormt een nieuwe continue schaal met de eenheid 0 van het domein en het bereik van de eenheid

var g = svg.append("g") // groepeert SVG 
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // attr() stelt eigenschappen (attribute) en waardes (values) in of geeft het terug van de geselecteerde elementen

d3.tsv("data.tvs", function (d) { // de data van het tsv wordt in een functie gezet
    d.users = +d.users; // uit += komt een positief getal die op de waardes van de users aansluit
    return d;
}, function (error, data) {
    if (error) throw error; 
    // deze code wordt uitgevoerd wanneer het bestand data.tsv is geladen

    x.domain(data.map(function (d) { // map: de data wordt omgezet in nieuwe elementen, return: waarde terug geven in een functie
        return d.countries;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.users; // max: geeft de maximale waarde terug uit de data
    })]);

    g.append("g") // voegt inhoud toe aan het einde van de gegroepeerde svg
        .attr("class", "axis axis--x")  
        .attr("transform", "translate(0," + height + ")") 
        .call(d3.axisBottom(x)); 

    g.append("g")
        .call(d3.axisLeft(y).ticks(50).tickFormat(d3.format(".3s"))) 
        .attr("class", "axis axis--y") 
        .append("text") 

        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em") 
        .attr("text-anchor", "end") 
        .text("users"); // invulling van tekst bij text anchor

    g.selectAll(".bar") // data per element invoeren
        .data(data) // pakt alle data
        .enter().append("rect") 
        .attr("class", "bar") // class gemaakt voor bar
        .attr("x", function (d) {
            return x(d.countries);
        }) 
        .attr("y", function (d) {
            return y(d.users);
        }) 
        .attr("width", x.bandwidth()) // bandwith geeft de breedte van elke band weer
        .attr("height", function (d) {
            return height - y(d.speakers);
        });
});