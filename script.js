$(document).ready(function(){

  /* ===========================
     Constants
  =========================== */
  const manWt            = 181;
  const womanWt          = 152;
  const lbs2kg           = 0.453592;
  const body2biomass     = 0.3;
  const mass2energy      = 0.8;
  const energy2led       = 2;
  const fertlizerTime    = 11;
  const convertPercentage = 0.01;
  const vegePerSqFeet    = 15;
  const fruitPerSqFeet   = 10;
  const flowerPerSqFeet  = 5;
  const alfalfaPerSqFeet = 50;

  /* ===========================
     State
  =========================== */
  let startDate     = new Date();
  let estimateDate  = '';
  let estimateDateA = '';
  let estimateDateB = '';
  let estimateDateC = '';
  let estimateDateD = '';

  let kg, biomass, biogass, electricity;
  let light_hrs, light_days, light_weeks, light_months;
  let cubits, farm;

  let choiceA, choiceB, choiceC, choiceD;
  let choiceA_percent, choiceB_percent, choiceC_percent, choiceD_percent;
  let choiceA_result, choiceB_result, choiceC_result, choiceD_result;

  /* ===========================
     Init
  =========================== */
  $('#date').val(formatDate(startDate));

  $('input, select').on('change keyup', function(){
    localStorage.setItem('mylab-' + $(this).attr('id'), $(this).val());
    update();
    render();
  });

  /* ===========================
     Update (calculations)
  =========================== */
  function update(){
    // Weight → energy
    kg          = roundToTwo(parseInt($('#pounds').val()) * lbs2kg);
    biomass     = roundToTwo(kg * body2biomass);
    biogass     = roundToTwo(biomass * mass2energy);
    electricity = roundToTwo(biogass * energy2led);

    // Energy → light
    light_hrs    = roundToTwo(electricity / 2 * 200);
    light_days   = roundToTwo(light_hrs / 24);
    light_weeks  = roundToTwo(light_days / 7);
    light_months = roundToTwo(light_weeks / 4);

    // Weight → farm area
    let averangeWt = (manWt + womanWt) * lbs2kg / 2;
    cubits = roundToTwo((kg / averangeWt) * 10.0 / 10.0);
    farm   = roundToTwo(cubits * 1 * 1685.49 / 2.5);

    // Plant choices
    choiceA         = parseInt($('#choiceA').val());
    choiceA_percent = parseInt($('#choiceA_percent').val());
    choiceB         = parseInt($('#choiceB').val());
    choiceB_percent = parseInt($('#choiceB_percent').val());
    choiceC         = parseInt($('#choiceC').val());
    choiceC_percent = parseInt($('#choiceC_percent').val());
    choiceD         = parseInt($('#choiceD').val());
    choiceD_percent = parseInt($('#choiceD_percent').val());

    choiceA_result = roundToTwo(farm * choiceA_percent * convertPercentage * vegePerSqFeet);
    choiceB_result = roundToTwo(farm * choiceB_percent * convertPercentage * fruitPerSqFeet);
    choiceC_result = roundToTwo(farm * choiceC_percent * convertPercentage * flowerPerSqFeet);
    choiceD_result = roundToTwo(farm * choiceD_percent * convertPercentage * alfalfaPerSqFeet);

    // Dates
    startDate    = parseDate($('#date').val());
    let clone;

    clone        = new Date(startDate.getTime());
    estimateDate = new Date(clone.setMonth(clone.getMonth() + fertlizerTime));

    clone         = new Date(estimateDate.getTime());
    estimateDateA = new Date(clone.setMonth(clone.getMonth() + choiceA));

    clone         = new Date(estimateDate.getTime());
    estimateDateB = new Date(clone.setMonth(clone.getMonth() + choiceB));

    clone         = new Date(estimateDate.getTime());
    estimateDateC = new Date(clone.setMonth(clone.getMonth() + choiceC));

    clone         = new Date(estimateDate.getTime());
    estimateDateD = new Date(clone.setMonth(clone.getMonth() + choiceD));
  }

  /* ===========================
     Render (DOM updates)
  =========================== */
  function render(){
    $('#dateTime').text(formatDate(startDate));
    $('#estimateTime').text(formatDate(estimateDate));
    $('#estimateTimeA').text(formatDate(estimateDateA));
    $('#estimateTimeB').text(formatDate(estimateDateB));
    $('#estimateTimeC').text(formatDate(estimateDateC));
    $('#estimateTimeD').text(formatDate(estimateDateD));

    $('#pounds2kgs').html(kg);
    $('#weight2biomass').html(biomass);
    $('#biomass2biogas').html(biogass);
    $('#biogas2electricity').html(electricity);
    $('#electricity2lighthrs').html(light_hrs);
    $('#lighthrs2lightdays').html(light_days);
    $('#lightdays2lightweeks').html(light_weeks);
    $('#lightweeks2lightmonths').html(light_months);
    $('#pounds2Farmcubits').html(cubits);
    $('#cubic2farm').html(farm);

    $('#choiceA_value').text(choiceA);
    $('#choiceB_value').text(choiceB);
    $('#choiceC_value').text(choiceC);
    $('#choiceD_value').text(choiceD);

    $('#choiceA_result').text(choiceA_result);
    $('#choiceB_result').text(choiceB_result);
    $('#choiceC_result').text(choiceC_result);
    $('#choiceD_result').text(choiceD_result);

    $('#choiceA_text').text($('#choiceA option[value="' + choiceA + '"]').text());
    $('#choiceB_text').text($('#choiceB option[value="' + choiceB + '"]').text());
    $('#choiceC_text').text($('#choiceC option[value="' + choiceC + '"]').text());
    $('#choiceD_text').text($('#choiceD option[value="' + choiceD + '"]').text());

    // Flower images
    $('#flower-image').empty();
    let choiceAnum = parseInt(choiceA_result / 1000);
    for(let i = 0; i < choiceAnum; i++){
      $('#flower-image').append('<img src="https://cdn.glitch.global/444f298c-80fc-42c2-b39c-741819b0b280/Birthday-Flowers-Colors.jpg?v=1659460618912" alt="flowers" />');
    }

    // Veg images
    $('#veg-image').empty();
    let choiceBnum = parseInt(choiceB_result / 1000);
    for(let i = 0; i < choiceBnum; i++){
      $('#veg-image').append('<img src="https://cdn.glitch.global/444f298c-80fc-42c2-b39c-741819b0b280/tomatoes-1296x728-feature.jpg?v=1659460618425" alt="vegetables" />');
    }

    // Fruit images
    $('#fruit-image').empty();
    let choiceCnum = parseInt(choiceC_result / 1000);
    for(let i = 0; i < choiceCnum; i++){
      $('#fruit-image').append('<img src="https://cdn.glitch.global/444f298c-80fc-42c2-b39c-741819b0b280/1438480.jpg?v=1659460618367" alt="fruit" />');
    }

    // Alfalfa images
    $('#alfalfa-image').empty();
    let choiceDnum = parseInt(choiceD_result / 1000);
    for(let i = 0; i < choiceDnum; i++){
      $('#alfalfa-image').append('<img src="https://cdn.glitch.global/444f298c-80fc-42c2-b39c-741819b0b280/alfalfa.jpg?v=1659460618387" alt="alfalfa" />');
    }
  }

  /* ===========================
     Helpers
  =========================== */
  function parseDate(str){
    var b = str.split(/\D/);
    return new Date(b[0], --b[1], b[2]);
  }

  function formatDate(d){
    var month = '' + (d.getMonth() + 1),
        day   = '' + d.getDate(),
        year  = d.getFullYear();
    if(month.length < 2) month = '0' + month;
    if(day.length < 2)   day   = '0' + day;
    return [year, month, day].join('-');
  }

  function roundToTwo(num){
    return +(Math.round(num + "e+1") + "e-1");
  }

  /* ===========================
     Cursor
  =========================== */
  let cursor = $('.cursor');
  $(document).on('mousemove', function(e){
    cursor.css({ top: e.clientY + 'px', left: e.clientX + 'px' });
  }).on('click', function(){
    cursor.addClass('expand');
    setTimeout(function(){ cursor.removeClass('expand'); }, 500);
  });

});
