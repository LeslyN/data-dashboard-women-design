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
  var sedeGeneral;
  var generation;
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
    generation = '2017-1';
    sedeGeneral = 'AQP';
  });
  dataA2016II.addEventListener('click', function() {
    resultSede('AQP', '2016-2');
    generation = '2016-2';
    sedeGeneral = 'AQP';
  });
  dataM2017I.addEventListener('click', function() {
    resultSede('CDMX', '2017-1');
    generation = '2017-1';
    sedeGeneral = 'CDMX';
  });
  dataM2017II.addEventListener('click', function() {
    resultSede('CDMX', '2017-2');
    generation = '2017-2';
    sedeGeneral = 'CDMX';
  });
  dataL2017I.addEventListener('click', function() {
    resultSede('LIM', '2017-1');
    generation = '2017-1';
    sedeGeneral = 'LIM';
  });
  dataL2017II.addEventListener('click', function() {
    resultSede('LIM', '2017-2');
    generation = '2017-2';
    sedeGeneral = 'LIM';
  });
  dataL2016II.addEventListener('click', function() {
    resultSede('LIM', '2016-2');
    generation = '2016-2';
    sedeGeneral = 'LIM';
  });
  dataC2017I.addEventListener('click', function() {
    resultSede('SCL', '2017-1');
    generation = '2017-1';
    sedeGeneral = 'SCL';
  });
  dataC2017II.addEventListener('click', function() {
    resultSede('SCL', '2017-2');
    generation = '2017-2';
    sedeGeneral = 'SCL';
  });
  dataC2016II.addEventListener('click', function() {
    resultSede('SCL', '2016-2');
    generation = '2016-2';
    sedeGeneral = 'SCL';
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

  
  // Función para crear y añadir el # y % de estudiantes que superan la meta de puntos en promedio de todos los sprints cursado
  function achievement(branch, generation) {
    var goldenStudentsParagraph = document.querySelector('.golden-students');
    // Crea y agrega el # de estudiantes que superan la meta en HSE y Tech
    goldenStudentsParagraph.textContent = studentAchievement(branch, generation);
    var percentageGoldenStudentsParagraph = document.querySelector('.percentage-golden');
    // Crea y agrega el % de estudiantes que superan la meta en HSE y Tech
    percentageGoldenStudentsParagraph.textContent = percentageGoldenStudents(branch, generation) ;
  };

  // Función para calcular el # de estudiantes que superan la meta de 70% de puntos en HSE y Tech
  function studentAchievement(branch, generation) {
    var students = data[branch][generation]['students'];
    var allScoresAverageArr = [];

    for (i = 0; i < students.length; i++) {
      var sumTechScores = 0;
      var sumHseScores = 0;
      if (students[i].active) {
        var numSprint = students[i].sprints.length;
        for (j = 0; j < numSprint; j++) {
          var pointsTech = students[i].sprints[j].score.tech;
          var pointsHSE = students[i].sprints[j].score.hse;
          sumTechScores += pointsTech;
          sumHseScores += pointsHSE;
        }
        var averageTech = sumTechScores / numSprint;
        var averageHSE = sumHseScores / numSprint;
        allScoresAverageArr.push([averageTech, averageHSE]);
      }
    }
    var studentsReachingGoal = 0;
    for (k = 0; k < allScoresAverageArr.length; k++) {
      if (allScoresAverageArr[k][0] >= 1260 && allScoresAverageArr[k][1] >= 840) {
        studentsReachingGoal ++;
      }
    }
    return studentsReachingGoal;
  }

  function percentageGoldenStudents(branch, generation) {
    var percentageGoldenStudent = ((studentAchievement(branch, generation) / active(branch, generation)) * 100).toFixed(1);
    return percentageGoldenStudent;
  }

  function nps(branch, generation) {
    var netPromoter = document.querySelector('.net-promoter-score');
    netPromoter.textContent = averageNet(branch, generation);
  }

  function averageNet(branch, generation) {
    var ratings = data[branch][generation]['ratings'];
    var sumSprints = 0;

    for (var i = 0; i < ratings.length; i++) {
      var sprintPromoters = ratings[i]['nps']['promoters'];
      var sprintDetractors = ratings[i]['nps']['detractors'];
      var sprintPassive = ratings[i]['nps']['passive'];
      var netps = sprintPromoters - sprintDetractors;
      sumSprints += netps;
      var averageNps = sumSprints / ratings.length;
    }
    return averageNps;
  }

  /* Cantidad y porcentaje Tech */
  function techSkills(branch, generation) {
    var students = data[branch][generation]['students'];
    var totalTechArray = [];
    var countTechSp1 = 0, countTechSp2 = 0, countTechSp3 = 0, countTechSp4 = 0;

    for (var i = 0; i < students.length; i++) {
      var quantitySprints = students[i].sprints.length;
      if (students[i].active === true) {
        for (var j = 0; j < quantitySprints; j++) {
          if (students[i].sprints[j].number === 1) {
            var techScoreSp1 = students[i].sprints[j].score.tech;
            if (techScoreSp1 >= 1260) {
              countTechSp1++;
            }
          } else if (students[i].sprints[j].number === 2) {
            var techScoreSp2 = students[i].sprints[j].score.tech;
            if (techScoreSp2 >= 1260) {
              countTechSp2++;
            }
          } else if (students[i].sprints[j].number === 3) {
            var techScoreSp3 = students[i].sprints[j].score.tech;
            if (techScoreSp3 >= 1260) {
              countTechSp3++;
            }
          } else if (students[i].sprints[j].number === 4) {
            var techScoreSp4 = students[i].sprints[j].score.tech;
            if (techScoreSp4 >= 1260) {
              countTechSp4++;
            }
          }
        }
      }
    }
    totalTechArray.push(countTechSp1, countTechSp2, countTechSp3, countTechSp4);
    return totalTechArray;
  }
  
  var select = document.querySelector('.sprint');
  var tech = document.querySelector('.tech');
  select.addEventListener('change', function() {
    var sprint1 = document.querySelector('.sprint-1-t');
    var sprint2 = document.querySelector('.sprint-2-t');
    var sprint3 = document.querySelector('.sprint-3-t');
    if (sprint1.value == 'sprint-1-t') {
      tech.textContent = techSkills(branch, generation)[0];
    }
    if (sprint2.value == 'sprint-2-t') {
      tech.textContent = techSkills(branch, generation)[1];
    }
    if (sprint3.value == 'sprint-3-t') {
      tech.textContent = techSkills(branch, generation)[2];
    }
  });

  /* La cantidad y el porcentaje que representa el total de estudiantes 
   que superan la meta de puntos de HSE en promedio y por sprint. */
  function showHseSkill(branch, generation) {
    var hseStudents = document.querySelector('.skill-students');
    hseStudents.textContent = hseSkills(branch, generation);
    var percentageHseStudents = document.querySelector('.percentage-skill-students');
    percentageHseStudents.textContent = percentageHseSkills(branch, generation);
  }

  /* Total de estudiantes superan meta puntos hse - promedio y sprint */
  function hseSkills(branch, generation, sprint) {
    var students = data[branch][generation]['students'];
    var totalStudentsActive = 0;
    var totalStudentSprint = 0;
    for (var i = 0; i < students.length; i++) {
      var quantitySprints = students[i]['sprints'];
      if (students[i].active) {
        for (var j = 0; j < quantitySprints.length; j++) {
          if (quantitySprints[j]['number'] === sprint && quantitySprints[j]['score']['hse'] >= 840) {
            totalStudentSprint++;
          }
        }
      }
    }
    return totalStudentSprint;
  }
  
  function percentageHseSkills(branch, generation, sprint) {
    var totalStudentActive = active(branch, generation);
    var totalHseSprint = hseSkills(branch, generation, sprint);
    var percentage = ((totalHseSprint / totalStudentActive) * 100).toFixed(1);
    return percentage;
  }

  var sprintHseSkills = document.querySelector('.sprint-hse-skills');
  sprintHseSkills.addEventListener('change', showHseSprint);
  
  function showHseSprint(event) {
    var selectSprint = event.target.value;
    switch (true) {
    case selectSprint === '1':
      document.querySelector('#skill-student').textContent = hseSkills(sedeGeneral, generation, 1);
      percentageHseSkills(sedeGeneral, generation, 1);
      break;
    case selectSprint === '2':
      document.querySelector('#skill-student').textContent = hseSkills(sedeGeneral, generation, 2);
      percentageHseSkills(sedeGeneral, generation, 2);
      break;
    case selectSprint === '3':
      document.querySelector('#skill-student').textContent = hseSkills(sedeGeneral, generation, 3);
      percentageHseSkills(sedeGeneral, generation, 3);
      break;
    case selectSprint === '4':
      document.querySelector('#skill-student').textContent = hseSkills(sedeGeneral, generation, 4);
      percentageHseSkills(sedeGeneral, generation, 4);
      break;
    }
    // sedeGeneral = '';
    // generation = '';
    // return selectSprint;
  }
});