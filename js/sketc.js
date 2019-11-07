//bar graph sketch
var bg = function(b){
    b.setup = function(){
        b.createCanvas(450, 350);
    };
    
    b.draw = function() { 
        var prices = [2.99, 4.00, 1.00, 3.5];
        var lastPrice = 0; 
        b.background(180);
        b.line(40, 300, 370, 300);
        b.line(40, 40, 40, 300);
        for (var i=0; i<prices.length; i++) {
            var adjustedPrice = b.map(prices[i], 0, 2, 0, 120);
            //b.line(i*100, lastPrice, (i+1)*100, height - adjustedPrice);
            //lastPrice = height - adjustedPrice;
        };
    };
};

var barGraph = new p5(bg, 'graph');

//pie chart sketch 
var pc = function(c){
    c.setup = function(){
        c.createCanvas(450, 350);
    };

    c.draw = function(){
        c.background(100);
        c.arc(200,155,290,290,0, c.TWO_PI);
        c.fill(23, 222, 68);
    }
};

var pieChart = new p5(pc, 'chart');
