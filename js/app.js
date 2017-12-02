window.addEventListener('load', function() {
/* TABS */
  var tabs = document.querySelectorAll('.tab');
  var overviewSection = document.querySelector('#overview');
  var studentsSection = document.querySelector('#students');
  var teachersSection = document.querySelector('#teachers');

  function showTab(event) {
    var tab = event.target.textContent;
    switch (true) {
    case (tab === 'Overview'):
      overviewSection.classList.remove('display-none');
      studentsSection.classList.add('display-none');
      teachersSection.classList.add('display-none');
      break;
    case (tab === 'Students'):
      overviewSection.classList.add('display-none');
      studentsSection.classList.remove('display-none');
      teachersSection.classList.add('display-none');
      break;
    case (tab === 'Teachers'):
      overviewSection.classList.add('display-none');
      studentsSection.classList.add('display-none');
      teachersSection.classList.remove('display-none');
      break;
    default:
      overviewSection.classList.add('display-none');
      studentsSection.classList.add('display-none');
      teachersSection.classList.add('display-none');
      break;
    }
  }

  for (var i = 0;i < tabs.length;i++) {
    tabs[i].addEventListener('click', showTab);
  }

  /* Sedes y Generación */
  // Arequipa
  var dataA2017I = document.getElementById('dataA_2017I');
  var dataA2016II = document.getElementById('dataA_2016II');
  // México
  var dataM2017I = document.getElementById('dataM_2017I');
  var dataM2017II = document.getElementById('dataM_2017II');
  // Lima
  var dataL2017I = document.getElementById('dataL_2017I');
  var dataL2017II = document.getElementById('dataL_2017II');
  var dataL2016II = document.getElementById('dataL_2016II');
  // Chile
  var dataC2017I = document.getElementById('dataC_2017I');
  var dataC2017II = document.getElementById('dataC_2017II');
  var dataC2016II = document.getElementById('dataC_2016II');

  dataA2017I.addEventListener('click', function() {
    resultSede('AQP', '2017-1');
  });
  dataA2016II.addEventListener('click', function() {
    resultSede('AQP', '2016-2');
  });
  dataM2017I.addEventListener('click', function() {
    resultSede('CDMX', '2017-1');
  });
  dataM2017II.addEventListener('click', function() {
    resultSede('CDMX', '2017-2');
  });
  dataL2017I.addEventListener('click', function() {
    resultSede('LIM', '2017-1');
  });
  dataL2017II.addEventListener('click', function() {
    resultSede('LIM', '2017-2');
  });
  dataL2016II.addEventListener('click', function() {
    resultSede('LIM', '2016-2');
  });
  dataC2017I.addEventListener('click', function() {
    resultSede('SCL', '2017-1');
  });
  dataC2017II.addEventListener('click', function() {
    resultSede('SCL', '2017-2');
  });
  dataC2016II.addEventListener('click', function() {
    resultSede('SCL', '2016-2');
  });


  /* Funciones que obtienen información */
  function resultSede(branch, generation) {
    enrollment(branch, generation);
    achievement(branch, generation);
    nps(branch, generation);
  };
  /* funciones*/

  function enrollment(branch, generation) {
    var boxStudentsActive = document.querySelector('.students-active');
    var percentageDropout = document.querySelector('.percentage-dropout'); 
    
    
    var totalStudents = data[branch][generation]['students'].length; // 15
    
    var percentageActive = ((active(branch, generation)) * (100 / (totalStudents))).toFixed(1);
    var percentageInactive = ((inactive(branch, generation)) * (100 / (totalStudents))).toFixed(1);
    
    boxStudentsActive.textContent = active(branch, generation);
    percentageDropout.textContent = percentageInactive;
  }
  
  function active(branch, generation) {
    var students = data[branch][generation]['students'];
    var active = 0;
    for (var i = 0; i < students.length; i++) {
      // true o false
      if (students[i]['active'] == true) {
        active++;
      }
    }
    return active;
  };

  function inactive(branch, generation) {
    var students = data[branch][generation]['students'];
    var inactive = 0;
    for (var i = 0; i < students.length; i++) {
      // true o false
      if (students[i]['active'] == false) {
        inactive++;
      }
    }
    return inactive;
  };

  
  function achievement(branch, generation) {    
    var goldensStudents = document.querySelector('.golden-students');
    goldensStudents.textContent = goldenStudents(branch, generation);
    var percentageGoldenStudents = document.querySelector('.percentage-golden');
    percentageGoldenStudents.textContent = percentageGoldenStudents;
  };
 
  function goldenStudents(branch, generation) {
    var students = data[branch][generation]['students'];
    var quantitySprints = data[branch][generation]['students'][0]['sprints'].length;
    var arrHse = [];
    var arrTech = [];
    var acumHse = 0;
    var acumTech = 0;
    var goldenStudent = 0;
    for (var i = 0; i < students.length; i++) {
      for (var j = 0; j < quantitySprints; j++) { 
        var pointsHse = students[i]['sprints'][j]['score']['hse'];
        var pointsTech = students[i]['sprints'][j]['score']['tech'];
        acumHse += pointsHse;
        acumTech += pointsTech;      
      }
      arrHse.push(acumHse / quantitySprints);
      arrTech.push(acumTech / quantitySprints);
      for (var k = 0; k < arrHse.length; k++) {
        if (arrHse[k] >= 840 && arrTech[k] >= 1260) {
          goldenStudent++;
        }  
      }
      return goldenStudent;
    }
  };




  
  function nps(branch, generation) {

  }
});