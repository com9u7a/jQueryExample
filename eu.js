$(document).ready(function() {
  var data;
  $.getJSON("eu.json")
    .success(function(euData) {
      data=euData;
      var multiplier=4;
      var ranges=dataRanges();
      for (var i=0; i<data.length; i++) {
        var dataPt = data[0];
        $("#map").append("<div class='dataPt' id='" + i + "'>");
        $("#map").append("<span class='dataDetail' data-id='" + i + "'>");
      }
      $(".dataPt").each(function() {
        var id = $(this).attr("id");
        var size = data[id].rate * multiplier;
        $(this).css({
          "top": data[id].y - size/2,
	  "left": data[id].x- size/2,
	  "width": size,
          "height": size,
          "border-radius":size,
          "background-color":getColor(data[id].rate)
     });
    });
     $("#slider").slider({
       range: true,
       min:1,
       max:7,
       range:"min",
       value:multiplier,
       slide: function(event, ui) {
         if (multiplier!=ui.value) {
           multiplier=ui.value;
           $(".dataPt").each(function() {
             var id=$(this).attr("id");
             var newSize=data[id].rate*multiplier;
             $(this).animate({
                   width: newSize,
                   height: newSize
             },"fast");
           });
         }}});
   function dataRanges() {
     var smallest=data[0].rate;
     var largest=data[0].rate;
     var average=0;
     for (var i=0; i< data.length; i++) {
       average=average+data[i].rate;
       if (data[i].rate<smallest) {
        smallest=data[i].rate;
       }
       if (data[i].rate>largest) {
        largest=data[i].rate;
       }
     }
     average=Math.floor(average/data.length);
     var r1=Math.floor(smallest+((average-smallest)/2));
     var r2=Math.floor(largest-((largest-average)/2));
     return new Array( 
        [smallest, r1-0.01, "#0000FF"],
        [r1,average-0.01,"#00FF00"],
        [r2, largest, "#FF0000"]);
    }
    function getColor(rate) {
      for (var i=0;i<ranges.length; i++) {
        if (rate>=ranges[i][0] && rate<=ranges[i][1]) {
            return ranges[i][2];
        }
      }
      return "pink";
    } 
    $(".dataPt").hover(
         function() {
            var id=$(this).attr("id");
            $("span[data-id="+ id +"]").show(200);
            $(this).addClass("dataPtHover");
            $("#detail span").text("Unemployment rate: "+ data[id].rate);
         },
         function() {
            var id=$(this).attr("id");
            $("span[data-id="+ id +"]").hide(200);
            $(this).removeClass("dataPtHover");
            $("#detail span").text("Unemployment rate");
         });
    $(".dataDetail").each(function() {
      var id=$(this).attr("data-id");
      var size=data[id].rate*multiplier;
      $(this).css({
         "top":data[id].y+5,
         "left":data[id].x+size+5
     })
     .html(data[id].country+" (" +data[id].year+")") 
     .hide(); });
   }) 
    .error(function() {
      alert("Couldn't load JSON data");
    })
    .complete(function(xhr, status) {
      console.log("Status: " + status);
    });
});
